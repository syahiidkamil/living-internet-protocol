import React, { useState } from "react";
import { ForumCaptchaSelector } from "./ForumCaptchaSelector";

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
  const [, setCaptchaCompleted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      setStep("captcha");
    }
  };

  const handleCaptchaComplete = () => {
    setCaptchaCompleted(true);
    setStep("success");
    // Auto-submit after brief delay
    setTimeout(() => {
      onSubmit(title, content);
    }, 2000);
  };

  const renderForm = () => (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Create New Post</h2>
        <p className="text-sm text-gray-400">
          Share your thoughts with the verified human community. You'll need to
          complete a quick captcha to post.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={6}
            className="w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-600 px-6 py-2 text-gray-300 transition-colors hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-2 text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-teal-700"
          >
            🎰 Post with Lucky Captcha →
          </button>
        </div>
      </form>
    </div>
  );

  const renderCaptcha = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-xl font-bold text-transparent">
          🎰 Lucky Captcha Challenge
        </h2>
        <p className="text-sm text-gray-400">
          Your verification challenge is being selected randomly! Complete it to
          post your message.
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={() => setStep("form")}
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          ← Back to Edit Post
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="mb-4 text-6xl">✅</div>

      <div>
        <h2 className="mb-2 text-2xl font-bold text-green-400">
          Verification Complete!
        </h2>
        <p className="text-gray-400">
          Your post is being published to the verified humans community...
        </p>
      </div>

      <div className="rounded-lg border border-green-500/30 bg-green-900/20 p-4">
        <div className="mb-2 text-sm text-green-300">
          🎉 Lucky Captcha Complete!
        </div>
        <div className="text-xs text-gray-400">
          You successfully completed your randomly selected verification
          challenge
        </div>
      </div>

      <div className="animate-pulse text-sm text-gray-400">
        Publishing your post...
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl">
        <div className="rounded-xl border border-gray-700 bg-gray-900">
          {/* Header */}
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎰</div>
                <div>
                  <h1 className="font-semibold text-white">
                    Lucky Captcha Posting
                  </h1>
                  <div className="text-sm text-gray-400">
                    Step{" "}
                    {step === "form" ? "1" : step === "captcha" ? "2" : "3"} of
                    3
                  </div>
                </div>
              </div>

              {step !== "success" && (
                <button
                  onClick={onClose}
                  className="text-gray-400 transition-colors hover:text-white"
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
                width:
                  step === "form" ? "33%" : step === "captcha" ? "66%" : "100%",
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

      {/* Lucky Captcha Selector Modal */}
      <ForumCaptchaSelector
        isOpen={step === "captcha"}
        onSuccess={handleCaptchaComplete}
        onClose={() => setStep("form")}
      />
    </div>
  );
};
