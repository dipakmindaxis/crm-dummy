import React, { useState } from "react";
import { trackInteraction } from "../services/interactionService";
import { INTERACTION_TYPES } from "../config/api";
import { Globe, Code2, Cpu, LineChart, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Services() {
  const [loadingService, setLoadingService] = useState(null);

  const services = [
    {
      id: "web-dev",
      title: "Web Development",
      description: "Modern, responsive, and performance-tuned web applications built with React, ASP.NET Core, and cloud-native architecture.",
      icon: Globe,
      color: "from-blue-600 to-sky-500",
      features: ["Custom React & Vite Frontends", "RESTful & GraphQL API Integration", "SEO & Performance Optimization"]
    },
    {
      id: "software-dev",
      title: "Software Development",
      description: "Enterprise-grade bespoke software solutions engineered for scalability, high availability, and rigorous security standards.",
      icon: Code2,
      color: "from-indigo-600 to-violet-500",
      features: ["ASP.NET Core & C# Microservices", "SQL Server & Entity Framework Core", "Secure Multi-tenant Architectures"]
    },
    {
      id: "digital-sol",
      title: "Digital Solutions",
      description: "Comprehensive end-to-end digital transformation pipelines, cloud migrations, and workflow automation for modern enterprises.",
      icon: Cpu,
      color: "from-emerald-600 to-teal-500",
      features: ["Cloud Infrastructure (Azure / AWS)", "CRM & ERP Custom Integrations", "Real-time Telemetry & Analytics"]
    },
    {
      id: "biz-sol",
      title: "Business Solutions",
      description: "Data-driven business consulting and specialized software tooling to optimize conversion rates and streamline customer enquiries.",
      icon: LineChart,
      color: "from-amber-600 to-orange-500",
      features: ["Lead Capture & Interaction Tracking", "Business Process Optimization", "Dedicated SLA & Support"]
    },
  ];

  const handleServiceGetQuote = async (serviceName) => {
    setLoadingService(serviceName);
    try {
      await trackInteraction(INTERACTION_TYPES.GET_QUOTE);
    } catch (err) {
      console.warn("Get Quote interaction logging failed, continuing scroll:", err);
    } finally {
      setLoadingService(null);
      const formEl = document.getElementById("enquiry-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
        // Optionally focus the message field with prefilled interest
        const messageInput = document.getElementById("enquiry-message");
        if (messageInput && !messageInput.value) {
          messageInput.value = `I am interested in a quote for ${serviceName}.`;
        }
      }
    }
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-100">
            Our Core Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            High-Impact Services Tailored for Your Growth
          </h2>
          <p className="text-slate-600 text-base">
            Explore our specialized development and digital capabilities. Every "Get Quote" action dispatches real-time telemetry to your ASP.NET Core API.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((srv) => {
            const IconComponent = srv.icon;
            const isLoading = loadingService === srv.title;

            return (
              <div
                key={srv.id}
                className="group relative flex flex-col justify-between p-6 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${srv.color} flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {srv.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2 mb-6">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Get Quote Action Button */}
                <button
                  id={`service-quote-btn-${srv.id}`}
                  onClick={() => handleServiceGetQuote(srv.title)}
                  disabled={isLoading}
                  className="w-full mt-auto inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-800 bg-white hover:bg-brand-600 hover:text-white rounded-xl border border-slate-300 hover:border-brand-600 shadow-sm transition-all group-hover:shadow"
                >
                  <span>{isLoading ? "Recording Click..." : "Get Quote"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
