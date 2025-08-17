import React, { useState } from "react";
import { CaptchaVariant } from "../components/captcha/CaptchaVariant";
import { WinRateAllocator } from "../components/captcha/WinRateAllocator";
import { JackpotModal } from "../components/captcha/JackpotModal";

export const LuckyCaptchaPlayground: React.FC = () => {
  const [winRate, setWinRate] = useState(1); // Percentage
  const [showJackpot, setShowJackpot] = useState(false);
  const [showAttemptsAccordion, setShowAttemptsAccordion] = useState(false);
  const [showIdentityAccordion, setShowIdentityAccordion] = useState(false);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    totalWins: 0,
    totalEarned: 0,
  });
  const [attemptsByVariant, setAttemptsByVariant] = useState({
    "arc-agi": 0,
    "recaptcha": 0,
    "custom": 0,
    "friendly": 0,
    "turnstile": 0,
    "hcaptcha": 0,
  });

  const captchaVariants = [
    {
      id: "arc-agi",
      name: "ARC-AGI Challenge",
      description: "Pattern recognition puzzles that test abstract reasoning",
      difficulty: "Hard",
      color: "blue",
      demo: true,
    },
    {
      id: "recaptcha",
      name: "reCAPTCHA v3",
      description: "Click all images with traffic lights",
      difficulty: "Easy",
      color: "green",
      demo: true,
    },
    {
      id: "custom",
      name: "Nikex Brand Challenge",
      description: "Design your dream sneaker - Win $1000!",
      difficulty: "Fun",
      color: "sponsored",
      demo: true,
    },
    {
      id: "friendly",
      name: "FriendlyCaptcha",
      description: "Privacy-focused proof of work challenge",
      difficulty: "Medium",
      color: "purple",
      demo: true,
    },
    {
      id: "turnstile",
      name: "Cloudflare Turnstile",
      description: "Invisible challenge with minimal friction",
      difficulty: "Easy",
      color: "yellow",
      demo: true,
    },
    {
      id: "hcaptcha",
      name: "hCaptcha",
      description: "Accessibility-focused image classification",
      difficulty: "Medium",
      color: "orange",
      demo: true,
    },
  ];

  const handleCaptchaComplete = (variantId: string, success: boolean) => {
    const newStats = {
      totalAttempts: stats.totalAttempts + 1,
      totalWins: success ? stats.totalWins + 1 : stats.totalWins,
      totalEarned: success ? stats.totalEarned + 1000 : stats.totalEarned,
    };
    setStats(newStats);

    // Update attempts by variant
    setAttemptsByVariant(prev => ({
      ...prev,
      [variantId]: prev[variantId as keyof typeof prev] + 1,
    }));

    // Demo mode: always show lucky prize for demonstration
    if (success) {
      setShowJackpot(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-8 lg:grid-cols-5 items-start">
            <div className="lg:col-span-3 text-center lg:text-left">
              <h1 className="mb-6 bg-gradient-to-r from-purple-500 via-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-4xl lg:text-5xl font-bold text-transparent leading-tight">
                🎰 Lucky Captcha Playground
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl">
                Experience the future of web verification. Try different captcha variants and see how Lucky Captcha 
                turns boring verification into exciting lottery tickets!
              </p>
            </div>
            
            {/* Proof of Humanity Tracker */}
            <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 backdrop-blur-sm border border-cyan-500/30">
              <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                🛡️ Proof of Humanity Tracker
              </h3>
              <div className="space-y-3">
                {/* Total Attempts Accordion */}
                <div className="border border-gray-600/30 rounded-lg">
                  <button
                    onClick={() => setShowAttemptsAccordion(!showAttemptsAccordion)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-700/20 transition-colors rounded-lg"
                  >
                    <div className="text-sm text-gray-300 font-medium">Total Attempts</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{stats.totalAttempts}</div>
                      <div className={`transform transition-transform ${showAttemptsAccordion ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {showAttemptsAccordion && (
                    <div className="px-3 pb-3 space-y-2 border-t border-gray-600/30 pt-3">
                      {captchaVariants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="text-sm">{variant.name === "ARC-AGI Challenge" ? "🧩" : variant.name === "reCAPTCHA v3" ? "🚦" : variant.name === "Nike Brand Challenge" ? "👟" : variant.name === "FriendlyCaptcha" ? "🔒" : variant.name === "Cloudflare Turnstile" ? "⚡" : "🖼️"}</div>
                            <span className="text-gray-300">{variant.name}</span>
                          </div>
                          <span className="text-white font-medium">{attemptsByVariant[variant.id as keyof typeof attemptsByVariant]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300 font-medium">ICP Identity</div>
                  <div className="text-sm font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">rdmx6-jaaaa-aaaah-qcaiq-cai</div>
                </div>

                {/* Historical Identity Piece Accordion */}
                <div className="border border-gray-600/30 rounded-lg">
                  <button
                    onClick={() => setShowIdentityAccordion(!showIdentityAccordion)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-700/20 transition-colors rounded-lg"
                  >
                    <div className="text-sm text-gray-300 font-medium">Historical Identity Piece</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent font-medium">Genesis Human #1337</div>
                      <div className={`transform transition-transform ${showIdentityAccordion ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {showIdentityAccordion && (
                    <div className="px-3 pb-3 space-y-3 border-t border-gray-600/30 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">NFT Collection</span>
                        <span className="text-white font-medium">Genesis Humans</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Token ID</span>
                        <span className="text-white font-medium">#1337</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Mint Date</span>
                        <span className="text-white font-medium">2024-01-15</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Rarity</span>
                        <span className="text-cyan-400 font-medium">Legendary</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Biography Length</span>
                        <span className="text-white font-medium">42,357 chars</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Captcha Variants Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {captchaVariants.map((variant) => (
                <CaptchaVariant
                  key={variant.id}
                  variant={variant}
                  onComplete={(success) => handleCaptchaComplete(variant.id, success)}
                  winRate={winRate}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Win Rate Allocator */}
            <WinRateAllocator
              winRate={winRate}
              onWinRateChange={setWinRate}
            />

            {/* Live Demo Notice */}
            <div className="rounded-xl bg-gradient-to-r from-blue-900/20 to-teal-900/20 border border-cyan-500/30 p-6">
              <h3 className="mb-3 text-lg font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                🎯 Live Demo Mode
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                This playground runs in demo mode with enhanced win rates for demonstration purposes. 
                In production, win rates are carefully balanced for sustainability.
              </p>
              <div className="text-xs text-gray-400">
                Demo win rate: <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent font-bold">100%</span> (vs production: ~{winRate}%)
              </div>
            </div>

            {/* How It Works */}
            <div className="rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                🎲 How Lucky Captcha Works
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">1.</span>
                  <span>User encounters captcha on any website</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400">2.</span>
                  <span>Completes verification challenge</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-teal-400">3.</span>
                  <span>Random chance to win $1000 ICP prize</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400">4.</span>
                  <span>Viral sharing spreads brand awareness</span>
                </div>
              </div>
            </div>

            {/* Market Opportunity */}
            <div className="rounded-xl bg-gradient-to-r from-blue-900/20 to-teal-900/20 border border-cyan-500/30 p-6">
              <h3 className="mb-3 text-lg font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                🚨 Market Opportunity
              </h3>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">$200B</div>
              <p className="text-sm text-gray-300">
                Google Ads market waiting to be disrupted by engaging, interactive verification experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lucky Prize Modal */}
      {showJackpot && (
        <JackpotModal
          amount={1000}
          variant="Challenge"
          onClose={() => setShowJackpot(false)}
        />
      )}
    </div>
  );
};