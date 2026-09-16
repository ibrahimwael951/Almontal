"use client";

import { useMemo } from "react";
import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useApi() {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    let refreshPromise: Promise<string | null> | null = null;

    const refreshToken = async (): Promise<string | null> => {
      const storedRefresh = localStorage.getItem("refresh_token");
      if (!storedRefresh) return null;

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: storedRefresh,
        });
        const { accessToken, refreshToken: newRefresh } = res.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefresh);
        return accessToken;
      } catch (err) {
        console.log(err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return null;
      }
    };

    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/")
        ) {
          originalRequest._retry = true;

          if (!refreshPromise) {
            refreshPromise = refreshToken().finally(() => {
              refreshPromise = null;
            });
          }

          const newToken = await refreshPromise;

          if (newToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        }

        return Promise.reject(error);
      },
    );

    return instance;
  }, []);

  return api;
}
