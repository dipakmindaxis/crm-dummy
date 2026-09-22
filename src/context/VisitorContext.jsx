import React, { createContext, useContext, useState, useCallback } from "react";
import VisitorFormModal from "../components/VisitorFormModal";
import { getVisitorIdFromCookie, setVisitorIdCookie, generateVisitorId } from "../utils/visitorCookie";
import { registerVisitor } from "../services/visitorService";
import { trackInteraction } from "../services/interactionService";

const VisitorContext = createContext(null);

export const VisitorProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    pendingActionType: null,
    pendingCallback: null,
    isSubmitting: false,
    apiError: null,
  });

  const trackAction = useCallback(async (interactionType, actionCallback) => {
    const existingVisitorId = getVisitorIdFromCookie();

    if (existingVisitorId) {
      // Cookie exists, track interaction and proceed
      try {
        await trackInteraction(interactionType, existingVisitorId);
        if (actionCallback) actionCallback();
      } catch (err) {
        console.error("Interaction tracking failed:", err);
        // Requirement: Do not silently treat API failure as success.
        // Original action should not proceed.
        alert(`Failed to track interaction: ${err.message || "Network Error"}`);
      }
    } else {
      // No cookie, open modal
      setModalState({
        isOpen: true,
        pendingActionType: interactionType,
        pendingCallback: actionCallback,
        isSubmitting: false,
        apiError: null,
      });
    }
  }, []);

  const handleModalSubmit = async (formData) => {
    setModalState((prev) => ({ ...prev, isSubmitting: true, apiError: null }));
    
    try {
      const newVisitorId = generateVisitorId();
      
      // 1. Call Visitor API
      await registerVisitor({
        companyCode: "CMP#102",
        visitorId: newVisitorId,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      });

      // 2. Set Cookie only on success
      setVisitorIdCookie(newVisitorId);

      // 3. Track Interaction
      await trackInteraction(modalState.pendingActionType, newVisitorId);

      // 4. Close Modal and execute original action
      const callback = modalState.pendingCallback;
      setModalState((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
      if (callback) callback();

    } catch (err) {
      console.error("Visitor registration or interaction tracking failed:", err);
      setModalState((prev) => ({ ...prev, isSubmitting: false, apiError: err }));
    }
  };

  const handleModalCancel = () => {
    setModalState({
      isOpen: false,
      pendingActionType: null,
      pendingCallback: null,
      isSubmitting: false,
      apiError: null,
    });
  };

  return (
    <VisitorContext.Provider value={{ trackAction }}>
      {children}
      {modalState.isOpen && (
        <VisitorFormModal 
          onSubmit={handleModalSubmit}
          onCancel={handleModalCancel}
          apiError={modalState.apiError}
          isSubmitting={modalState.isSubmitting}
        />
      )}
    </VisitorContext.Provider>
  );
};

export const useVisitorTracking = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitorTracking must be used within a VisitorProvider");
  }
  return context;
};
