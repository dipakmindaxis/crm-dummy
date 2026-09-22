import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ApiTesting from "./pages/ApiTesting";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import ApiStatusBadge from "./components/ApiStatusBadge";
import { VisitorProvider } from "./context/VisitorContext";

export default function App() {
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'testing'

  return (
    <VisitorProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        {/* Sticky Header */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === "home" ? (
            <Home setActiveTab={setActiveTab} />
          ) : (
            <ApiTesting />
          )}
        </main>

        {/* Corporate Footer with tracked interactions */}
        <Footer setActiveTab={setActiveTab} />

        {/* Floating Tracked Widgets (WhatsApp & Call) */}
        <FloatingActions />

        {/* Realtime API Health & Port Switcher Indicator */}
        <ApiStatusBadge />
      </div>
    </VisitorProvider>
  );
}
