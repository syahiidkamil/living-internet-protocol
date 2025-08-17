import React from "react";

interface WinRateAllocatorProps {
  winRate: number;
  onWinRateChange: (rate: number) => void;
  overrideDemoChance: boolean;
  onOverrideDemoChanceChange: (override: boolean) => void;
}

export const WinRateAllocator: React.FC<WinRateAllocatorProps> = ({
  winRate,
  onWinRateChange,
  overrideDemoChance,
  onOverrideDemoChanceChange,
}) => {
  const presetRates = [
    {
      rate: 0.0001,
      label: "Ultra Rare",
      color: "text-red-400",
      desc: "Maximum suspense",
    },
    {
      rate: 0.1,
      label: "Rare",
      color: "text-orange-400",
      desc: "High excitement",
    },
    {
      rate: 1,
      label: "Standard",
      color: "text-yellow-400",
      desc: "Balanced engagement",
    },
    {
      rate: 50,
      label: "Demo Common",
      color: "text-green-400",
      desc: "Demo testing",
    },
    {
      rate: 100,
      label: "Demo",
      color: "text-blue-400",
      desc: "Always win demo",
    },
  ];

  const calculateROI = (rate: number) => {
    // Simplified ROI calculation for demo
    const avgPrize = 1000;
    const engagementMultiplier = Math.max(1, (100 - rate) / 10);
    const viralSpread = rate < 10 ? 5 : rate < 25 ? 3 : 1;
    return Math.round(engagementMultiplier * viralSpread * 100);
  };

  const getPsychologyNote = (rate: number) => {
    if (rate <= 0.1) return "Variable ratio reinforcement - most addictive";
    if (rate <= 1) return "Intermittent reinforcement - high engagement";
    if (rate <= 10) return "Regular rewards - steady participation";
    if (rate <= 50) return "Frequent rewards - casual engagement";
    return "Demo mode - testing purposes";
  };

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-lg font-semibold text-transparent">
        🎯 Win Rate Allocator
      </h3>

      {/* Current Setting */}
      <div className="mb-6 text-center">
        <div className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
          {winRate >= 1
            ? `${winRate}%`
            : winRate < 0.001
              ? `${winRate * 10000}/10K`
              : `${winRate}%`}
        </div>
        <div className="text-sm text-gray-400">Current Win Rate</div>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <input
          type="range"
          min="0.0001"
          max="100"
          step="0.0001"
          value={winRate}
          onChange={(e) => onWinRateChange(parseFloat(e.target.value))}
          className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #a855f7 ${Math.min(winRate / 2, 50)}%, #06b6d4 ${Math.min(winRate, 100)}%, #374151 ${Math.min(winRate, 100)}%, #374151 100%)`,
          }}
        />
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>0.0001%</span>
          <span>1%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Override Demo Chance Checkbox */}
      <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={overrideDemoChance}
            onChange={(e) => onOverrideDemoChanceChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-600 focus:ring-2 focus:ring-yellow-500"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-yellow-300">
              Override Demo Chance
            </div>
            <div className="text-xs text-gray-400">
              Demo mode normally has 100% win rate. Check this to use the Win
              Rate Allocator setting instead.
            </div>
          </div>
        </label>
      </div>

      {/* Preset Buttons */}
      <div className="mb-6 space-y-2">
        <div className="mb-3 text-sm font-medium text-gray-300">
          Quick Presets:
        </div>
        {presetRates.map((preset) => (
          <button
            key={preset.rate}
            onClick={() => onWinRateChange(preset.rate)}
            className={`w-full rounded-lg p-3 text-left transition-all ${
              winRate === preset.rate
                ? "border border-cyan-500/50 bg-gradient-to-r from-blue-900/50 to-cyan-900/50"
                : "bg-gray-700/50 hover:border-cyan-500/30 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-cyan-900/20"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`font-semibold ${preset.color}`}>
                  {preset.rate >= 1
                    ? `${preset.rate}%`
                    : preset.rate < 0.001
                      ? `${preset.rate * 10000}/10K`
                      : `${preset.rate}%`}{" "}
                  - {preset.label}
                </div>
                <div className="text-xs text-gray-400">{preset.desc}</div>
              </div>
              <div className="text-xs text-gray-400">
                ROI: {calculateROI(preset.rate)}x
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Psychology Insight */}
      <div className="mb-4 rounded-lg border border-cyan-500/30 bg-gradient-to-r from-blue-900/20 to-teal-900/20 p-4">
        <div className="mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-sm font-medium text-transparent">
          🧠 Psychology Insight
        </div>
        <div className="text-xs text-gray-300">
          {getPsychologyNote(winRate)}
        </div>
      </div>

      {/* Economics */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-300">
          Economic Impact:
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="rounded bg-gray-700/50 p-3">
            <div className="font-medium text-gray-300">Expected Cost</div>
            <div className="font-semibold text-white">
              ${(winRate * 10).toFixed(0)} per 1000 attempts
            </div>
          </div>

          <div className="rounded bg-gray-700/50 p-3">
            <div className="font-medium text-gray-300">Viral Multiplier</div>
            <div className="font-semibold text-white">
              {winRate < 10 ? "5x" : winRate < 25 ? "3x" : "1x"} spread
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-300 italic">
          Lower rates = higher viral potential + more addictive engagement
        </div>
      </div>
    </div>
  );
};
