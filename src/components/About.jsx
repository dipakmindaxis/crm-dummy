import React from "react";
import { COMPANY_NAME } from "../config/api";
import { CheckCircle2, Award, Users2, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual/Stats */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Industry Certified</h4>
                    <p className="text-xs text-slate-500">ISO 27001 & SOC-2 Compliant</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-2xl font-black text-brand-600">12+</div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Years of Excellence</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-2xl font-black text-brand-600">250+</div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Engineers & Leads</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-2xl font-black text-brand-600">45+</div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Countries Served</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="text-2xl font-black text-brand-600">98%</div>
                    <div className="text-xs text-slate-600 font-medium mt-1">Retention Rate</div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Verified API Pipeline with SQL Server relational persistence.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-100">
              About {COMPANY_NAME}
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Driving Digital Agility Through Engineering Precision
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Founded with the mission to bridge modern cloud frontend architectures with robust enterprise backend technologies, <strong>{COMPANY_NAME}</strong> specializes in full-lifecycle software delivery, API integrations, and conversion-focused digital experiences.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Whether you are evaluating our lead capture pipeline or validating microservice latency, our infrastructure is built to scale seamlessly from day one with full auditability and developer-first transparency.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-brand-100 text-brand-700 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ultra-Fast REST Endpoints</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Optimized for low-latency enquiry handling and real-time interaction logs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-brand-100 text-brand-700 mt-0.5">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Enterprise CRM Ready</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Protected endpoints for internal team audit, dispatch, and lifecycle management.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
