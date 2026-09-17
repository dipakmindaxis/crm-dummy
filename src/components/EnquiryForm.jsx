import React, { useState } from "react";
import { submitEnquiry } from "../services/enquiryService";
import { Send, CheckCircle2, AlertCircle, RefreshCw, HelpCircle, Phone, Mail, User, MessageSquare } from "lucide-react";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // { id: number|string }
  const [apiError, setApiError] = useState(null); // parsed error object

  const validate = () => {
    const errs = {};

    // Name required
    if (!formData.name.trim()) {
      errs.name = "Name is required.";
    }

    // Phone number required & valid digits
    const cleanedPhone = formData.phoneNumber.replace(/[\s\-\(\)\+]/g, "");
    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = "Phone number is required.";
    } else if (!/^\d{7,15}$/.test(cleanedPhone)) {
      errs.phoneNumber = "Please enter a valid phone number (7 to 15 digits).";
    }

    // Email optional, but if entered it should be valid
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    // Message required
    if (!formData.message.trim()) {
      errs.message = "Message is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessInfo(null);
    setApiError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // POST /api/website-enquiries
      // Payload has exact property names: name, phoneNumber, email, message
      const responseData = await submitEnquiry({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        message: formData.message,
      });

      // Backend returns either an object with { id: ... } or the id directly
      const enquiryId = responseData?.id ?? responseData?.data?.id ?? responseData ?? "N/A";

      setSuccessInfo({ id: enquiryId });

      // Reset form on success
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      setApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="enquiry-form" className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Enquiry Portal
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
          Send Us an Enquiry
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Submitting this form calls your backend <code className="text-brand-600 font-semibold font-mono bg-brand-50 px-1.5 py-0.5 rounded">POST /api/website-enquiries</code> endpoint.
        </p>
      </div>

      {/* Success Notification */}
      {successInfo && (
        <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base text-emerald-950">
                Enquiry submitted successfully!
              </h4>
              <p className="text-sm text-emerald-800 mt-1 font-semibold">
                Enquiry ID: <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-900">{successInfo.id}</span>
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Data was written to your ASP.NET Core database. You can inspect it in the API Testing dashboard or SQL Server.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Failure Notification */}
      {apiError && (
        <div className="mb-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="w-full">
              <h4 className="font-bold text-base text-rose-950">
                Failed to submit enquiry. Please check the API/server.
              </h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                {apiError.message || "An unexpected error occurred while communicating with the backend API."}
              </p>

              {apiError.isCorsOrNetwork && (
                <div className="mt-3 p-3 bg-white/80 rounded-xl border border-rose-300 text-xs text-rose-900">
                  <strong>Troubleshooting Guide:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Ensure your ASP.NET Core project is actively running.</li>
                    <li>Verify the port matches in the floating API status tool (bottom-left).</li>
                    <li>Add <code>http://localhost:5173</code> to your ASP.NET Core CORS policy.</li>
                  </ul>
                </div>
              )}

              {apiError.status && (
                <div className="mt-2 text-xs font-mono text-rose-700">
                  HTTP Status: {apiError.status} {apiError.statusText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="enquiry-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="enquiry-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Test User"
              className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-rose-400 focus:ring-rose-400 bg-rose-50/40"
                  : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="enquiry-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              id="enquiry-phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.phoneNumber
                  ? "border-rose-400 focus:ring-rose-400 bg-rose-50/40"
                  : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
              }`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Email Field (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="enquiry-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              id="enquiry-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. test@example.com"
              className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-400 bg-rose-50/40"
                  : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="enquiry-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Message <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="enquiry-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. I am interested in your services."
              className={`w-full p-3.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.message
                  ? "border-rose-400 focus:ring-rose-400 bg-rose-50/40"
                  : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
              }`}
            ></textarea>
          </div>
          {errors.message && (
            <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Submitting to ASP.NET Core API...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Enquiry</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Submits direct JSON payload: <code className="font-mono text-slate-600">{`{ companyCode, name, phoneNumber, email, message }`}</code>
        </p>
      </form>
    </div>
  );
}
