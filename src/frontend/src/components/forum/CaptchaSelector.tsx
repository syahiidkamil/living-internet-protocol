import React from "react";

interface CaptchaOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface CaptchaSelectorProps {
  onSelect: (selectedCaptcha: CaptchaOption) => void;
}

const CAPTCHA_OPTIONS: CaptchaOption[] = [
  {
    id: "arc-agi",
    name: "ARC-AGI Challenge",
    icon: "🧩",
    color: "from-blue-500 to-cyan-500",
    description: "Pattern recognition puzzle",
  },
  {
    id: "recaptcha",
    name: "reCAPTCHA v3",
    icon: "🚦",
    color: "from-green-500 to-emerald-500",
    description: "Behavior analysis",
  },
  {
    id: "custom",
    name: "Nikex Brand Challenge",
    icon: "👟",
    color: "from-purple-500 to-pink-500",
    description: "Design verification",
  },
  {
    id: "draw-triangle",
    name: "Draw a Triangle",
    icon: "📐",
    color: "from-pink-500 to-purple-500",
    description: "Shape drawing test",
  },
];

export const CaptchaSelector: React.FC<CaptchaSelectorProps> = ({
  onSelect,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
          Choose Your Verification Challenge
        </h2>
        <p className="text-gray-400">
          Select which captcha challenge you'd like to complete
        </p>
      </div>

      {/* Demo Disclaimer */}
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-xl text-yellow-400">ℹ️</div>
          <div>
            <h3 className="mb-1 text-sm font-semibold text-yellow-300">
              Demo Mode - Choose Your Challenge
            </h3>
            <p className="text-xs text-gray-300">
              In production, the captcha type would be randomly selected for
              security. For demonstration purposes, you can choose which
              verification challenge to try.
            </p>
          </div>
        </div>
      </div>

      {/* Captcha Options Grid */}
      <div className="grid grid-cols-2 gap-4">
        {CAPTCHA_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            className="group relative rounded-xl border-2 border-gray-600 bg-gray-800/50 p-6 transition-all duration-300 hover:scale-105 hover:border-gray-500 hover:shadow-lg"
          >
            {/* Hover gradient effect */}
            <div
              className={`absolute inset-0 rounded-xl bg-gradient-to-br ${option.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
            />

            <div className="relative space-y-3 text-center">
              {/* Icon */}
              <div className="text-4xl">{option.icon}</div>

              {/* Name */}
              <div className="font-semibold text-white transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-teal-400 group-hover:bg-clip-text group-hover:text-transparent">
                {option.name}
              </div>

              {/* Description */}
              <div className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                {option.description}
              </div>

              {/* Subtle border gradient on hover */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${option.color} pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
              />
            </div>

            {/* Click indicator */}
            <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            </div>
          </button>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Each challenge type offers different verification methods and user
          experiences
        </p>
      </div>
    </div>
  );
};
