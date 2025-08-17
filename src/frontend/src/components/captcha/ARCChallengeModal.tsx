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
  [Math.floor(Math.random() * 3) as CellColor, Math.floor(Math.random() * 3) as CellColor],
  [Math.floor(Math.random() * 3) as CellColor, Math.floor(Math.random() * 3) as CellColor],
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
  return grid1.every((row, i) => 
    row.every((cell, j) => cell === grid2[i][j])
  );
};

const getCellColor = (color: CellColor): string => {
  switch (color) {
    case 0: return "bg-gray-300 border-gray-400"; // empty
    case 1: return "bg-yellow-400 border-yellow-500"; // yellow
    case 2: return "bg-purple-500 border-purple-600"; // purple
    default: return "bg-gray-300 border-gray-400";
  }
};

const GridComponent: React.FC<{ 
  grid: Grid2x2; 
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
}> = ({ grid, onCellClick, interactive = false }) => (
  <div className="grid grid-cols-2 gap-1 w-24 h-24">
    {grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={`
            ${getCellColor(cell)} 
            border-2 rounded-lg cursor-pointer 
            transition-all duration-200 
            hover:scale-110 hover:shadow-md
            ${interactive ? 'hover:opacity-80' : ''}
          `}
          onClick={() => interactive && onCellClick?.(rowIndex, colIndex)}
        />
      ))
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
        rowIndex === row && colIndex === col ? cycleColor(cell) : cell
      )
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
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🧩</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ARC-AGI Challenge
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            Mirror the pattern horizontally
          </p>
        </div>

        {/* Example */}
        <div className="mb-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <h3 className="text-sm font-semibold text-blue-300 mb-3">Example:</h3>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">Input</div>
              <GridComponent grid={[[1, 2], [0, 1]]} />
            </div>
            <div className="text-2xl text-blue-400">→</div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">Output</div>
              <GridComponent grid={[[2, 1], [1, 0]]} />
            </div>
          </div>
        </div>

        {/* Challenge */}
        <div className="mb-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
          <h3 className="text-sm font-semibold text-purple-300 mb-3">Your Challenge:</h3>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">Input</div>
              <GridComponent grid={challenge.input} />
            </div>
            <div className="text-2xl text-purple-400">→</div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">Your Answer</div>
              <GridComponent 
                grid={userGrid} 
                onCellClick={handleCellClick}
                interactive={!isSubmitted}
              />
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-400">
              Click cells to cycle: Empty → Yellow → Purple → Empty
            </p>
          </div>
        </div>

        {/* Error Message */}
        {showError && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
            <p className="text-red-300 text-sm">Not quite right. Try again!</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              isSubmitted
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            }`}
          >
            {isSubmitted ? "Checking..." : "Submit"}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};