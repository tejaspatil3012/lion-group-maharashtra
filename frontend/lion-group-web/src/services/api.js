import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5128/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  timeout: 15000
});

// Response interceptor to unwrap standardized ApiResponse<T>
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Unable to connect to the server. Please check your internet connection.";
    return Promise.reject(new Error(errorMsg));
  }
);

export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${BACKEND_URL}${clean}`;
};

export default api;
