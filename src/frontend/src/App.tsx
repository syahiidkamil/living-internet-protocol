import { useState } from "react";
import { LuckyCaptchaPlayground } from "./pages/LuckyCaptchaPlayground";
import { SimpleForum } from "./pages/SimpleForum";
import lipLogo from "../assets/living_internet_protocol.webp";

type ViewType = "playground" | "forum";

function App() {
  const [view, setView] = useState<ViewType>("playground");

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-sm p-4 sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lipLogo} alt="LIP Logo" className="w-8 h-8 rounded-lg" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Living Internet Protocol
            </h1>
            <div className="hidden sm:block rounded-full bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-500/30 px-3 py-1 text-xs text-white font-semibold">
              MVP Demo
            </div>
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {view === "playground" && <LuckyCaptchaPlayground />}
      {view === "forum" && <SimpleForum />}
    </div>
  );
}

export default App;
