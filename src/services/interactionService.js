import apiClient, { getSavedJwtToken } from "./api";
import { ENDPOINTS, INTERACTION_TYPES } from "../config/api";

/**
 * Service for Website Interaction Tracking Endpoints
 */

/**
 * Track Interaction (Public Endpoint - No JWT required)
 * @param {"WhatsAppClick"|"CallClick"|"EmailClick"} interactionType
 * @returns {Promise<any>}
 */
export const trackInteraction = async (interactionType) => {
  const payload = {
    companyCode: "CMP#102",
    interactionType: interactionType,
  };

  const response = await apiClient.post(ENDPOINTS.INTERACTIONS, payload);
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
 * Get All Interactions (Protected Endpoint - Requires JWT)
 * @param {string} [token]
 * @returns {Promise<any>}
 */
export const getInteractions = async (token) => {
  const response = await apiClient.get(ENDPOINTS.INTERACTIONS, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

/**
 * Get Interaction By ID (Protected Endpoint - Requires JWT)
 * @param {string|number} id
 * @param {string} [token]
 * @returns {Promise<any>}
 */
export const getInteractionById = async (id, token) => {
  const response = await apiClient.get(`${ENDPOINTS.INTERACTIONS}/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

/**
 * Delete Interaction By ID (Protected Endpoint - Requires JWT)
 * @param {string|number} id
 * @param {string} [token]
 * @returns {Promise<any>}
 */
export const deleteInteraction = async (id, token) => {
  const response = await apiClient.delete(`${ENDPOINTS.INTERACTIONS}/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export { INTERACTION_TYPES };
