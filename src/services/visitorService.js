import apiClient from "./api";
import { ENDPOINTS } from "../config/api";

/**
 * Register a new website visitor (Public Endpoint - No JWT required)
 * @param {Object} visitorData - { companyCode, visitorId, name, phoneNumber, email }
 * @returns {Promise<any>}
 */
export const registerVisitor = async ({ companyCode, visitorId, name, phoneNumber, email }) => {
  const payload = {
    companyCode: companyCode || "CMP#102",
    visitorId,
    name: name?.trim() || "",
    phoneNumber: phoneNumber?.trim() || "",
    email: email?.trim() || "",
  };

  const response = await apiClient.post(ENDPOINTS.VISITORS, payload);
  return response.data;
};
