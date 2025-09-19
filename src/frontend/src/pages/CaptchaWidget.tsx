import { useState, useEffect } from "react";
import lipLogo from "../../assets/living_internet_protocol.webp";

// Mock challenge data
const mockChallenges = {
  grid: {
    title: "Complete the Pattern",
    instruction: "Select the grid that completes the pattern",
    question: [
      ["🔵", "⬜", "🔴"],
      ["⬜", "🔴", "🔵"],
      ["?", "?", "?"],
    ],
    options: [
      [["🔴", "🔵", "⬜"]],
      [["🔵", "🔴", "⬜"]],
      [["⬜", "🔵", "🔴"]],
      [["🔴", "⬜", "🔵"]],
    ],
    correct: 0,
  },
  rotation: {
    title: "Identify the Rotation",
    instruction: "Which image shows a 90° clockwise rotation?",
    question: [
      ["⬆️", "➡️"],
      ["⬅️", "⬇️"],
    ],
    options: [
      [["➡️", "⬇️"], ["⬆️", "⬅️"]],
      [["⬇️", "⬅️"], ["➡️", "⬆️"]],
      [["⬅️", "⬆️"], ["⬇️", "➡️"]],
      [["⬆️", "➡️"], ["⬅️", "⬇️"]],
    ],
    correct: 1,
  },
  color: {
    title: "Color Sequence",
    instruction: "What comes next in the sequence?",
    question: [
      ["🟦", "🟩", "🟨"],
      ["🟩", "🟨", "🟧"],
      ["🟨", "🟧", "?"],
    ],
    options: [
      [["🟥"]],
      [["🟦"]],
      [["🟩"]],
      [["🟪"]],
    ],
    correct: 0,
  },
  pattern: {
    title: "Mirror Pattern",
    instruction: "Select the mirrored version",
    question: [
      ["◀️", "🔺", "▶️"],
      ["🔻", "⭕", "🔺"],
      ["◀️", "🔻", "▶️"],
    ],
    options: [
      [["▶️", "🔺", "◀️"], ["🔺", "⭕", "🔻"], ["▶️", "🔻", "◀️"]],
      [["◀️", "🔺", "▶️"], ["🔻", "⭕", "🔺"], ["◀️", "🔻", "▶️"]],
      [["▶️", "🔻", "◀️"], ["🔺", "⭕", "🔻"], ["▶️", "🔺", "◀️"]],
      [["◀️", "🔻", "▶️"], ["🔺", "⭕", "🔻"], ["◀️", "🔺", "▶️"]],
    ],
    correct: 0,
  },
};

export function CaptchaWidget() {
  const [challenge, setChallenge] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [merchantConfig, setMerchantConfig] = useState<any>(null);

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || 'grid';
    const merchantId = params.get('merchant') || 'free-tier';
    const theme = params.get('theme') || 'dark';

    // Set merchant configuration
    const config = {
      merchantId,
      theme,
      isPremium: merchantId === 'premium-merchant',
      customLogo: merchantId === 'premium-merchant' ? '🏢' : null,
      brandName: merchantId === 'premium-merchant' ? 'TechForum Pro' : null,
      primaryColor: merchantId === 'premium-merchant' ? '#8B5CF6' : '#3B82F6',
    };

    setMerchantConfig(config);

    // Load challenge based on type
    const challengeTypes = Object.keys(mockChallenges);
    const challengeType = challengeTypes.includes(type) ? type : challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    setChallenge(mockChallenges[challengeType as keyof typeof mockChallenges]);
  }, []);

  const handleVerify = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === challenge.correct) {
      setVerificationStatus('success');

      // Send success message to parent window
      setTimeout(() => {
        window.parent.postMessage({ type: 'CAPTCHA_SUCCESS' }, '*');
      }, 1500);
    } else {
      setVerificationStatus('failed');
      setAttempts(attempts + 1);

      // Reset after failed attempt
      setTimeout(() => {
        setVerificationStatus('idle');
        setSelectedAnswer(null);

        // Load a new challenge after 3 failed attempts
        if (attempts >= 2) {
          const types = Object.keys(mockChallenges);
          const newType = types[Math.floor(Math.random() * types.length)];
          setChallenge(mockChallenges[newType as keyof typeof mockChallenges]);
          setAttempts(0);
        }
      }, 2000);
    }
  };

  if (!challenge || !merchantConfig) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white">Loading captcha...</div>
      </div>
    );
  }

  const bgColor = merchantConfig.theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = merchantConfig.theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} p-4`}>
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {merchantConfig.isPremium ? (
              <>
                <div className="text-2xl">{merchantConfig.customLogo}</div>
                <span className="font-semibold" style={{ color: merchantConfig.primaryColor }}>
                  {merchantConfig.brandName}
                </span>
              </>
            ) : (
              <>
                <img src={lipLogo} alt="LIP" className="h-8 w-8 rounded" />
                <span className="text-sm font-semibold text-gray-500">
                  Protected by LIP Captcha
                </span>
              </>
            )}
          </div>
          {attempts > 0 && (
            <span className="text-sm text-gray-500">
              Attempt {attempts}/3
            </span>
          )}
        </div>

        {/* Challenge */}
        <div className={`rounded-xl p-6 ${merchantConfig.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {verificationStatus === 'success' ? (
            <div className="text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h3 className="text-xl font-bold text-green-400">Verification Successful!</h3>
              <p className="mt-2 text-sm text-gray-400">You've been verified as human</p>
            </div>
          ) : verificationStatus === 'failed' ? (
            <div className="text-center">
              <div className="mb-4 text-6xl">❌</div>
              <h3 className="text-xl font-bold text-red-400">Incorrect Answer</h3>
              <p className="mt-2 text-sm text-gray-400">Please try again</p>
            </div>
          ) : (
            <>
              <h3 className={`mb-2 text-lg font-bold ${textColor}`}>
                {challenge.title}
              </h3>
              <p className={`mb-4 text-sm ${merchantConfig.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {challenge.instruction}
              </p>

              {/* Question Grid */}
              <div className="mb-6 rounded-lg bg-gray-700/50 p-4">
                {challenge.question.map((row: string[], i: number) => (
                  <div key={i} className="flex justify-center gap-2">
                    {row.map((cell: string, j: number) => (
                      <div
                        key={j}
                        className="flex h-12 w-12 items-center justify-center rounded border border-gray-600 bg-gray-800 text-2xl"
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map((option: string[][], index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`rounded-lg border-2 p-3 transition ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {option.map((row, i) => (
                      <div key={i} className="flex justify-center gap-1">
                        {row.map((cell, j) => (
                          <div
                            key={j}
                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-700 bg-gray-800 text-lg"
                          >
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </button>
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={selectedAnswer === null}
                className="mt-6 w-full rounded-lg py-3 font-semibold text-white transition disabled:opacity-50"
                style={{
                  background: selectedAnswer !== null
                    ? `linear-gradient(to right, ${merchantConfig.primaryColor}, ${merchantConfig.primaryColor}dd)`
                    : 'rgb(75, 85, 99)',
                }}
              >
                Verify I'm Human
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {!merchantConfig.isPremium && (
          <div className="mt-4 text-center">
            <a
              href="https://lip-captcha.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-400"
            >
              Learn more about LIP Captcha →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}