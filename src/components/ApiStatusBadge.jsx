import React, { useState, useEffect } from "react";
import axios from "axios";
import { getActiveApiBaseUrl, setActiveApiBaseUrl, DEFAULT_API_BASE_URL } from "../config/api";
import { Activity, CheckCircle2, XCircle, AlertCircle, Settings, RefreshCw } from "lucide-react";

export default function ApiStatusBadge() {
  const [baseUrl, setBaseUrl] = useState(getActiveApiBaseUrl());
  const [status, setStatus] = useState("idle"); // 'idle' | 'checking' | 'connected' | 'disconnected'
  const [statusMsg, setStatusMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(baseUrl);

  useEffect(() => {
    const handleUrlChange = (e) => {
      setBaseUrl(e.detail);
      setTempUrl(e.detail);
      setStatus("idle");
    };
    window.addEventListener("apiBaseUrlChanged", handleUrlChange);
    return () => window.removeEventListener("apiBaseUrlChanged", handleUrlChange);
  }, []);

  const checkConnection = async (urlToCheck = baseUrl) => {
    setStatus("checking");
    setStatusMsg("Checking connection...");

    try {
      // Test the URL directly without inventing fake endpoints.
      // A simple request to the base URL or OPTIONS will reveal if the server is reachable and CORS allows it.
      await axios.get(urlToCheck, { timeout: 4000 });
      setStatus("connected");
      setStatusMsg("API Server is reachable!");
    } catch (err) {
      // If server responded with ANY status (even 404/401/405), the API server is ALIVE and reachable!
      if (err.response) {
        setStatus("connected");
        setStatusMsg(`API Connected (Server responded HTTP ${err.response.status})`);
      } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        setStatus("disconnected");
        setStatusMsg("Disconnected or CORS blocked. Please verify your ASP.NET Core port & CORS policy.");
      } else {
        setStatus("disconnected");
        setStatusMsg(`Unreachable: ${err.message}`);
      }
    }
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    if (!tempUrl.trim()) return;
    setActiveApiBaseUrl(tempUrl.trim());
    setBaseUrl(tempUrl.trim());
    setIsModalOpen(false);
    checkConnection(tempUrl.trim());
  };

  const handleResetDefault = () => {
    setActiveApiBaseUrl(DEFAULT_API_BASE_URL);
    setBaseUrl(DEFAULT_API_BASE_URL);
    setTempUrl(DEFAULT_API_BASE_URL);
    setIsModalOpen(false);
    setStatus("idle");
  };

  return (
    <>
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-slate-200 text-xs font-medium text-slate-700 hover:shadow-xl transition-all">
        <div className="flex items-center gap-1.5">
          {status === "checking" && (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          )}
          {status === "connected" && (
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
          )}
          {status === "disconnected" && (
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]"></span>
          )}
          {status === "idle" && (
            <span className="flex h-2.5 w-2.5 rounded-full bg-slate-400"></span>
          )}

          <span>
            {status === "connected" && "🟢 API Connected"}
            {status === "disconnected" && "🔴 API Disconnected"}
            {status === "checking" && "🟡 Testing..."}
            {status === "idle" && "⚪ API Not Checked"}
          </span>
        </div>

        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => checkConnection()}
          disabled={status === "checking"}
          className="text-brand-600 hover:text-brand-800 font-semibold transition-colors flex items-center gap-1"
          title="Test backend connection"
        >
          <RefreshCw className={`w-3 h-3 ${status === "checking" ? "animate-spin" : ""}`} />
          Check API
        </button>

        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-slate-500 hover:text-slate-900 transition-colors p-0.5 rounded hover:bg-slate-100"
          title="Configure API Base URL"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Backend API URL Configuration</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Configure the port of your running ASP.NET Core Web API. Changes take effect immediately across all enquiry submissions and interaction tracking.
            </p>

            <form onSubmit={handleSaveUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  API Base URL
                </label>
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://localhost:7001"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Default from config: <code className="text-brand-600 font-mono">{DEFAULT_API_BASE_URL}</code>
                </p>
              </div>

              {statusMsg && (
                <div className={`text-xs p-2.5 rounded-lg border flex items-start gap-2 ${
                  status === 'connected' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  status === 'disconnected' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                  'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {status === 'connected' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> :
                   status === 'disconnected' ? <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" /> :
                   <AlertCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />}
                  <span>{statusMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Reset to Default
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => checkConnection(tempUrl)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Test URL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
