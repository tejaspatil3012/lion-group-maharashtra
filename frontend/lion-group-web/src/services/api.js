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
export const SUPABASE_STORAGE_URL = "https://cmvynbqmalnflnwcfvre.supabase.co/storage/v1/object/public/uploads";

export const getImageUrl = (url) => {
  if (!url) return "";
  
  // 1. Direct Supabase Storage URL or inline data / blob
  if (url.includes("supabase.co") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // 2. Fix legacy localhost URLs saved in DB by pointing directly to Supabase storage
  if (url.includes("localhost") && url.includes("/uploads/")) {
    const fileName = url.split("/uploads/").pop();
    if (fileName) return `${SUPABASE_STORAGE_URL}/${fileName}`;
  }

  // 3. Other full HTTP/HTTPS URLs (e.g. Unsplash)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // 4. Relative /uploads/ path -> prioritize Supabase Storage bucket
  const clean = url.startsWith("/") ? url : `/${url}`;
  if (clean.startsWith("/uploads/")) {
    const fileName = clean.replace(/^\/uploads\//, "");
    if (fileName && !fileName.includes("/")) {
      return `${SUPABASE_STORAGE_URL}/${fileName}`;
    }
  }

  return `${BACKEND_URL}${clean}`;
};

export default api;
