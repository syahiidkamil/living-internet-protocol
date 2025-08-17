import React, { useState } from "react";
import { CaptchaSelector } from "./CaptchaSelector";
import { RecaptchaSimulation } from "./RecaptchaSimulation";
import { ARCChallengeModal } from "../captcha/ARCChallengeModal";
import { NikexChallengeModal } from "../captcha/NikexChallengeModal";
import { DrawTriangleModal } from "../captcha/DrawTriangleModal";

interface CaptchaOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface ForumCaptchaSelectorProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const ForumCaptchaSelector: React.FC<ForumCaptchaSelectorProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [selectedCaptcha, setSelectedCaptcha] = useState<CaptchaOption | null>(
    null,
  );
  const [showSelector, setShowSelector] = useState(true);

  // Modal states for each captcha type
  const [showARC, setShowARC] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [showNikex, setShowNikex] = useState(false);
  const [showDrawTriangle, setShowDrawTriangle] = useState(false);

  const handleCaptchaSelection = (selected: CaptchaOption) => {
    setSelectedCaptcha(selected);
    setShowSelector(false);

    // Open the appropriate modal based on selection
    switch (selected.id) {
      case "arc-agi":
        setShowARC(true);
        break;
      case "recaptcha":
        setShowRecaptcha(true);
        break;
      case "custom":
        setShowNikex(true);
        break;
      case "draw-triangle":
        setShowDrawTriangle(true);
        break;
    }
  };

  const handleCaptchaSuccess = () => {
    // Close all modals
    setShowARC(false);
    setShowRecaptcha(false);
    setShowNikex(false);
    setShowDrawTriangle(false);

    // Call parent success handler
    onSuccess();
  };

  const handleCaptchaClose = () => {
    // Close all modals and return to selector
    setShowARC(false);
    setShowRecaptcha(false);
    setShowNikex(false);
    setShowDrawTriangle(false);
    setShowSelector(true);
    setSelectedCaptcha(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="mx-4 max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
          {showSelector && (
            <CaptchaSelector onSelect={handleCaptchaSelection} />
          )}

          {!showSelector && selectedCaptcha && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Challenge Selected: {selectedCaptcha.name}
                </h2>
                <p className="text-gray-400">
                  Complete this verification to post your message
                </p>
              </div>

              <div className="rounded-lg border border-gray-600 bg-gray-800/50 p-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl">{selectedCaptcha.icon}</div>
                  <div>
                    <div className="font-semibold text-white">
                      {selectedCaptcha.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedCaptcha.description}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                The challenge will open in a new modal...
              </div>

              <button
                onClick={handleCaptchaClose}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                ← Back to Selector
              </button>
            </div>
          )}

          {/* Close button - only show when selector is visible */}
          {showSelector && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Individual Captcha Modals */}
      <ARCChallengeModal
        isOpen={showARC}
        onSuccess={handleCaptchaSuccess}
        onClose={handleCaptchaClose}
      />

      <RecaptchaSimulation
        isOpen={showRecaptcha}
        onSuccess={handleCaptchaSuccess}
        onClose={handleCaptchaClose}
      />

      <NikexChallengeModal
        isOpen={showNikex}
        onSuccess={handleCaptchaSuccess}
        onClose={handleCaptchaClose}
      />

      <DrawTriangleModal
        isOpen={showDrawTriangle}
        onSuccess={handleCaptchaSuccess}
        onClose={handleCaptchaClose}
      />
    </>
  );
};
