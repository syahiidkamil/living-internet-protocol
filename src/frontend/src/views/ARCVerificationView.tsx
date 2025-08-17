import React, { useState, useEffect } from 'react';
import { ARCChallenge, ARCChallengeData } from '../components';
import { backendService } from '../services/backendService';

export const ARCVerificationView: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<ARCChallengeData | null>(null);
  const [challengeNumber, setChallengeNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showMintButton, setShowMintButton] = useState(false);

  const startVerification = async () => {
    setIsLoading(true);
    try {
      await backendService.start_session();
      setSessionStarted(true);
      await loadChallenge(1);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
    setIsLoading(false);
  };

  const loadChallenge = async (num: number) => {
    setIsLoading(true);
    try {
      const result = await backendService.get_arc_challenge(num);
      if ('Ok' in result) {
        setCurrentChallenge(result.Ok);
      } else {
        console.error('Failed to load challenge:', result.Err);
      }
    } catch (error) {
      console.error('Failed to load challenge:', error);
    }
    setIsLoading(false);
  };

  const handleChallengeSolved = async (correct: boolean) => {
    if (correct) {
      setScore(score + 1);
    }

    // Wait a moment to show the result
    setTimeout(() => {
      if (challengeNumber < 3) {
        // Move to next challenge
        const nextChallenge = challengeNumber + 1;
        setChallengeNumber(nextChallenge);
        loadChallenge(nextChallenge);
      } else {
        // All challenges completed
        setIsCompleted(true);
        if (score + (correct ? 1 : 0) >= 2) { // Need at least 2/3 correct
          setShowMintButton(true);
        }
      }
    }, 2000);
  };

  const handleMintProof = async () => {
    setIsLoading(true);
    try {
      const result = await backendService.mint_proof();
      if ('Ok' in result) {
        alert('Success! Your proof of humanity NFT has been minted.');
      } else {
        alert(`Error: ${result.Err}`);
      }
    } catch (error) {
      console.error('Failed to mint proof:', error);
      alert('Failed to mint proof. Please try again.');
    }
    setIsLoading(false);
  };

  const resetChallenge = () => {
    setCurrentChallenge(null);
    setChallengeNumber(1);
    setScore(0);
    setSessionStarted(false);
    setIsCompleted(false);
    setShowMintButton(false);
  };

  if (!sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Living Internet Protocol - Human Verification
        </h1>

        <div className="bg-gray-800 p-8 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            ARC-AGI Style Pattern Challenges
          </h2>
          <p className="text-gray-300 mb-6">
            Complete 3 abstract reasoning challenges to prove you're human and mint your proof NFT.
            Each challenge shows you examples of a pattern transformation, and you must apply 
            the same pattern to solve a new problem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-blue-400 mb-2">Pattern Recognition</h3>
              <p className="text-gray-300">Study the examples to understand the transformation rule</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-pink-400 mb-2">Interactive Grid</h3>
              <p className="text-gray-300">Click cells to cycle: Black → Pink → Yellow</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold text-yellow-400 mb-2">Human Intelligence</h3>
              <p className="text-gray-300">Requires abstract reasoning that AI struggles with</p>
            </div>
          </div>

          <button
            onClick={startVerification}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                       text-white px-8 py-3 rounded-lg font-semibold text-lg
                       transition-colors"
          >
            {isLoading ? 'Starting...' : 'Start Verification'}
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Verification Complete!
        </h1>

        <div className="bg-gray-800 p-8 rounded-lg mb-8">
          <div className="text-6xl mb-4">
            {score >= 2 ? '🎉' : '😔'}
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            Final Score: {score}/3
          </h2>

          {score >= 2 ? (
            <div className="space-y-4">
              <p className="text-green-400 text-lg">
                Congratulations! You've successfully proven your humanity.
              </p>
              {showMintButton && (
                <button
                  onClick={handleMintProof}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600
                             text-white px-8 py-3 rounded-lg font-semibold text-lg
                             transition-colors"
                >
                  {isLoading ? 'Minting...' : 'Mint Proof NFT'}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-400 text-lg">
                Score too low. You need at least 2/3 correct to prove humanity.
              </p>
              <button
                onClick={resetChallenge}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="text-white">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Living Internet Protocol - Human Verification
        </h1>
        <div className="flex justify-center items-center space-x-8 text-lg">
          <span className="text-gray-300">
            Challenge {challengeNumber} of 3
          </span>
          <span className="text-gray-300">
            Score: {score}/3
          </span>
        </div>
      </div>

      <ARCChallenge
        challenge={currentChallenge}
        onSolved={handleChallengeSolved}
        onReset={() => loadChallenge(challengeNumber)}
      />

      <div className="text-center mt-8">
        <button
          onClick={resetChallenge}
          className="text-gray-400 hover:text-white underline"
        >
          Restart All Challenges
        </button>
      </div>
    </div>
  );
};