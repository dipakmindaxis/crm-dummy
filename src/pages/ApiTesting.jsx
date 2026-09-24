import React, { useState, useEffect } from "react";
import { submitEnquiry, getEnquiries, deleteEnquiry } from "../services/enquiryService";
import { trackInteraction, getInteractions, deleteInteraction, INTERACTION_TYPES } from "../services/interactionService";
import { getSavedJwtToken, saveJwtToken } from "../services/api";
import { getActiveApiBaseUrl } from "../config/api";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Copy, 
  Check, 
  Terminal, 
  Table, 
  RefreshCw, 
  Trash2, 
  AlertTriangle,
  Server,
  Layers,
  Send,
  PhoneCall,
  FileText,
  Mail,
  HelpCircle
} from "lucide-react";

export default function ApiTesting() {
  // JWT Token State (Stored in localStorage)
  const [jwtToken, setJwtToken] = useState(getSavedJwtToken());
  const [tokenSavedNotice, setTokenSavedNotice] = useState(false);

  // Active Test Response Display State
  const [activeTest, setActiveTest] = useState(null); // name of currently running or last completed test
  const [testStatus, setTestStatus] = useState(null); // 'SUCCESS' | 'FAILED' | null
  const [httpStatus, setHttpStatus] = useState(null); // number | string | null
  const [jsonResponse, setJsonResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // CRM Data States (from GET endpoints)
  const [enquiriesData, setEnquiriesData] = useState(null);
  const [interactionsData, setInteractionsData] = useState(null);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState(null);
  const [interactionsError, setInteractionsError] = useState(null);

  // Custom Payload for Test Enquiry POST
  const [customEnquiry, setCustomEnquiry] = useState({
    name: "Test User " + Math.floor(Math.random() * 1000),
    phoneNumber: "9876543210",
    email: "test@example.com",
    message: "I am interested in your services (Automated API Test).",
  });

  const handleSaveToken = (e) => {
    e.preventDefault();
    saveJwtToken(jwtToken);
    setTokenSavedNotice(true);
    setTimeout(() => setTokenSavedNotice(false), 3000);
  };

  const handleClearToken = () => {
    setJwtToken("");
    saveJwtToken("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === "object" ? JSON.stringify(text, null, 2) : text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to execute and record an API test
  const runApiTest = async (testName, apiCallPromise) => {
    setActiveTest(testName);
    setIsLoading(true);
    setTestStatus(null);
    setHttpStatus(null);
    setJsonResponse(null);
    setErrorMessage(null);

    try {
      const data = await apiCallPromise;
      setTestStatus("SUCCESS");
      // If data is axios response, data.status; if interceptor returned response.data directly:
      setHttpStatus(200); // 200 or 201 successful
      setJsonResponse(data !== undefined ? data : { message: "Request succeeded with empty content" });
    } catch (err) {
      setTestStatus("FAILED");
      setHttpStatus(err.status || (err.isCorsOrNetwork ? "CORS/Network Error" : "ERROR"));
      setErrorMessage(err.message || "Request failed");
      setJsonResponse(err.data || {
        error: err.message,
        status: err.status,
        isCorsOrNetwork: err.isCorsOrNetwork,
        details: err.validationErrors || "Inspect browser console for full stack"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Test Enquiry API (POST)
  const testEnquiryApi = () => {
    runApiTest("Test Enquiry API (POST /api/website-enquiries)", submitEnquiry(customEnquiry));
  };

  // 2. Test WhatsApp API (POST)
  const testWhatsAppApi = () => {
    runApiTest("Test WhatsApp API (POST /api/website-interactions)", trackInteraction(INTERACTION_TYPES.WHATSAPP));
  };

  // 3. Test Call API (POST)
  const testCallApi = () => {
    runApiTest("Test Call API (POST /api/website-interactions)", trackInteraction(INTERACTION_TYPES.CALL));
  };

  // 4. Test Email API (POST)
  const testEmailApi = () => {
    runApiTest("Test Email API (POST /api/website-interactions)", trackInteraction(INTERACTION_TYPES.EMAIL));
  };

  // 6. Get Enquiries (GET)
  const fetchEnquiries = async () => {
    setLoadingEnquiries(true);
    setEnquiriesError(null);
    try {
      const data = await getEnquiries(jwtToken);
      // Normalize array if backend returns { data: [...] } or direct array
      const list = Array.isArray(data) ? data : data?.data || data?.items || [];
      setEnquiriesData(list);
      // Also update result preview
      setActiveTest("Get Enquiries (GET /api/website-enquiries)");
      setTestStatus("SUCCESS");
      setHttpStatus(200);
      setJsonResponse(data);
    } catch (err) {
      setEnquiriesError(err);
      setActiveTest("Get Enquiries (GET /api/website-enquiries)");
      setTestStatus("FAILED");
      setHttpStatus(err.status || "CORS/Network Error");
      setErrorMessage(err.message);
      setJsonResponse(err.data || { error: err.message });
    } finally {
      setLoadingEnquiries(false);
    }
  };

  // 7. Get Interactions (GET)
  const fetchInteractions = async () => {
    setLoadingInteractions(true);
    setInteractionsError(null);
    try {
      const data = await getInteractions(jwtToken);
      const list = Array.isArray(data) ? data : data?.data || data?.items || [];
      setInteractionsData(list);
      // Also update result preview
      setActiveTest("Get Interactions (GET /api/website-interactions)");
      setTestStatus("SUCCESS");
      setHttpStatus(200);
      setJsonResponse(data);
    } catch (err) {
      setInteractionsError(err);
      setActiveTest("Get Interactions (GET /api/website-interactions)");
      setTestStatus("FAILED");
      setHttpStatus(err.status || "CORS/Network Error");
      setErrorMessage(err.message);
      setJsonResponse(err.data || { error: err.message });
    } finally {
      setLoadingInteractions(false);
    }
  };

  // Single Item Deletion Helpers for Testing
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm(`Delete enquiry ID ${id}? (DELETE /api/website-enquiries/${id})`)) return;
    try {
      await deleteEnquiry(id, jwtToken);
      fetchEnquiries();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleDeleteInteraction = async (id) => {
    if (!window.confirm(`Delete interaction ID ${id}? (DELETE /api/website-interactions/${id})`)) return;
    try {
      await deleteInteraction(id, jwtToken);
      fetchInteractions();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-8 rounded-3xl shadow-xl border border-slate-700/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              <Terminal className="w-3.5 h-3.5" />
              <span>Real Backend API Telemetry</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              ASP.NET Core API Testing Dashboard
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify your <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">Website Enquiry</code> and <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">Website Interaction</code> endpoints. No mock data is used; all actions fire direct HTTP requests to <code className="text-sky-300 font-mono underline">{getActiveApiBaseUrl()}</code>.
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur p-4 rounded-2xl border border-slate-700 text-xs space-y-1">
            <div className="text-slate-400 font-semibold">Active Backend Base URL:</div>
            <div className="font-mono text-brand-300 font-bold break-all">
              {getActiveApiBaseUrl()}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Test Triggers (Left) & Realtime Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Action Control Buttons */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">API Trigger Suite</h2>
                <p className="text-xs text-slate-500">Run individual POST test payloads to verify SQL persistence</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg">
                Public Endpoints
              </span>
            </div>

            <div className="space-y-4">
              
              {/* 1. Test Enquiry API */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-sm font-bold text-slate-900">Test Enquiry API</span>
                  </div>
                  <code className="text-[11px] font-mono text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    POST /api/website-enquiries
                  </code>
                </div>
                
                <p className="text-xs text-slate-600">
                  Sends name, phoneNumber, email, and message without ID or createdDate.
                </p>

                <button
                  onClick={testEnquiryApi}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Test Enquiry API</span>
                </button>
              </div>

              {/* 2. Test WhatsApp API */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <span className="text-sm font-bold text-slate-900">Test WhatsApp API</span>
                  </div>
                  <code className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    interactionType: "WhatsAppClick"
                  </code>
                </div>

                <button
                  onClick={testWhatsAppApi}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Test WhatsApp API</span>
                </button>
              </div>

              {/* 3. Test Call API */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                    <span className="text-sm font-bold text-slate-900">Test Call API</span>
                  </div>
                  <code className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    interactionType: "CallClick"
                  </code>
                </div>

                <button
                  onClick={testCallApi}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-sky-900 bg-sky-100 hover:bg-sky-200 rounded-xl border border-sky-300 shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-700" />
                  <span>Test Call API</span>
                </button>
              </div>



              {/* 5. Test Email API */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                    <span className="text-sm font-bold text-slate-900">Test Email API</span>
                  </div>
                  <code className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    interactionType: "EmailClick"
                  </code>
                </div>

                <button
                  onClick={testEmailApi}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-700" />
                  <span>Test Email API</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Live Response Inspector & Debugger */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-base text-white">Live API Response Inspector</h3>
              </div>
              {jsonResponse && (
                <button
                  onClick={() => copyToClipboard(jsonResponse)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-2.5 py-1 bg-slate-800 rounded-lg hover:bg-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>
              )}
            </div>

            {/* Test Status Banner */}
            <div className="py-4">
              {isLoading ? (
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-brand-400 animate-spin" />
                  <div>
                    <div className="text-xs font-semibold text-brand-300">Sending Request...</div>
                    <div className="text-[11px] text-slate-400 font-mono">{activeTest}</div>
                  </div>
                </div>
              ) : activeTest ? (
                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  testStatus === "SUCCESS" 
                    ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-200"
                    : "bg-rose-950/40 border-rose-700/60 text-rose-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {testStatus === "SUCCESS" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                      <span className="font-bold text-xs uppercase tracking-wider">
                        Status: {testStatus}
                      </span>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded font-bold bg-slate-900 border border-slate-700">
                      HTTP Status: {httpStatus}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Endpoint: {activeTest}
                  </div>
                  {errorMessage && (
                    <div className="text-xs text-rose-300 mt-1">
                      {errorMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  Click any test button on the left to execute real API calls and inspect status & JSON response here.
                </div>
              )}
            </div>

            {/* Formatted JSON Output Display */}
            <div className="flex-1 flex flex-col mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Backend Response Payload:
              </span>
              <div className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs overflow-auto max-h-[380px]">
                {jsonResponse ? (
                  <pre className="text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify(jsonResponse, null, 2)}
                  </pre>
                ) : (
                  <span className="text-slate-600 italic">
                    // Awaiting API execution...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CRM Protected Data Section (Requires JWT Token) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-8">
        
        {/* Section Header & JWT Authentication Input */}
        <div className="border-b border-slate-100 pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                CRM Protected Endpoints
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                Protected CRM Inspection (Requires JWT)
              </h2>
              <p className="text-xs text-slate-500">
                The <code className="font-mono text-indigo-600">GET /api/website-enquiries</code> and <code className="font-mono text-indigo-600">GET /api/website-interactions</code> endpoints require authentication. Enter your token below.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchEnquiries}
                disabled={loadingEnquiries}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingEnquiries ? "animate-spin" : ""}`} />
                <span>Get Enquiries</span>
              </button>

              <button
                onClick={fetchInteractions}
                disabled={loadingInteractions}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInteractions ? "animate-spin" : ""}`} />
                <span>Get Interactions</span>
              </button>
            </div>
          </div>

          {/* JWT Token Input & Set Token Form */}
          <form onSubmit={handleSaveToken} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs shrink-0">
              <Key className="w-4 h-4 text-indigo-600" />
              <span>JWT Token:</span>
            </div>
            <input
              type="password"
              value={jwtToken}
              onChange={(e) => setJwtToken(e.target.value)}
              placeholder="Paste Bearer JWT token here (stored in browser localStorage only)..."
              className="flex-1 w-full px-3.5 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition w-full sm:w-auto"
              >
                Set Token
              </button>
              {jwtToken && (
                <button
                  type="button"
                  onClick={handleClearToken}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-slate-200 rounded-xl transition"
                  title="Clear token from localStorage"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
          {tokenSavedNotice && (
            <p className="text-xs text-emerald-600 font-semibold animate-fadeIn flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Token stored securely in browser localStorage.
            </p>
          )}
        </div>

        {/* 6. Enquiries Data Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-700" />
              <h3 className="text-base font-bold text-slate-900">Enquiries Database Records</h3>
              {enquiriesData && (
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {enquiriesData.length} entries
                </span>
              )}
            </div>
            <button
              onClick={fetchEnquiries}
              disabled={loadingEnquiries}
              className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingEnquiries ? "animate-spin" : ""}`} />
              Refresh Table
            </button>
          </div>

          {enquiriesError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{enquiriesError.message} (HTTP {enquiriesError.status || "Error"})</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 uppercase text-[10px] font-bold tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Is Deleted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {enquiriesData && enquiriesData.length > 0 ? (
                  enquiriesData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="py-3 px-4 text-slate-800 font-semibold">{item.name || "-"}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{item.phoneNumber || "-"}</td>
                      <td className="py-3 px-4 text-slate-600">{item.email || "-"}</td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={item.message}>{item.message || "-"}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {item.createdDate ? new Date(item.createdDate).toLocaleString() : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isDeleted ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {item.isDeleted ? "TRUE" : "FALSE"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteEnquiry(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Enquiry (DELETE API)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      {loadingEnquiries ? "Fetching records from ASP.NET Core..." : "No enquiry records loaded. Click 'Get Enquiries' with your JWT token."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Interactions Data Table */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-700" />
              <h3 className="text-base font-bold text-slate-900">Interactions Database Records</h3>
              {interactionsData && (
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {interactionsData.length} entries
                </span>
              )}
            </div>
            <button
              onClick={fetchInteractions}
              disabled={loadingInteractions}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingInteractions ? "animate-spin" : ""}`} />
              Refresh Table
            </button>
          </div>

          {interactionsError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{interactionsError.message} (HTTP {interactionsError.status || "Error"})</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 uppercase text-[10px] font-bold tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Interaction Type</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Is Deleted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {interactionsData && interactionsData.length > 0 ? (
                  interactionsData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          item.interactionType === 'WhatsAppClick' ? 'bg-emerald-100 text-emerald-800' :
                          item.interactionType === 'CallClick' ? 'bg-sky-100 text-sky-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.interactionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {item.createdDate ? new Date(item.createdDate).toLocaleString() : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.isDeleted ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {item.isDeleted ? "TRUE" : "FALSE"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteInteraction(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Interaction (DELETE API)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      {loadingInteractions ? "Fetching interaction telemetry from ASP.NET Core..." : "No interaction records loaded. Click 'Get Interactions' with your JWT token."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
