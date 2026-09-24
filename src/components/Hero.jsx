import React, { useState } from "react";
import { trackInteraction } from "../services/interactionService";
import { WHATSAPP_NUMBER, PHONE_NUMBER, INTERACTION_TYPES } from "../config/api";
import WhatsAppIcon from "./WhatsAppIcon";
import { PhoneCall, ArrowRight, ShieldCheck, Sparkles, Send } from "lucide-react";

export default function Hero() {
  const [loadingAction, setLoadingAction] = useState(null);

  // WhatsApp Button Click Handler
  const handleWhatsAppClick = () => {
    window.dispatchEvent(new CustomEvent("openWhatsAppModal"));
  };

  // Call Button Click Handler
  const handleCallClick = async () => {
    setLoadingAction("call");
    try {
      await trackInteraction(INTERACTION_TYPES.CALL);
      window.location.href = `tel:${PHONE_NUMBER}`;
    } catch (err) {
      console.error("API interaction failed, initiating call anyway:", err);
      alert("Failed to track interaction: " + (err.message || "Network Error"));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleContactScroll = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-sky-50/40 to-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-brand-200/30 to-sky-200/30 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 shadow-sm text-xs font-bold text-brand-700">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Enterprise API & CRM Integration Demo</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Empowering Enterprise Growth with{" "}
              <span className="bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Modern Digital Solutions
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              We deliver scalable cloud architectures, customized software solutions, and real-time interaction systems designed to accelerate business transformation.
            </p>

            {/* Action Buttons Grid */}
            <div className="flex flex-wrap items-center gap-3 pt-2">

              {/* Contact Us Button */}
              <button
                onClick={handleContactScroll}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 shadow-sm hover:shadow transition-all"
              >
                Contact Us
              </button>

              {/* WhatsApp Button */}
              <button
                id="hero-whatsapp-btn"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-md hover:shadow-lg transition-all"
                title={`Chat with us on WhatsApp (${WHATSAPP_NUMBER})`}
              >
                <WhatsAppIcon className="w-4 h-4 mr-2" />
                <span>WhatsApp</span>
              </button>

              {/* Call Button */}
              <button
                id="hero-call-btn"
                onClick={handleCallClick}
                disabled={loadingAction === "call"}
                className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-300 shadow-sm transition-all"
                title={`Call ${PHONE_NUMBER}`}
              >
                <PhoneCall className="w-4 h-4 mr-2 text-sky-600" />
                <span>{loadingAction === "call" ? "Logging..." : "Call Us"}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-black text-slate-900">99.9%</div>
                <div className="text-xs text-slate-500 font-medium">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">500+</div>
                <div className="text-xs text-slate-500 font-medium">Enterprise Clients</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">24/7</div>
                <div className="text-xs text-slate-500 font-medium">Real-Time Support</div>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">ASP.NET Core Connected</h4>
                    <p className="text-xs text-slate-500">Live API Telemetry Active</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </div>

              <div className="py-6 space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Enquiry Endpoint</span>
                  <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">POST /api/website-enquiries</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Interaction Endpoint</span>
                  <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">POST /api/website-interactions</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">SQL Server Target</span>
                  <span className="font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active Backend</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  Every click on Call and Email immediately sends an HTTP request to your configured ASP.NET Core API.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
