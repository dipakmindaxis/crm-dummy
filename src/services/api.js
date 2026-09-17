import axios from "axios";
import { getActiveApiBaseUrl } from "../config/api";

/**
 * Central Axios Instance for ASP.NET Core API
 */
const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Dynamic baseURL interceptor so it always uses the current configured Base URL
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getActiveApiBaseUrl();

    // Construct full URL for clear debugging
    const fullUrl = `${config.baseURL.replace(/\/$/, "")}/${config.url.replace(/^\//, "")}`;

    console.group(`%c[API REQUEST] ${config.method.toUpperCase()} ${fullUrl}`, "color: #0284c7; font-weight: bold;");
    console.log("Request URL:", fullUrl);
    console.log("HTTP Method:", config.method.toUpperCase());
    if (config.data) {
      console.log("Request Body:", config.data);
    }
    if (config.headers.Authorization) {
      console.log("Authorization:", "Bearer [PRESENT]");
    }
    console.groupEnd();

    return config;
  },
  (error) => {
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

// Response interceptor with structured console logging and error classification
apiClient.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL.replace(/\/$/, "")}/${response.config.url.replace(/^\//, "")}`;
    console.group(`%c[API RESPONSE] Status: ${response.status} (${response.config.method.toUpperCase()} ${fullUrl})`, "color: #10b981; font-weight: bold;");
    console.log("Response Status:", response.status, response.statusText);
    console.log("Response Data:", response.data);
    console.groupEnd();

    return response;
  },
  (error) => {
    const errorInfo = parseApiError(error);

    console.group(`%c[API ERROR] ${errorInfo.status || 'FAILED'}: ${errorInfo.message}`, "color: #ef4444; font-weight: bold;");
    console.error("Error Details:", errorInfo);
    if (error.config) {
      const fullUrl = `${error.config.baseURL?.replace(/\/$/, "") || ''}/${error.config.url?.replace(/^\//, "") || ''}`;
      console.error("Failed Request:", `${error.config.method?.toUpperCase()} ${fullUrl}`);
      if (error.config.data) console.error("Payload:", error.config.data);
    }
    console.groupEnd();

    return Promise.reject(errorInfo);
  }
);

/**
 * Standardized API Error Parser
 * Identifies Network errors, CORS issues, 400 Validation, 401 Unauthorized, 404, and 500
 */
export const parseApiError = (error) => {
  // If error is already parsed
  if (error && error.isParsedError) return error;

  let status = error?.response?.status || null;
  let statusText = error?.response?.statusText || null;
  let data = error?.response?.data || null;
  let message = "An unexpected error occurred.";
  let isCorsOrNetwork = false;
  let validationErrors = null;

  // Check for Network / CORS failure
  // Axios reports network errors (including CORS blockage) as Network Error or ERR_NETWORK
  if (error.code === "ERR_NETWORK" || error.message === "Network Error" || (!error.response && error.request)) {
    isCorsOrNetwork = true;
    message = "CORS error - please allow the frontend origin in ASP.NET Core (or verify backend is running).";
  } else if (status === 400) {
    message = "Bad Request (400) - Please check request data and validation rules.";
    if (data && typeof data === "object") {
      if (data.errors) {
        validationErrors = data.errors;
        const fieldMsgs = Object.entries(data.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(" | ");
        message = `Validation failed: ${fieldMsgs}`;
      } else if (data.title || data.message) {
        message = data.title || data.message;
      }
    }
  } else if (status === 401) {
    message = "Unauthorized (401) - Missing or invalid JWT Token. Please provide a valid Bearer token.";
  } else if (status === 403) {
    message = "Forbidden (403) - You do not have permission to access this resource.";
  } else if (status === 404) {
    message = "Endpoint Not Found (404) - The requested resource or URL was not found on the server.";
  } else if (status >= 500) {
    message = `Server Error (${status}) - An internal server error occurred in ASP.NET Core.`;
    if (data?.title || data?.message) {
      message += ` Details: ${data.title || data.message}`;
    }
  } else if (error.message) {
    message = error.message;
  }

  return {
    isParsedError: true,
    status: status,
    statusText: statusText,
    message: message,
    data: data,
    isCorsOrNetwork: isCorsOrNetwork,
    validationErrors: validationErrors,
    raw: error,
  };
};

/**
 * Token Management Helper (localStorage only)
 */
const TOKEN_STORAGE_KEY = "DEMO_CRM_JWT_TOKEN";

export const getSavedJwtToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
  }
  return "";
};

export const saveJwtToken = (token) => {
  if (typeof window !== "undefined") {
    if (token && token.trim()) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
};

export default apiClient;
