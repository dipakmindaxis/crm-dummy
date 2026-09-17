import React, { useState } from "react";
import { trackInteraction } from "../services/interactionService";
import { COMPANY_NAME, WHATSAPP_NUMBER, INTERACTION_TYPES } from "../config/api";
import WhatsAppIcon from "./WhatsAppIcon";
import { Building2, Menu, X, ArrowRight, Activity, Globe } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  const handleWhatsAppClick = async () => {
    setWhatsappLoading(true);
    try {
      await trackInteraction(INTERACTION_TYPES.WHATSAPP);
    } catch (err) {
      console.warn("Navbar WhatsApp tracking error:", err);
    } finally {
      setWhatsappLoading(false);
      window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleGetQuoteClick = async () => {
    setQuoteLoading(true);
    try {
      await trackInteraction(INTERACTION_TYPES.GET_QUOTE);
    } catch (err) {
      console.warn("Interaction tracking recorded error, proceeding with scroll:", err);
    } finally {
      setQuoteLoading(false);
    }

    if (activeTab !== "home") {
      setActiveTab("home");
      setTimeout(() => {
        const formElement = document.getElementById("enquiry-form");
        if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const formElement = document.getElementById("enquiry-form");
      if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigateToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (activeTab !== "home") {
      setActiveTab("home");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => { setActiveTab("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
              {COMPANY_NAME}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-600 block">
              Corporate Portal
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigateToSection("hero")}
            className={`text-sm font-semibold transition-colors ${
              activeTab === "home" ? "text-brand-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateToSection("about")}
            className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => navigateToSection("services")}
            className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => navigateToSection("contact")}
            className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
          >
            Contact
          </button>

          {/* Tab Button for API Testing */}
          <button
            onClick={() => {
              setActiveTab(activeTab === "testing" ? "home" : "testing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "testing"
                ? "bg-slate-900 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300/70"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-brand-500" />
            API Testing Dashboard
          </button>
        </nav>

        {/* Desktop Action CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="nav-whatsapp-btn"
            onClick={handleWhatsAppClick}
            disabled={whatsappLoading}
            className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-md hover:shadow-lg transition-all"
            title={`Chat on WhatsApp (${WHATSAPP_NUMBER})`}
          >
            <WhatsAppIcon className="w-4 h-4 mr-1.5" />
            <span>{whatsappLoading ? "Logging..." : "WhatsApp"}</span>
          </button>

          <button
            id="nav-get-quote-btn"
            onClick={handleGetQuoteClick}
            disabled={quoteLoading}
            className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white transition-all bg-gradient-to-r from-brand-600 to-sky-500 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{quoteLoading ? "Tracking..." : "Get Quote"}</span>
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setActiveTab(activeTab === "testing" ? "home" : "testing")}
            className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 text-slate-800 rounded-lg border border-slate-200"
          >
            {activeTab === "testing" ? "Website" : "API Panel"}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          <button
            onClick={() => navigateToSection("hero")}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => navigateToSection("about")}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            About
          </button>
          <button
            onClick={() => navigateToSection("services")}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Services
          </button>
          <button
            onClick={() => navigateToSection("contact")}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Contact
          </button>
          <button
            onClick={() => {
              setActiveTab("testing");
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center justify-between w-full px-3 py-2.5 text-base font-bold text-brand-700 bg-brand-50 rounded-lg"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              API Testing Dashboard
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppClick();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleGetQuoteClick();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
            >
              Get Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
