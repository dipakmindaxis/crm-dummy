import React, { useState } from "react";
import { trackInteraction } from "../services/interactionService";
import { 
  COMPANY_NAME, 
  WHATSAPP_NUMBER, 
  PHONE_NUMBER, 
  EMAIL_ADDRESS, 
  INTERACTION_TYPES 
} from "../config/api";
import WhatsAppIcon from "./WhatsAppIcon";
import { Building2, Phone, Mail, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function Footer({ setActiveTab }) {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleWhatsApp = () => {
    window.dispatchEvent(new CustomEvent("openWhatsAppModal"));
  };

  const handleCall = async () => {
    setLoadingAction("call");
    try {
      await trackInteraction(INTERACTION_TYPES.CALL);
      window.location.href = `tel:${PHONE_NUMBER}`;
    } catch (err) {
      console.error("Footer Call tracking error:", err);
      alert("Failed to track interaction: " + (err.message || "Network Error"));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEmail = async () => {
    setLoadingAction("email");
    try {
      await trackInteraction(INTERACTION_TYPES.EMAIL);
      window.location.href = `mailto:${EMAIL_ADDRESS}`;
    } catch (err) {
      console.error("Footer Email tracking error:", err);
      alert("Failed to track interaction: " + (err.message || "Network Error"));
    } finally {
      setLoadingAction(null);
    }
  };

  const scrollToSection = (id) => {
    if (setActiveTab) setActiveTab("home");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  {COMPANY_NAME}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 block">
                  API Testing Suite
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Dedicated corporate demonstration environment to test and verify ASP.NET Core Web API endpoints for customer enquiry intake and live interaction telemetry.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Real API Transmission Guaranteed (Zero Mock Data)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollToSection("hero")} className="hover:text-white transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("about")} className="hover:text-white transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")} className="hover:text-white transition">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("contact")} className="hover:text-white transition">
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { if (setActiveTab) setActiveTab("testing"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                  className="text-brand-400 hover:text-brand-300 font-semibold transition"
                >
                  API Testing Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Web Development (React / ASP.NET)</li>
              <li>Software Development & Microservices</li>
              <li>Digital Transformation Solutions</li>
              <li>Business Growth Consulting</li>
            </ul>
          </div>

          {/* Live Tracked Contact Actions */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tracked Contact Actions
            </h4>
            <p className="text-[11px] text-slate-500 mb-2">
              Every button triggers <code>POST /api/website-interactions</code> before opening the link:
            </p>
            <div className="space-y-2">
              {/* Phone */}
              <button
                onClick={handleCall}
                disabled={loadingAction === "call"}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs flex items-center justify-between text-slate-300 hover:text-white border border-slate-800 transition"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Call: {PHONE_NUMBER}</span>
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600" />
              </button>

              {/* Email */}
              <button
                onClick={handleEmail}
                disabled={loadingAction === "email"}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs flex items-center justify-between text-slate-300 hover:text-white border border-slate-800 transition"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[170px]">{EMAIL_ADDRESS}</span>
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600" />
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs flex items-center justify-between text-slate-300 hover:text-white border border-slate-800 transition"
              >
                <span className="flex items-center gap-2">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp: +{WHATSAPP_NUMBER}</span>
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for ASP.NET Core & SQL Server API Testing
          </p>
        </div>
      </div>
    </footer>
  );
}
