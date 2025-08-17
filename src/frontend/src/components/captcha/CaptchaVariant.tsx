import React, { useState } from "react";

interface VariantData {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  color: string;
  demo: boolean;
}

interface CaptchaVariantProps {
  variant: VariantData;
  onComplete: (success: boolean) => void;
  winRate: number;
}

export const CaptchaVariant: React.FC<CaptchaVariantProps> = ({
  variant,
  onComplete,
  winRate,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const difficultyColors = {
    Easy: "text-green-400 bg-green-900/20",
    Medium: "text-yellow-400 bg-yellow-900/20",
    Hard: "text-red-400 bg-red-900/20",
    Fun: "text-pink-400 bg-pink-900/20",
  };

  const handleTryChallenge = async () => {
    setIsCompleting(true);

    // Simulate challenge completion
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Demo mode: always win for demonstration
    const success = true; // In production: Math.random() * 100 < winRate

    setIsCompleting(false);
    onComplete(success);
  };

  const getVariantIcon = (id: string) => {
    switch (id) {
      case "arc-agi":
        return "🧩";
      case "recaptcha":
        return "🚦";
      case "friendly":
        return "🔒";
      case "hcaptcha":
        return "🖼️";
      case "turnstile":
        return "⚡";
      case "custom":
        return "👟";
      default:
        return "🎯";
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
        variant.color === "sponsored"
          ? "border-purple-500/50 bg-purple-900/10 shadow-lg shadow-purple-500/20 hover:border-purple-400 hover:bg-purple-900/30 hover:shadow-purple-500/30"
          : "border-gray-700 bg-transparent hover:border-gray-600 hover:bg-blue-900/20"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getVariantIcon(variant.id)}</div>
            <div>
              <h3 className="font-semibold text-white">{variant.name}</h3>
              <div
                className={`inline-block rounded-full px-2 py-1 text-xs ${
                  difficultyColors[
                    variant.difficulty as keyof typeof difficultyColors
                  ]
                }`}
              >
                {variant.difficulty}
              </div>
            </div>
          </div>

          {variant.demo && (
            <div className="rounded-md border border-blue-400/50 bg-blue-900/40 px-2 py-1 text-xs font-semibold text-blue-200">
              DEMO
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-white drop-shadow-sm">
          {variant.description}
        </p>

        {/* Stats Row */}
        <div className="mb-4 flex justify-between text-xs">
          <span className="font-medium text-white drop-shadow-sm">
            Win Rate: {winRate}%
          </span>
          <span className="font-medium text-white drop-shadow-sm">
            Prize: $1,000
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTryChallenge}
          disabled={isCompleting}
          className={`w-full rounded-lg py-3 font-semibold transition-all ${
            isCompleting
              ? "cursor-not-allowed bg-gray-600 text-gray-400"
              : variant.color === "sponsored"
                ? "bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-violet-600/20 hover:text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 hover:text-white"
          }`}
        >
          {isCompleting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              Completing Challenge...
            </div>
          ) : (
            "🎰 Try Lucky Captcha"
          )}
        </button>

        {/* Special Features */}
        {variant.id === "custom" && (
          <div className="mt-3 rounded-lg border border-cyan-500/30 bg-gradient-to-r from-blue-900/20 to-teal-900/20 p-3">
            <div className="mb-1 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-xs font-semibold text-transparent">
              SPONSORED CHALLENGE
            </div>
            <div className="text-xs text-gray-300">
              Nikex sponsors this challenge. Win $1000 and get exclusive sneaker
              access!
            </div>
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-teal-500/0 opacity-0 transition-opacity group-hover:opacity-20" />
    </div>
  );
};
