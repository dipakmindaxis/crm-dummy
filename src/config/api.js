/**
 * Central API & Contact Configuration
 * 
 * Update your ASP.NET Core API Base URL and business contact details here.
 * You can also change the API Base URL dynamically in the website's API Testing panel.
 */

// CHANGE THIS TO MATCH YOUR RUNNING ASP.NET CORE API PORT:
// Examples: "https://localhost:7001", "https://localhost:5001", "http://localhost:5000"
export const DEFAULT_API_BASE_URL = "https://mindaxisdev-001-site1.gtempurl.com";

// Dummy WhatsApp Number (Format: country code + number without +, e.g. 919876543210)
export const WHATSAPP_NUMBER = "919876543210";

// Dummy Call Phone Number
export const PHONE_NUMBER = "+919876543210";

// Dummy Contact Email Address
export const EMAIL_ADDRESS = "test@example.com";

// Company Branding
export const COMPANY_NAME = "Demo Company";

// ASP.NET Core API Endpoints
export const ENDPOINTS = {
  ENQUIRIES: "/api/website-enquiries",
  INTERACTIONS: "/api/website-interactions",
  VISITORS: "/api/website-visitors",
};

// Strict Backend Interaction Types
export const INTERACTION_TYPES = {
  WHATSAPP: "WhatsAppClick",
  CALL: "CallClick",
  GET_QUOTE: "GetQuoteClick",
  EMAIL: "EmailClick",
};

// Helper to get active API Base URL (with localStorage override support)
export const getActiveApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const savedUrl = localStorage.getItem("DEMO_API_BASE_URL");
    if (savedUrl && savedUrl.trim()) {
      return savedUrl.trim();
    }
  }
  return DEFAULT_API_BASE_URL;
};

// Helper to set active API Base URL in localStorage
export const setActiveApiBaseUrl = (newUrl) => {
  if (typeof window !== "undefined") {
    if (!newUrl || newUrl.trim() === DEFAULT_API_BASE_URL) {
      localStorage.removeItem("DEMO_API_BASE_URL");
    } else {
      localStorage.setItem("DEMO_API_BASE_URL", newUrl.trim());
    }
    // Dispatch custom event so Axios instance & UI can react
    window.dispatchEvent(new CustomEvent("apiBaseUrlChanged", { detail: getActiveApiBaseUrl() }));
  }
};
