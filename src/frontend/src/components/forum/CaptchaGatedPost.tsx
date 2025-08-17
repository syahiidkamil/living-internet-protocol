import React, { useState } from "react";
import { ARCChallenge, ARCChallengeData } from "../captcha/ARCChallenge";
import { Grid2x2, createEmptyGrid } from "../common/ARCGrid";

interface CaptchaGatedPostProps {
  onSubmit: (title: string, content: string) => void;
  onClose: () => void;
}

export const CaptchaGatedPost: React.FC<CaptchaGatedPostProps> = ({
  onSubmit,
  onClose,
}) => {
  const [step, setStep] = useState<"form" | "captcha" | "success">("form");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [captchaCompleted, setCaptchaCompleted] = useState(false);

  // Simple demo challenge for the forum
  const demoChallenge: ARCChallengeData = {
    id: "forum-demo",
    patternType: "copy_pattern",
    examples: [
      {
        input: {
          cells: [
            ["pink", "black"],
            ["black", "yellow"]
          ]
        },
        output: {
          cells: [
            ["pink", "black"],
            ["black", "yellow"]
          ]
        }
      }
    ],
    testInput: {
      cells: [
        ["yellow", "black"],
        ["black", "pink"]
      ]
    },
    solution: {
      cells: [
        ["yellow", "black"],
        ["black", "pink"]
      ]
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      setStep("captcha");
    }
  };

  const handleCaptchaComplete = (success: boolean) => {
    if (success) {
      setCaptchaCompleted(true);
      setStep("success");
      // Auto-submit after brief delay
      setTimeout(() => {
        onSubmit(title, content);
      }, 2000);
    }
  };

  const renderForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Create New Post</h2>
        <p className="text-gray-400 text-sm">
          Share your thoughts with the verified human community. You'll need to complete a quick captcha to post.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={6}
            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Next: Verify Human →
          </button>
        </div>
      </form>
    </div>
  );

  const renderCaptcha = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Human Verification Required</h2>
        <p className="text-gray-400 text-sm">
          Complete this quick challenge to prove you're human and post to the forum.
        </p>
      </div>

      <div className="rounded-lg bg-gray-800/50 p-6">
        <ARCChallenge
          challenge={demoChallenge}
          onSolved={handleCaptchaComplete}
        />
      </div>

      <div className="text-center">
        <button
          onClick={() => setStep("form")}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Back to Edit Post
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">✅</div>
      
      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-2">
          Verification Complete!
        </h2>
        <p className="text-gray-400">
          Your post is being published to the verified humans community...
        </p>
      </div>

      <div className="rounded-lg bg-green-900/20 border border-green-500/30 p-4">
        <div className="text-sm text-green-300 mb-2">
          🎉 Demo Bonus: In production, you might have won a Lucky Captcha prize!
        </div>
        <div className="text-xs text-gray-400">
          Some captchas offer $1000 lucky prizes while verifying humanity
        </div>
      </div>

      <div className="animate-pulse text-gray-400 text-sm">
        Publishing your post...
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl">
        <div className="rounded-xl bg-gray-900 border border-gray-700">
          {/* Header */}
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🛡️</div>
                <div>
                  <h1 className="font-semibold text-white">Captcha-Gated Posting</h1>
                  <div className="text-sm text-gray-400">
                    Step {step === "form" ? "1" : step === "captcha" ? "2" : "3"} of 3
                  </div>
                </div>
              </div>
              
              {step !== "success" && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ 
                width: step === "form" ? "33%" : step === "captcha" ? "66%" : "100%" 
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "form" && renderForm()}
            {step === "captcha" && renderCaptcha()}
            {step === "success" && renderSuccess()}
          </div>
        </div>
      </div>
    </div>
  );
};