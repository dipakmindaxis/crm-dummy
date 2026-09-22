import React, { useState } from "react";
import { User, Phone, Mail, RefreshCw, Send, AlertCircle, X } from "lucide-react";

export default function VisitorFormModal({ onSubmit, onCancel, apiError, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = "Name is required.";
    }

    const cleanedPhone = formData.phoneNumber.replace(/[\s\-\(\)\+]/g, "");
    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(cleanedPhone)) {
      errs.phoneNumber = "Please enter a valid 10-digit phone number.";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Visitor Registration</h3>
            <p className="text-xs text-slate-500 mt-1">Please provide your details to continue.</p>
          </div>
          <button 
            onClick={onCancel}
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
                <h4 className="font-bold text-sm text-rose-950">Registration Failed</h4>
                <p className="text-xs text-rose-800 mt-1">{apiError.message || "An error occurred."}</p>
              </div>
            </div>
          )}

          <form id="visitor-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="visitor-name" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="visitor-name"
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

            {/* Phone Number */}
            <div>
              <label htmlFor="visitor-phone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  id="visitor-phone"
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

            {/* Email */}
            <div>
              <label htmlFor="visitor-email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="visitor-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? "border-rose-400 focus:ring-rose-400" : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            form="visitor-form"
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Continue</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
