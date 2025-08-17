import React from 'react';

export type CellColor = 'black' | 'pink' | 'yellow';

export interface Grid2x2 {
  cells: CellColor[][];
}

interface GridCellProps {
  color: CellColor;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({ 
  color, 
  onClick, 
  size = 'medium',
  readonly = false 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const colorClasses = {
    black: 'bg-gray-900',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-400'
  };

  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} 
    border-2 border-gray-600 transition-all duration-200`;

  const interactiveClasses = readonly 
    ? ''
    : 'hover:border-white cursor-pointer hover:scale-105 active:scale-95';

  return (
    <button
      onClick={onClick}
      disabled={readonly}
      className={`${baseClasses} ${interactiveClasses}`}
      type="button"
    />
  );
};

interface ARCGridProps {
  grid: Grid2x2;
  onCellClick?: (row: number, col: number) => void;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  className?: string;
}

export const ARCGrid: React.FC<ARCGridProps> = ({
  grid,
  onCellClick,
  size = 'medium',
  readonly = false,
  className = ''
}) => {
  const handleCellClick = (row: number, col: number) => {
    if (!readonly && onCellClick) {
      onCellClick(row, col);
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-1 ${className}`}>
      {grid.cells.map((row, rowIndex) =>
        row.map((cellColor, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            color={cellColor}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            size={size}
            readonly={readonly}
          />
        ))
      )}
    </div>
  );
};

// Utility function to cycle colors
export const cycleColor = (current: CellColor): CellColor => {
  switch (current) {
    case 'black': return 'pink';
    case 'pink': return 'yellow';
    case 'yellow': return 'black';
    default: return 'black';
  }
};

// Utility function to create empty grid
export const createEmptyGrid = (): Grid2x2 => ({
  cells: [
    ['black', 'black'],
    ['black', 'black']
  ]
});

// Utility function to compare grids
export const gridsEqual = (grid1: Grid2x2, grid2: Grid2x2): boolean => {
  return grid1.cells.every((row, rowIndex) =>
    row.every((cell, colIndex) => 
      cell === grid2.cells[rowIndex][colIndex]
    )
  );
};