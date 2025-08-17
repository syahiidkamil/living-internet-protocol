import React, { useState } from "react";
import {
  ARCGrid,
  Grid2x2,
  CellColor,
  cycleColor,
  createEmptyGrid,
  gridsEqual,
} from "../common/ARCGrid";

export interface ARCChallengeData {
  id: string;
  examples: Array<{
    input: Grid2x2;
    output: Grid2x2;
  }>;
  testInput: Grid2x2;
  solution: Grid2x2;
  patternType: string;
}

interface ARCChallengeProps {
  challenge: ARCChallengeData;
  onSolved: (correct: boolean) => void;
  onReset?: () => void;
}

export const ARCChallenge: React.FC<ARCChallengeProps> = ({
  challenge,
  onSolved,
  onReset,
}) => {
  const [userGrid, setUserGrid] = useState<Grid2x2>(createEmptyGrid());
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleCellClick = (row: number, col: number) => {
    if (showResult) return;

    const newGrid: Grid2x2 = {
      cells: userGrid.cells.map((gridRow, rowIndex) =>
        gridRow.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? cycleColor(cell) : cell,
        ),
      ),
    };

    setUserGrid(newGrid);
  };

  const handleSubmit = () => {
    const correct = gridsEqual(userGrid, challenge.solution);
    setIsCorrect(correct);
    setShowResult(true);
    setAttempts((prev) => prev + 1);
    onSolved(correct);
  };

  const handleReset = () => {
    setUserGrid(createEmptyGrid());
    setShowResult(false);
    setAttempts(0);
    if (onReset) {
      onReset();
    }
  };

  const hasUserInput = userGrid.cells.some((row) =>
    row.some((cell) => cell !== "black"),
  );

  return (
    <div className="space-y-8 rounded-lg bg-gray-800 p-6">
      {/* Instructions */}
      <div className="text-center">
        <h3 className="mb-2 text-xl font-bold text-white">
          Pattern Recognition Challenge
        </h3>
        <p className="text-sm text-gray-300">
          Study the examples, then create the correct output pattern.
          <br />
          Click cells to cycle: Black → Pink → Yellow → Black
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h4 className="text-center text-lg font-semibold text-white">
          Examples:
        </h4>

        <div className="flex flex-wrap justify-center gap-8">
          {challenge.examples.map((example, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-400">
                  Input {index + 1}
                </div>
                <ARCGrid grid={example.input} readonly size="small" />
              </div>

              <div className="text-2xl text-gray-400">→</div>

              <div className="text-center">
                <div className="mb-2 text-sm text-gray-400">
                  Output {index + 1}
                </div>
                <ARCGrid grid={example.output} readonly size="small" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge */}
      <div className="border-t border-gray-600 pt-6">
        <h4 className="mb-4 text-center text-lg font-semibold text-white">
          Your Turn:
        </h4>

        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <div className="mb-2 text-sm text-gray-400">Input</div>
            <ARCGrid grid={challenge.testInput} readonly size="medium" />
          </div>

          <div className="text-3xl text-gray-400">→</div>

          <div className="text-center">
            <div className="mb-2 text-sm text-gray-400">Your Output</div>
            <ARCGrid
              grid={userGrid}
              onCellClick={handleCellClick}
              size="medium"
              className={
                showResult
                  ? isCorrect
                    ? "ring-2 ring-green-500"
                    : "ring-2 ring-red-500"
                  : ""
              }
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleReset}
          className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-500"
        >
          Reset
        </button>

        <button
          onClick={handleSubmit}
          disabled={!hasUserInput || showResult}
          className="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          Submit Answer
        </button>
      </div>

      {/* Result */}
      {showResult && (
        <div
          className={`rounded-lg p-4 text-center ${
            isCorrect
              ? "bg-green-900/50 text-green-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          <div className="text-lg font-semibold">
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </div>
          {!isCorrect && attempts < 3 && (
            <div className="mt-2 text-sm">
              Try again! Look carefully at how the examples transform.
            </div>
          )}
          {attempts >= 3 && !isCorrect && (
            <div className="mt-2 text-sm">
              This challenge requires understanding the pattern. Study the
              examples more closely.
            </div>
          )}
        </div>
      )}

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <details className="text-xs text-gray-500">
          <summary>Debug Info</summary>
          <div className="mt-2">
            <div>Pattern Type: {challenge.patternType}</div>
            <div>Attempts: {attempts}</div>
            <div>
              Expected Solution: {JSON.stringify(challenge.solution.cells)}
            </div>
            <div>User Input: {JSON.stringify(userGrid.cells)}</div>
          </div>
        </details>
      )}
    </div>
  );
};
