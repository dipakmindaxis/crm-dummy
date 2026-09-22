export const VISITOR_COOKIE_NAME = "crm_visitor_id";

/**
 * Generate a new VisitorId (e.g., VIS-7F82A91C)
 */
export const generateVisitorId = () => {
  let uuid;
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    uuid = crypto.randomUUID();
  } else {
    // Fallback for older browsers
    uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  
  // Format as VIS-XXXXXXXX (take first 8 chars of uuid and uppercase)
  const shortId = uuid.split("-")[0].toUpperCase();
  return `VIS-${shortId}`;
};

/**
 * Get VisitorId from first-party cookie
 */
export const getVisitorIdFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )' + VISITOR_COOKIE_NAME + '=([^;]+)'));
  if (match) return match[2];
  return null;
};

/**
 * Set VisitorId in first-party cookie (365 days)
 */
export const setVisitorIdCookie = (visitorId) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days
  const expires = "; expires=" + date.toUTCString();
  
  // Using SameSite=Lax and Secure if on HTTPS
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secure = isHttps ? "; Secure" : "";
  
  document.cookie = `${VISITOR_COOKIE_NAME}=${visitorId}${expires}; path=/; SameSite=Lax${secure}`;
};
