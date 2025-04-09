import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logout as userLogout } from "../redux/slices/userSlice";
import { store } from "../redux/store";
import toast from "react-hot-toast";
import {HttpStatusCode} from "../utils/enums"

declare module 'axios' {interface InternalAxiosRequestConfig {_retry?: boolean;}}
const apiUrl = import.meta.env.VITE_API_KEY as string

export const userInstance: AxiosInstance = axios.create({baseURL: apiUrl,withCredentials: true,});

const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    console.log("Attempting token refresh...");
    await userInstance.post("/api/auth/refresh-token");
    return userInstance(originalRequest);
  } catch (error) {
    await handleTokenError(error as AxiosError);
    throw error;
  }
};

const handleTokenError = async (error: AxiosError) => {
  console.log("Token error trying to logout...",error);
  store.dispatch(userLogout());
  try {
    const result = await userInstance.post("/api/auth/logout");
    toast.success(result.data.message);
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};
const handleSubscriptionError = async (error: AxiosError) => {
  console.log("Subscription error trying to logout...",error);
  
  const message = (error.response?.data as { message?: string })?.message || "Subscription error occurred!";
  toast.error(message);
};


userInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("Error:=======>", error);
    
    const originalRequest = error.config as InternalAxiosRequestConfig;
    if (error.response?.status === HttpStatusCode.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }
    if (error.response?.status === HttpStatusCode.FORBIDDEN && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenError(error);
    }
    if (error.response?.status === HttpStatusCode.CONFLICT && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleSubscriptionError(error);
    }
    return Promise.reject(error);
  }
);