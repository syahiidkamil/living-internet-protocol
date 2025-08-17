import React, { useState, useEffect } from "react";

interface RecaptchaSimulationProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const RecaptchaSimulation: React.FC<RecaptchaSimulationProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"analyzing" | "validating" | "complete">(
    "analyzing",
  );

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setPhase("analyzing");

      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setPhase("validating");

            // Short validation phase
            setTimeout(() => {
              setPhase("complete");
              setTimeout(() => {
                onSuccess();
              }, 1000);
            }, 1500);

            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(progressInterval);
    } else {
      // Reset when closed
      setProgress(0);
      setPhase("analyzing");
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 max-h-[95vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">🚦</div>
          <h2 className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-2xl font-bold text-transparent">
            reCAPTCHA v3
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Advanced behavior analysis in progress
          </p>
        </div>

        {/* Analysis Section */}
        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-900/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-green-300">
            🔍 Analyzing User Behavior
          </h3>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Analysis Items */}
          <div className="space-y-2 text-xs">
            <div
              className={`flex items-center gap-2 ${progress > 20 ? "text-green-300" : "text-gray-400"}`}
            >
              <div
                className={`h-2 w-2 rounded-full ${progress > 20 ? "bg-green-400" : "bg-gray-500"}`}
              />
              Mouse movement patterns
            </div>
            <div
              className={`flex items-center gap-2 ${progress > 40 ? "text-green-300" : "text-gray-400"}`}
            >
              <div
                className={`h-2 w-2 rounded-full ${progress > 40 ? "bg-green-400" : "bg-gray-500"}`}
              />
              Keyboard interaction timing
            </div>
            <div
              className={`flex items-center gap-2 ${progress > 60 ? "text-green-300" : "text-gray-400"}`}
            >
              <div
                className={`h-2 w-2 rounded-full ${progress > 60 ? "bg-green-400" : "bg-gray-500"}`}
              />
              Browser fingerprinting
            </div>
            <div
              className={`flex items-center gap-2 ${progress > 80 ? "text-green-300" : "text-gray-400"}`}
            >
              <div
                className={`h-2 w-2 rounded-full ${progress > 80 ? "bg-green-400" : "bg-gray-500"}`}
              />
              Risk assessment
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 text-center">
          {phase === "analyzing" && (
            <div className="text-sm text-gray-400">
              No interaction required - analyzing in background...
            </div>
          )}

          {phase === "validating" && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Validating human probability...
            </div>
          )}

          {phase === "complete" && (
            <div className="rounded-lg border border-green-500/30 bg-green-900/20 p-3">
              <div className="mb-1 font-semibold text-green-400">
                ✅ Verification Complete
              </div>
              <div className="text-xs text-gray-300">
                Human probability: 99.9%
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center text-xs text-gray-500">
          reCAPTCHA v3 analyzes interactions without requiring puzzle solving
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
