import React, { useEffect, useState } from "react";

interface JackpotModalProps {
  amount: number;
  variant: string;
  onClose: () => void;
}

export const JackpotModal: React.FC<JackpotModalProps> = ({
  amount,
  variant,
  onClose,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => setShowConfetti(false), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Generate confetti particles
  const confettiColors = [
    "#3b82f6",
    "#06b6d4",
    "#0891b2",
    "#14b8a6",
    "#0d9488",
    "#0e7490",
  ];
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    startX: Math.random() * 100,
    endX: Math.random() * 100,
  }));

  const handleShare = () => {
    const shareText = `🎉 I just won $${amount} from a ${variant} Lucky Captcha! 🎰 
    
The future of web verification is here - captchas that pay YOU! 

Try it yourself at the Living Internet Protocol demo 🚀

#LuckyCaptcha #LivingInternetProtocol #Web3 #ICP`;

    if (navigator.share) {
      navigator.share({
        title: "Lucky Captcha Prize!",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Share text copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Confetti */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute h-3 w-3 opacity-80"
              style={{
                backgroundColor: particle.color,
                left: `${particle.startX}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                animation: `fall ${particle.duration}s linear infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div
        className={`relative mx-4 w-full max-w-md transform transition-all duration-1000 ${
          animationPhase >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-1">
          <div className="rounded-xl bg-gray-900 p-8 text-center">
            {/* Main Animation */}
            <div
              className={`mb-6 transform transition-all duration-1000 ${
                animationPhase >= 1
                  ? "scale-100 rotate-0"
                  : "scale-0 rotate-180"
              }`}
            >
              <div className="mb-4 animate-bounce text-6xl">🎰</div>
              <div className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-4xl font-bold text-transparent">
                LUCKY PRIZE!
              </div>
            </div>

            {/* Prize Amount */}
            <div
              className={`mb-6 transform transition-all delay-500 duration-1000 ${
                animationPhase >= 2
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="mb-2 text-5xl font-bold text-green-400">
                ${amount.toLocaleString()}
              </div>
              <div className="text-lg text-gray-300">ICP Tokens Won!</div>
              <div className="mt-1 text-sm text-gray-400">From {variant}</div>
            </div>

            {/* Success Message */}
            <div
              className={`mb-8 transform transition-all delay-700 duration-1000 ${
                animationPhase >= 2
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="mb-4 rounded-lg border border-green-500/30 bg-green-900/20 p-4">
                <div className="mb-2 font-semibold text-green-400">
                  🎉 Congratulations! 🎉
                </div>
                <div className="text-sm text-gray-300">
                  You've just experienced the Lucky Captcha Revolution! In
                  production, these tokens would be transferred to your ICP
                  wallet.
                </div>
              </div>

              <div className="text-xs text-gray-400 italic">
                This is a demo with 100% win rate for demonstration purposes
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`transform space-y-3 transition-all delay-1000 duration-1000 ${
                animationPhase >= 2
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <button
                onClick={handleShare}
                className="w-full rounded-lg border border-cyan-500/30 bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-teal-700"
              >
                🚀 Share Your Win
              </button>

              <button
                onClick={onClose}
                className="w-full rounded-lg bg-gray-700 px-6 py-2 text-gray-300 transition-colors hover:bg-gray-600"
              >
                Continue Playing
              </button>
            </div>

            {/* Viral Message */}
            <div className="mt-6 text-xs text-gray-500">
              Every lucky prize creates viral marketing for the sponsor!
              <br />
              🔥 10x more engaging than traditional ads
            </div>
          </div>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
