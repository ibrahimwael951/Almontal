"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { User } from "@/types/user";
import { LoginPayload } from "@/types/LoginPayload";
import { RegisterPayload } from "@/types/RegisterPayload";
import { AuthTokens } from "@/types/authtokens";

// ---------- Types ----------

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  api: AxiosInstance;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---------- Config ----------

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

const ENDPOINTS = {
  register: "/Auth/register",
  login: "/Auth/Login",
  refresh: "/Auth/refresh",
  revoke: "/Auth/revoke",
  me: "/Auth/me",
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const REFRESH_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

// ---------- Provider ----------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const accessTokenRef = useRef<string | null>(null);
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const apiRef = useRef<AxiosInstance>(
    axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );
  const api = apiRef.current;

  // ----- token persistence helpers -----

  const persistTokens = useCallback((tokens: AuthTokens) => {
    setAccessToken(tokens.token);
    accessTokenRef.current = tokens.token;
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }, []);

  const clearTokens = useCallback(() => {
    setAccessToken(null);
    accessTokenRef.current = null;
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }, []);

  // ----- core auth actions -----

  const fetchMe = useCallback(async (): Promise<User> => {
    const res = await api.get<User>(ENDPOINTS.me);
    setUser(res.data);
    return res.data;
  }, [api]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const res = await api.post<AuthTokens>(ENDPOINTS.login, payload);
      persistTokens(res.data);
      await fetchMe();
    },
    [api, persistTokens, fetchMe],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await api.post<AuthTokens>(ENDPOINTS.register, payload);
      persistTokens(res.data);
      await fetchMe();
    },
    [api, persistTokens, fetchMe],
  );

  const refreshSession = useCallback(async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      clearTokens();
      return null;
    }

    try {
      const res = await axios.post<AuthTokens>(
        `${BASE_URL}${ENDPOINTS.refresh}`,
        { refreshToken },
      );
      persistTokens(res.data);
      return res.data.token;
    } catch (err) {
      console.log(err);
      clearTokens();
      return null;
    }
  }, [persistTokens, clearTokens]);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      if (refreshToken) {
        await api.post(ENDPOINTS.revoke, { refreshToken });
      }
    } catch (err) {
      console.log(err);
    } finally {
      clearTokens();
    }
  }, [api, clearTokens]);

  // ----- axios interceptors: attach token, auto-refresh on 401 -----

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = accessTokenRef.current;
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
    );

    let refreshPromise: Promise<string | null> | null = null;

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        const isAuthEndpoint =
          originalRequest?.url?.includes(ENDPOINTS.login) ||
          originalRequest?.url?.includes(ENDPOINTS.refresh) ||
          originalRequest?.url?.includes(ENDPOINTS.register);

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          originalRequest._retry = true;

          if (!refreshPromise) {
            refreshPromise = refreshSession().finally(() => {
              refreshPromise = null;
            });
          }

          const newToken = await refreshPromise;

          if (newToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api, refreshSession]);

  // ----- bootstrap session on first load -----

  useEffect(() => {
    const bootstrap = async () => {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!storedAccessToken && !storedRefreshToken) {
        setIsLoading(false);
        return;
      }

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        accessTokenRef.current = storedAccessToken;
      }

      try {
        await fetchMe();
      } catch (err) {
        console.log(err);
        const newToken = await refreshSession();
        if (newToken) {
          try {
            await fetchMe();
          } catch (err2) {
            console.log(err2);
            clearTokens();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  // ----- proactive refresh every 3 minutes while logged in -----

  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(() => {
      refreshSession();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [accessToken, refreshSession]);

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshSession,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------- Hook ----------

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
