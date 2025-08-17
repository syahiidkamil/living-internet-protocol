import React, { useEffect, useState } from "react";

interface NikexSuccessModalProps {
  onClose: () => void;
  designImage?: string | null;
  hasDesign: boolean;
}

export const NikexSuccessModal: React.FC<NikexSuccessModalProps> = ({
  onClose,
  designImage,
  hasDesign,
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
    "#8b5cf6", // purple
    "#a855f7", // purple-500
    "#ec4899", // pink-500
    "#f472b6", // pink-400
    "#d946ef", // fuchsia-500
    "#c084fc", // purple-400
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
    const shareText = hasDesign
      ? `🎨 I just submitted my sneaker design to the Nikex Brand Challenge! My design will become an NFT and I'll earn royalties from every sale! 👟✨ #NikexChallenge #NFT #DesignContest`
      : `✅ I just entered the Nikex Brand Challenge and earned the potential to be judged by Nikex judges! 👟🏆 #NikexChallenge #LuckyCaptcha`;

    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
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
                animationName: "confetti-fall",
                animationTimingFunction: "linear",
                animationIterationCount: "1",
                transform: "rotate(45deg)",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative mx-4 max-h-[95vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-8 shadow-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />

        <div className="relative">
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className={`mb-4 text-6xl transition-all duration-1000 ${
                animationPhase >= 1
                  ? "scale-100 rotate-0"
                  : "scale-0 rotate-180"
              }`}
            >
              🎉
            </div>
            <h2
              className={`mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent transition-all delay-300 duration-1000 ${
                animationPhase >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Submission Received!
            </h2>
            <p
              className={`text-lg text-gray-300 transition-all delay-500 duration-1000 ${
                animationPhase >= 1
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Thank you! You've earned the potential to be judged by Nikex
              judges
            </p>
          </div>

          {/* Main Content */}
          <div
            className={`space-y-4 transition-all delay-700 duration-1000 ${
              animationPhase >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            {/* Verification Success */}
            <div className="rounded-lg border border-green-500/30 bg-green-900/20 p-3">
              <div className="flex items-center gap-3">
                <div className="text-xl">✅</div>
                <div>
                  <h3 className="text-sm font-semibold text-green-300">
                    Human Verification Complete
                  </h3>
                </div>
              </div>
            </div>

            {/* Design Status */}
            {hasDesign ? (
              <div className="rounded-lg border border-purple-500/30 bg-purple-900/20 p-3">
                <div className="flex items-center gap-3">
                  {designImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={designImage}
                        alt="Your design"
                        className="h-12 w-12 rounded border border-purple-400/30 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-300">
                      🎨 Design as NFT
                    </h3>
                    <p className="text-xs text-gray-300">
                      Your design will be minted as an NFT with royalties
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-3">
                <div className="flex items-center gap-3">
                  <div className="text-xl">🏆</div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-300">
                      Contest Entry Confirmed
                    </h3>
                    <p className="text-xs text-gray-300">
                      You're eligible for judge evaluation
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Combined Info */}
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-3">
              <div className="text-center">
                <h3 className="mb-1 text-sm font-semibold text-yellow-300">
                  💰 Contest Rewards
                </h3>
                <div className="text-xs text-gray-300">
                  $1000 prize • Exclusive sneaker access{" "}
                  {hasDesign && "• NFT royalties"}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Winners announced January 31, 2025
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`mt-8 flex gap-3 transition-all delay-1000 duration-1000 ${
              animationPhase >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <button
              onClick={handleShare}
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700"
            >
              📱 Share Achievement
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
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
