import React, { useState, useEffect } from 'react';
import { backendService } from '../services/backendService';
import { Loader } from '../components';

interface GridCell {
  color: string;
}

interface Challenge {
  id: string;
  grid: GridCell[][];
  options: GridCell[][][];
  challenge_type: string;
}

interface HumanVerificationViewProps {
  mode?: 'initial' | 'refresh';
  onComplete?: (success: boolean) => void;
}

export const HumanVerificationView: React.FC<HumanVerificationViewProps> = ({ 
  mode = 'initial', 
  onComplete 
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeNumber, setChallengeNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMintButton, setShowMintButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredChallenges = mode === 'refresh' ? 1 : 3;

  const startVerification = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await backendService.start_session();
      if ('Ok' in result) {
        loadChallenge(1);
      } else {
        setError(result.Err);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      setError('Failed to start session. Please try again.');
    }
    setIsLoading(false);
  };

  const loadChallenge = async (num: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await backendService.get_challenge(num);
      if ('Ok' in result) {
        setCurrentChallenge(result.Ok);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setError(result.Err);
      }
    } catch (error) {
      console.error('Failed to load challenge:', error);
      setError('Failed to load challenge. Please try again.');
    }
    setIsLoading(false);
  };

  const submitAnswer = async (answerIndex: number) => {
    if (!currentChallenge || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setIsLoading(true);
    
    try {
      const result = await backendService.verify_answer(currentChallenge.id, answerIndex);
      
      if ('Ok' in result && result.Ok) {
        setScore(score + 1);
      }
      
      setShowResult(true);
      
      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (challengeNumber < requiredChallenges) {
          setChallengeNumber(challengeNumber + 1);
          loadChallenge(challengeNumber + 1);
        } else {
          // Show final results
          handleCompletion();
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to verify answer:', error);
      setError('Failed to verify answer. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCompletion = async () => {
    if (score >= requiredChallenges) {
      if (mode === 'refresh') {
        // For refresh mode, call refresh_token
        try {
          await backendService.refresh_token();
          if (onComplete) onComplete(true);
        } catch (error) {
          console.error('Failed to refresh token:', error);
          if (onComplete) onComplete(false);
        }
      } else {
        // Show mint button for initial verification
        setShowMintButton(true);
      }
    } else {
      // Failed challenges
      if (onComplete) onComplete(false);
    }
  };

  const mintProof = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await backendService.mint_proof();
      if ('Ok' in result) {
        alert(result.Ok);
        // Reset state
        setCurrentChallenge(null);
        setShowMintButton(false);
        setChallengeNumber(1);
        setScore(0);
      } else {
        setError(result.Err);
      }
    } catch (error) {
      console.error('Failed to mint proof:', error);
      setError('Failed to mint proof. Please try again.');
    }
    setIsLoading(false);
  };

  const renderGrid = (grid: GridCell[][]) => {
    const colorMap: { [key: string]: string } = {
      'R': 'bg-red-500',
      'B': 'bg-blue-500',
      'G': 'bg-green-500',
      'Y': 'bg-yellow-500',
    };

    return (
      <div className="grid grid-cols-2 gap-1 w-24 h-24">
        {grid.map((row, i) => 
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`${colorMap[cell.color]} rounded`}
            />
          ))
        )}
      </div>
    );
  };

  const getCorrectAnswerIndex = () => {
    // For MVP, we're using hardcoded correct answers based on challenge type
    if (!currentChallenge) return -1;
    switch (currentChallenge.challenge_type) {
      case 'rotation': return 0;
      case 'sequence': return 1;
      case 'transformation': return 2;
      default: return -1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {mode === 'initial' && (
        <h1 className="text-3xl font-bold mb-8 text-center">
          Living Internet Protocol - Human Verification
        </h1>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg mb-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!currentChallenge && !showMintButton ? (
        <div className="text-center">
          <p className="mb-6">
            Complete {requiredChallenges} pattern challenge{requiredChallenges > 1 ? 's' : ''} to {mode === 'refresh' ? 'refresh your verification' : "prove you're human and mint your proof NFT"}.
          </p>
          <button
            onClick={startVerification}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            Start Verification
          </button>
        </div>
      ) : showMintButton ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
          <p className="mb-4">You've successfully completed all challenges!</p>
          <p className="mb-6">Score: {score}/{requiredChallenges}</p>
          <button
            onClick={mintProof}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            Mint Your Proof NFT
          </button>
        </div>
      ) : currentChallenge && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-2">Challenge {challengeNumber} of {requiredChallenges}</p>
            <p className="text-sm text-gray-400">Score: {score}/{requiredChallenges}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg">
            <p className="mb-4 text-center">
              Find the pattern and select the correct answer:
            </p>
            
            <div className="flex justify-center mb-8">
              {renderGrid(currentChallenge.grid)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentChallenge.options.map((option, index) => {
                const correctIndex = getCorrectAnswerIndex();
                const isCorrect = index === correctIndex;
                
                return (
                  <button
                    key={index}
                    onClick={() => submitAnswer(index)}
                    disabled={selectedAnswer !== null || isLoading}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? showResult
                          ? isCorrect
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-red-500 bg-red-500/20'
                          : 'border-blue-500'
                        : 'border-gray-600 hover:border-gray-400'
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex justify-center">
                      {renderGrid(option)}
                    </div>
                    <p className="mt-2 text-center">Option {String.fromCharCode(65 + index)}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {showResult && (
            <div className="text-center">
              <p className={`text-lg ${selectedAnswer === getCorrectAnswerIndex() ? 'text-green-500' : 'text-red-500'}`}>
                {selectedAnswer === getCorrectAnswerIndex() ? '✓ Correct!' : '✗ Incorrect'}
              </p>
            </div>
          )}
        </div>
      )}

      {isLoading && <Loader />}
    </div>
  );
};