import { AxiosInstance } from "axios";

async function uploadFile(
  api: AxiosInstance,
  endpoint: string,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<{ url: string } | string>(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return typeof res.data === "string" ? res.data : res.data.url;
}

export function uploadImage(api: AxiosInstance, file: File) {
  return uploadFile(api, "/Media/upload-image", file);
}

export function uploadVideo(api: AxiosInstance, file: File) {
  return uploadFile(api, "/Media/upload-video", file);
}

export function uploadReceipt(api: AxiosInstance, file: File) {
  return uploadFile(api, "/api/Media/upload-receipt", file);
}
