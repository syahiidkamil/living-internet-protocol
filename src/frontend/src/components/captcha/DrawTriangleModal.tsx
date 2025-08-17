import React, { useState, useRef, useEffect } from "react";

interface DrawTriangleModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const DrawTriangleModal: React.FC<DrawTriangleModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [paths, setPaths] = useState<Array<{ x: number; y: number }[]>>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    [],
  );

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [isOpen]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSubmitted) return;

    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setCurrentPath([coords]);
    setShowError(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isSubmitted) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coords = getCanvasCoordinates(e);
    const newPath = [...currentPath, coords];
    setCurrentPath(newPath);

    // Draw the line
    ctx.beginPath();
    if (currentPath.length > 0) {
      ctx.moveTo(
        currentPath[currentPath.length - 1].x,
        currentPath[currentPath.length - 1].y,
      );
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    if (currentPath.length > 1) {
      setPaths((prev) => [...prev, currentPath]);
    }
    setCurrentPath([]);
  };

  const detectTriangle = (): boolean => {
    // Simple triangle detection - look for 3 main path segments that form a closed shape
    if (paths.length === 0) return false;

    // Combine all paths
    const allPoints = paths.flat();
    if (allPoints.length < 10) return false; // Too few points

    // Find potential vertices (points where direction changes significantly)
    const vertices: { x: number; y: number }[] = [];

    // Add first point
    if (allPoints.length > 0) vertices.push(allPoints[0]);

    // Find direction changes
    for (let i = 5; i < allPoints.length - 5; i += 5) {
      const prev = allPoints[i - 5];
      const curr = allPoints[i];
      const next = allPoints[i + 5];

      // Calculate angles
      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
      const angleDiff = Math.abs(angle1 - angle2);

      // If significant direction change, this might be a vertex
      if (angleDiff > Math.PI / 4 && angleDiff < (3 * Math.PI) / 4) {
        vertices.push(curr);
      }
    }

    // Add last point
    if (allPoints.length > 0) vertices.push(allPoints[allPoints.length - 1]);

    // Check if we have approximately 3 vertices (triangle)
    if (vertices.length >= 3 && vertices.length <= 6) {
      // Check if the shape is roughly closed
      const first = vertices[0];
      const last = vertices[vertices.length - 1];
      const distance = Math.sqrt(
        Math.pow(first.x - last.x, 2) + Math.pow(first.y - last.y, 2),
      );

      // If start and end are close enough, it's likely a closed triangle
      return distance < 50;
    }

    return false;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const isTriangle = detectTriangle();

    if (isTriangle) {
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

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setPaths([]);
    setCurrentPath([]);
    setIsSubmitted(false);
    setShowError(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 max-h-[95vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">📐</div>
          <h2 className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
            Draw a Triangle
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Draw a triangle shape to prove you're human
          </p>
        </div>

        {/* Example */}
        <div className="mb-6 rounded-lg border border-pink-500/30 bg-pink-900/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-pink-300">Example:</h3>
          <div className="flex justify-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-pink-400"
            >
              <path
                d="M40 15 L65 60 L15 60 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple-900/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-purple-300">
            Draw here:
          </h3>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={240}
              height={180}
              className="cursor-crosshair rounded-lg border-2 border-gray-300 bg-gray-100"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">
              Click and drag to draw a triangle shape
            </p>
          </div>
        </div>

        {/* Error Message */}
        {showError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-center">
            <p className="text-sm text-red-300">
              That doesn't look like a triangle. Try drawing three connected
              lines that form a closed shape!
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-gray-300 transition-colors hover:bg-gray-600"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitted || paths.length === 0}
            className={`flex-1 rounded-lg px-4 py-3 font-semibold transition-all ${
              isSubmitted || paths.length === 0
                ? "cursor-not-allowed bg-gray-600 text-gray-400"
                : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
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
