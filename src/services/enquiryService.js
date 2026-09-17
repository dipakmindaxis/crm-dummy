import apiClient, { getSavedJwtToken } from "./api";
import { ENDPOINTS } from "../config/api";

/**
 * Service for Website Enquiry API Endpoints
 */

/**
 * Submit Enquiry (Public Endpoint - No JWT required)
 * @param {Object} enquiryData - { name, phoneNumber, email, message }
 * @returns {Promise<any>}
 */
export const submitEnquiry = async ({ name, phoneNumber, email, message }) => {
  // Construct clean payload with exact lowercase property names
  const payload = {
    companyCode: "CMP#102",
    name: name?.trim() || "",
    phoneNumber: phoneNumber?.trim() || "",
    email: email?.trim() || "",
    message: message?.trim() || "",
  };

  const response = await apiClient.post(ENDPOINTS.ENQUIRIES, payload);
  return response.data;
};

/**
 * Helper to build auth headers with provided or stored token
 */
const buildAuthHeaders = (token) => {
  const activeToken = token || getSavedJwtToken();
  const headers = {};
  if (activeToken) {
    headers["Authorization"] = `Bearer ${activeToken}`;
  }
  return headers;
};

/**
 * Get All Enquiries (Protected Endpoint - Requires JWT)
 * @param {string} [token]
 * @returns {Promise<any>}
 */
export const getEnquiries = async (token) => {
  const response = await apiClient.get(ENDPOINTS.ENQUIRIES, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

/**
 * Get Enquiry By ID (Protected Endpoint - Requires JWT)
 * @param {string|number} id
 * @param {string} [token]
 * @returns {Promise<any>}
 */
export const getEnquiryById = async (id, token) => {
  const response = await apiClient.get(`${ENDPOINTS.ENQUIRIES}/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

/**
 * Delete Enquiry By ID (Protected Endpoint - Requires JWT)
 * @param {string|number} id
 * @param {string} [token]
 * @returns {Promise<any>}
 */
export const deleteEnquiry = async (id, token) => {
  const response = await apiClient.delete(`${ENDPOINTS.ENQUIRIES}/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};
