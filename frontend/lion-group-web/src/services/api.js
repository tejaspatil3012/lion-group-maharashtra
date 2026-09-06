import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5128/api";

// Render free-tier cold starts take between 30 to 60+ seconds.
// Set generous client timeout so initial request is not prematurely aborted.
const DEFAULT_TIMEOUT_MS = 60000;
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [2000, 3500, 5000];

// Server status event subscribers
const statusSubscribers = new Set();

let currentStatus = {
  isWakingUp: false,
  isRetrying: false,
  retryAttempt: 0,
  maxRetries: MAX_RETRIES,
  status: "idle", // 'idle' | 'waking_up' | 'retrying' | 'connected' | 'error'
  message: ""
};

export const getServerStatus = () => ({ ...currentStatus });

export const subscribeServerStatus = (callback) => {
  statusSubscribers.add(callback);
  // Emit current status immediately upon subscription
  try {
    callback(getServerStatus());
  } catch (err) {
    console.error("Error in server status subscriber:", err);
  }
  return () => {
    statusSubscribers.delete(callback);
  };
};

const notifyStatus = (partial) => {
  currentStatus = { ...currentStatus, ...partial };
  statusSubscribers.forEach((cb) => {
    try {
      cb(getServerStatus());
    } catch (err) {
      console.error("Error calling server status subscriber:", err);
    }
  });
};

let activeRequestsCount = 0;
let slowRequestTimers = new Map();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  timeout: DEFAULT_TIMEOUT_MS
});

// Request Interceptor: Track start time and slow request timer
api.interceptors.request.use(
  (config) => {
    activeRequestsCount++;

    // Attach JWT Authorization Bearer token if present
    const token = localStorage.getItem("lion_admin_token") || sessionStorage.getItem("lion_admin_token");
    if (token) {
      config.headers = config.headers || {};
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Unique requestId
    const reqId = `${config.method || "get"}_${config.url}_${Date.now()}_${Math.random()}`;
    config._reqId = reqId;

    // If this request takes more than 3.5 seconds, notify that backend is waking up
    const timer = setTimeout(() => {
      notifyStatus({
        isWakingUp: true,
        status: currentStatus.isRetrying ? "retrying" : "waking_up",
        message: "Server is waking up after inactivity..."
      });
    }, 3500);

    slowRequestTimers.set(reqId, timer);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: unwrap ApiResponse<T>, handle retry logic on cold start / timeouts
api.interceptors.response.use(
  (response) => {
    // Clear slow timer
    if (response.config?._reqId && slowRequestTimers.has(response.config._reqId)) {
      clearTimeout(slowRequestTimers.get(response.config._reqId));
      slowRequestTimers.delete(response.config._reqId);
    }

    activeRequestsCount = Math.max(0, activeRequestsCount - 1);

    // If server was waking up or retrying, show brief connected state then return to idle
    if (currentStatus.isWakingUp || currentStatus.isRetrying) {
      notifyStatus({
        isWakingUp: false,
        isRetrying: false,
        retryAttempt: 0,
        status: "connected",
        message: "Connected to server!"
      });

      setTimeout(() => {
        if (activeRequestsCount === 0 && currentStatus.status === "connected") {
          notifyStatus({ status: "idle", message: "" });
        }
      }, 3000);
    }

    return response.data;
  },
  async (error) => {
    const config = error.config;

    // Clear slow timer for this request
    if (config?._reqId && slowRequestTimers.has(config._reqId)) {
      clearTimeout(slowRequestTimers.get(config._reqId));
      slowRequestTimers.delete(config._reqId);
    }

    // Determine if the error is retryable (Cold start, Render 502/503/504, timeout, network error)
    const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.message === "Network Error";
    const isTimeout = error.code === "ECONNABORTED" || (error.message && error.message.toLowerCase().includes("timeout"));
    const statusCode = error.response?.status;
    const isGatewayOrServerError = statusCode === 502 || statusCode === 503 || statusCode === 504 || statusCode === 408;

    const isRetryable = isNetworkError || isTimeout || isGatewayOrServerError;

    // Allow retry on GET requests automatically, or if network failed before reaching backend
    const method = (config?.method || "get").toLowerCase();
    const canRetryMethod = method === "get" || method === "head" || method === "options" || isTimeout || isNetworkError;

    if (config && isRetryable && canRetryMethod) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        const delayMs = RETRY_DELAYS_MS[config._retryCount - 1] || 3000;

        // Notify UI of retry attempt
        notifyStatus({
          isWakingUp: true,
          isRetrying: true,
          retryAttempt: config._retryCount,
          maxRetries: MAX_RETRIES,
          status: "retrying",
          message: `Server is waking up. Retrying request (${config._retryCount}/${MAX_RETRIES})...`
        });

        // Wait designated backoff delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        // Decrement count for the failed attempt before starting the retry attempt
        activeRequestsCount = Math.max(0, activeRequestsCount - 1);

        // Re-execute request
        return api(config);
      }
    }

    // Retries exhausted or non-retryable error
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);

    if (activeRequestsCount === 0) {
      notifyStatus({
        isWakingUp: false,
        isRetrying: false,
        retryAttempt: 0,
        status: "error",
        message: isTimeout
          ? "Server took too long to respond."
          : (error.response?.data?.message || "Failed to communicate with server.")
      });
    }

    let validationDetails = null;
    if (error.response?.data?.errors && typeof error.response.data.errors === "object") {
      const allErrors = Object.values(error.response.data.errors).flat();
      if (allErrors.length > 0) {
        validationDetails = allErrors.join(" ");
      }
    }

    const errorMsg =
      error.response?.data?.message ||
      validationDetails ||
      (isTimeout
        ? "The server took too long to respond. It may still be waking up from sleep. Please try again."
        : error.message || "Unable to connect to the server. Please check your internet connection.");

    const err = new Error(errorMsg);
    err.response = error.response;
    err.data = error.response?.data;
    return Promise.reject(err);
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
