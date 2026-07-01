import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/src/lib/config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
