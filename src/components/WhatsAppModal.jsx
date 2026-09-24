import React, { useState, useEffect } from "react";
import { submitEnquiry } from "../services/enquiryService";
import { User, Phone, RefreshCw, Send, AlertCircle, X, CheckCircle2, MessageSquare } from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/api";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    service: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setApiError(null);
      setErrors({});
    };
    
    // Listen for custom event triggered from any component
    window.addEventListener("openWhatsAppModal", handleOpen);
    return () => window.removeEventListener("openWhatsAppModal", handleOpen);
  }, []);

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = "Name is required.";
    }

    const cleanedPhone = formData.phoneNumber.replace(/[\s\-\(\)\+]/g, "");
    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(cleanedPhone)) {
      errs.phoneNumber = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.service.trim()) {
      errs.service = "Service is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Map Service to Message
      await submitEnquiry({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        message: formData.service,
      });

      // Clear state and close
      setFormData({ name: "", phoneNumber: "", service: "" });
      setIsOpen(false);

      // Open WhatsApp
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

    } catch (err) {
      console.error("WhatsApp Enquiry submission failed:", err);
      setApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#25D366]/10">
          <div className="flex items-center gap-3">
            <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">WhatsApp Enquiry</h3>
              <p className="text-xs text-slate-600 mt-1">Please provide details before chatting.</p>
            </div>
          </div>
          <button 
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {apiError && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-950">Submission Failed</h4>
                <p className="text-xs text-rose-800 mt-1">{apiError.message || "An error occurred connecting to the API."}</p>
              </div>
            </div>
          )}

          <form id="whatsapp-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="wa-name" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="wa-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? "border-rose-400 focus:ring-rose-400" : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="wa-phone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  id="wa-phone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.phoneNumber ? "border-rose-400 focus:ring-rose-400" : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
                  }`}
                />
              </div>
              {errors.phoneNumber && <p className="text-xs text-rose-600 mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Service */}
            <div>
              <label htmlFor="wa-service" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Service <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <select
                  id="wa-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all appearance-none ${
                    errors.service ? "border-rose-400 focus:ring-rose-400" : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
                  }`}
                >
                  <option value="" disabled>Select a service</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Digital Solutions">Digital Solutions</option>
                  <option value="Business Solutions">Business Solutions</option>
                  <option value="Other">Other / General Enquiry</option>
                </select>
              </div>
              {errors.service && <p className="text-xs text-rose-600 mt-1">{errors.service}</p>}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            form="whatsapp-form"
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Chat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
