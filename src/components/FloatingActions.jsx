import React, { useState } from "react";
import { trackInteraction } from "../services/interactionService";
import { WHATSAPP_NUMBER, PHONE_NUMBER, INTERACTION_TYPES } from "../config/api";
import WhatsAppIcon from "./WhatsAppIcon";
import { PhoneCall } from "lucide-react";

export default function FloatingActions() {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleWhatsApp = async () => {
    setLoadingAction("whatsapp");
    try {
      await trackInteraction(INTERACTION_TYPES.WHATSAPP);
    } catch (err) {
      console.warn("Floating WhatsApp API tracking error:", err);
    } finally {
      setLoadingAction(null);
      window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleCall = async () => {
    setLoadingAction("call");
    try {
      await trackInteraction(INTERACTION_TYPES.CALL);
    } catch (err) {
      console.warn("Floating Call API tracking error:", err);
    } finally {
      setLoadingAction(null);
      window.location.href = `tel:${PHONE_NUMBER}`;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {/* Floating Call Button */}
      <button
        type="button"
        id="floating-call-btn"
        onClick={handleCall}
        disabled={loadingAction === "call"}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-sky-600 text-white shadow-xl hover:bg-sky-700 hover:scale-110 active:scale-95 transition-all"
        aria-label="Call Us"
        title="Call Us (Tracked API Interaction)"
      >
        <PhoneCall className="w-5 h-5" />
        <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Call: {PHONE_NUMBER}
        </span>
      </button>

      {/* Floating WhatsApp Button with Official WhatsApp Icon */}
      <button
        type="button"
        id="floating-whatsapp-btn"
        onClick={handleWhatsApp}
        disabled={loadingAction === "whatsapp"}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-[#25D366]/40"
        aria-label="WhatsApp Chat"
        title="Chat on WhatsApp (Tracked API Interaction)"
      >
        <WhatsAppIcon className="w-7 h-7" />
        <span className="absolute right-16 whitespace-nowrap bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl font-semibold">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
}
