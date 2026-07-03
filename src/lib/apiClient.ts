import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/src/lib/config";
import { tokenStore } from "@/src/lib/tokenStore";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        tokenStore.setAccessToken(data.access_token);
        return data.access_token as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }

      tokenStore.setAccessToken(null);
    }

    return Promise.reject(error);
  },
);

const get = <T>(url: string, config?: AxiosRequestConfig) =>
  axiosInstance.get<T>(url, config).then((response) => response.data);

const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  axiosInstance.post<T>(url, data, config).then((response) => response.data);

const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  axiosInstance.put<T>(url, data, config).then((response) => response.data);

const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  axiosInstance.patch<T>(url, data, config).then((response) => response.data);

const del = <T>(url: string, config?: AxiosRequestConfig) =>
  axiosInstance.delete<T>(url, config).then((response) => response.data);

const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default api;
export { axiosInstance };
