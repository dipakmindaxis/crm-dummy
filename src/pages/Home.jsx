import React, { useState } from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import EnquiryForm from "../components/EnquiryForm";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { useVisitorTracking } from "../context/VisitorContext";
import { 
  WHATSAPP_NUMBER, 
  PHONE_NUMBER, 
  EMAIL_ADDRESS, 
  INTERACTION_TYPES 
} from "../config/api";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Home({ setActiveTab }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const { trackAction } = useVisitorTracking();

  const handleWhatsApp = async () => {
    setLoadingAction("whatsapp");
    try {
      await trackAction(INTERACTION_TYPES.WHATSAPP, () => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`, "_blank", "noopener,noreferrer");
      });
    } catch (err) {
      console.warn("Contact section WhatsApp tracking error:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCall = async () => {
    setLoadingAction("call");
    try {
      await trackAction(INTERACTION_TYPES.CALL, () => {
        window.location.href = `tel:${PHONE_NUMBER}`;
      });
    } catch (err) {
      console.warn("Contact section Call tracking error:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEmail = async () => {
    setLoadingAction("email");
    try {
      await trackAction(INTERACTION_TYPES.EMAIL, () => {
        window.location.href = `mailto:${EMAIL_ADDRESS}`;
      });
    } catch (err) {
      console.warn("Contact section Email tracking error:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* About Section */}
      <About />

      {/* Contact & Enquiry Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-white to-slate-100 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details & Tracked Buttons */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-100">
                  Connect With Us
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                  Let's Discuss Your Next Big Project
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Have a question or looking to test your API integration? Reach out directly using any channel below, or submit the enquiry form.
                </p>
              </div>

              {/* Direct Tracked Action Cards */}
              <div className="space-y-3">
                {/* WhatsApp */}
                <div 
                  onClick={handleWhatsApp}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <WhatsAppIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-emerald-600">
                        {loadingAction === "whatsapp" ? "Tracking Click..." : "WhatsApp Instant Chat"}
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        +{WHATSAPP_NUMBER}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Phone */}
                <div 
                  onClick={handleCall}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-sky-600">
                        {loadingAction === "call" ? "Tracking Click..." : "Call Us Directly"}
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {PHONE_NUMBER}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Email */}
                <div 
                  onClick={handleEmail}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-amber-600">
                        {loadingAction === "email" ? "Tracking Click..." : "Send Us An Email"}
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {EMAIL_ADDRESS}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Physical Address */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-500">Corporate HQ</div>
                    <div className="text-xs font-medium text-slate-800">
                      452 Innovation Blvd, Suite 300, Tech Park, CA 94025
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="lg:col-span-7">
              <EnquiryForm />
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
