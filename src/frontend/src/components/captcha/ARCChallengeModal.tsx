import React, { useState } from "react";

type CellColor = 0 | 1 | 2; // 0 = empty (gray), 1 = yellow, 2 = purple
type Grid2x2 = CellColor[][];

interface ARCChallengeModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const cycleColor = (color: CellColor): CellColor => {
  return ((color + 1) % 3) as CellColor;
};

const createEmptyGrid = (): Grid2x2 => [
  [0, 0],
  [0, 0],
];

const generateRandomGrid = (): Grid2x2 => [
  [
    Math.floor(Math.random() * 3) as CellColor,
    Math.floor(Math.random() * 3) as CellColor,
  ],
  [
    Math.floor(Math.random() * 3) as CellColor,
    Math.floor(Math.random() * 3) as CellColor,
  ],
];

const createMirrorChallenge = () => {
  const input = generateRandomGrid();
  // Mirror horizontally: [a,b] -> [b,a]
  const solution: Grid2x2 = [
    [input[0][1], input[0][0]],
    [input[1][1], input[1][0]],
  ];
  return { input, solution };
};

const gridsEqual = (grid1: Grid2x2, grid2: Grid2x2): boolean => {
  return grid1.every((row, i) => row.every((cell, j) => cell === grid2[i][j]));
};

const getCellColor = (color: CellColor): string => {
  switch (color) {
    case 0:
      return "bg-gray-300 border-gray-400"; // empty
    case 1:
      return "bg-yellow-400 border-yellow-500"; // yellow
    case 2:
      return "bg-purple-500 border-purple-600"; // purple
    default:
      return "bg-gray-300 border-gray-400";
  }
};

const GridComponent: React.FC<{
  grid: Grid2x2;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
}> = ({ grid, onCellClick, interactive = false }) => (
  <div className="grid h-24 w-24 grid-cols-2 gap-1">
    {grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={` ${getCellColor(cell)} cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-md ${interactive ? "hover:opacity-80" : ""} `}
          onClick={() => interactive && onCellClick?.(rowIndex, colIndex)}
        />
      )),
    )}
  </div>
);

export const ARCChallengeModal: React.FC<ARCChallengeModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [challenge] = useState(() => createMirrorChallenge());
  const [userGrid, setUserGrid] = useState<Grid2x2>(createEmptyGrid());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    if (isSubmitted) return;

    const newGrid = userGrid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? cycleColor(cell) : cell,
      ),
    ) as Grid2x2;

    setUserGrid(newGrid);
    setShowError(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const isCorrect = gridsEqual(userGrid, challenge.solution);

    if (isCorrect) {
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setShowError(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowError(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setUserGrid(createEmptyGrid());
    setIsSubmitted(false);
    setShowError(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 max-h-[95vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">🧩</div>
          <h2 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
            ARC-AGI Challenge
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Mirror the pattern horizontally
          </p>
        </div>

        {/* Example */}
        <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-900/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-blue-300">Example:</h3>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="mb-2 text-xs text-gray-400">Input</div>
              <GridComponent
                grid={[
                  [1, 2],
                  [0, 1],
                ]}
              />
            </div>
            <div className="text-2xl text-blue-400">→</div>
            <div className="text-center">
              <div className="mb-2 text-xs text-gray-400">Output</div>
              <GridComponent
                grid={[
                  [2, 1],
                  [1, 0],
                ]}
              />
            </div>
          </div>
        </div>

        {/* Challenge */}
        <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple-900/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-purple-300">
            Your Challenge:
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="mb-2 text-xs text-gray-400">Input</div>
              <GridComponent grid={challenge.input} />
            </div>
            <div className="text-2xl text-purple-400">→</div>
            <div className="text-center">
              <div className="mb-2 text-xs text-gray-400">Your Answer</div>
              <GridComponent
                grid={userGrid}
                onCellClick={handleCellClick}
                interactive={!isSubmitted}
              />
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">
              Click cells to cycle: Empty → Yellow → Purple → Empty
            </p>
          </div>
        </div>

        {/* Error Message */}
        {showError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-center">
            <p className="text-sm text-red-300">Not quite right. Try again!</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-gray-300 transition-colors hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className={`flex-1 rounded-lg px-4 py-3 font-semibold transition-all ${
              isSubmitted
                ? "cursor-not-allowed bg-gray-600 text-gray-400"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            }`}
          >
            {isSubmitted ? "Checking..." : "Submit"}
          </button>
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
