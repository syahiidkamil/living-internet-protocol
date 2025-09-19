import { useState, useEffect } from "react";
import { LuckyCaptchaPlayground } from "./pages/LuckyCaptchaPlayground";
import { SimpleForum } from "./pages/SimpleForum";
import { CaptchaMarketplace } from "./pages/CaptchaMarketplace";
import { SocialMediaDemo } from "./pages/SocialMediaDemo";
import { MerchantDashboard } from "./pages/MerchantDashboard";
import { CaptchaWidget } from "./pages/CaptchaWidget";
import lipLogo from "../assets/living_internet_protocol.webp";

type ViewType = "playground" | "forum" | "marketplace" | "demo" | "dashboard";

function App() {
  const [view, setView] = useState<ViewType>("demo");

  // Check if this is the captcha widget route using query params
  const isWidgetMode = window.location.search.includes('widget=true');

  // If this is the widget route, render only the widget
  if (isWidgetMode) {
    return <CaptchaWidget />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-gray-700/50 bg-gray-900/95 p-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lipLogo} alt="LIP Logo" className="h-8 w-8 rounded-lg" />
            <h1 className="bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
              Living Internet Protocol
            </h1>
            <div className="hidden rounded-full border border-cyan-500/30 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 px-3 py-1 text-xs font-semibold text-white sm:block">
              MVP Demo
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView("demo")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                view === "demo"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:text-white"
              }`}
            >
              📱 Social Demo
            </button>
            <button
              onClick={() => setView("dashboard")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                view === "dashboard"
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:text-white"
              }`}
            >
              📊 Dashboard
            </button>
            <div className="h-8 w-px bg-gray-700" />
            <button
              onClick={() => setView("playground")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                view === "playground"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 hover:text-white"
              }`}
            >
              🎰 Lucky Captcha
            </button>
            <button
              onClick={() => setView("forum")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                view === "forum"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 hover:text-white"
              }`}
            >
              🏛️ Forum
            </button>
            <button
              onClick={() => setView("marketplace")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                view === "marketplace"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 hover:text-white"
              }`}
            >
              🛒 Marketplace
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {view === "demo" && <SocialMediaDemo />}
      {view === "dashboard" && <MerchantDashboard />}
      {view === "playground" && <LuckyCaptchaPlayground />}
      {view === "forum" && <SimpleForum />}
      {view === "marketplace" && <CaptchaMarketplace />}
    </div>
  );
}

export default App;
