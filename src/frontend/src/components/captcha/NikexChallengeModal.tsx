import React, { useState, useRef, useEffect } from "react";

interface NikexChallengeModalProps {
  isOpen: boolean;
  onSuccess: (designImage?: string | null, hasDesign?: boolean) => void;
  onClose: () => void;
}

export const NikexChallengeModal: React.FC<NikexChallengeModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [paths, setPaths] = useState<Array<{ x: number; y: number }[]>>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    [],
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Challenge end date - January 31, 2025
  const challengeEndDate = new Date("2025-01-31T23:59:59");

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#8b5cf6"; // Purple theme for Nikex
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }

    // Reset state when modal opens
    if (isOpen) {
      setIsSubmitted(false);
      setShowError(false);
      setPaths([]);
      setCurrentPath([]);
    }

    // Cleanup when modal closes
    if (!isOpen) {
      setUploadedImage(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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

  const detectCircleOrDrawing = (): boolean => {
    if (paths.length === 0) return false;

    // Check if there's sufficient drawing activity
    const allPoints = paths.flat();
    if (allPoints.length < 15) return false; // Minimum drawing requirement

    // Simple circle detection - check if any path forms a roughly circular shape
    for (const path of paths) {
      if (path.length < 10) continue;

      const isCircular = checkIfCircular(path);
      if (isCircular) return true;
    }

    // If not circular, check if there's enough free drawing
    return allPoints.length >= 30; // Sufficient free drawing to gate bots
  };

  const checkIfCircular = (path: { x: number; y: number }[]): boolean => {
    if (path.length < 10) return false;

    // Find center point
    const centerX = path.reduce((sum, p) => sum + p.x, 0) / path.length;
    const centerY = path.reduce((sum, p) => sum + p.y, 0) / path.length;

    // Calculate distances from center
    const distances = path.map((p) =>
      Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2)),
    );

    // Check if distances are roughly consistent (circular)
    const avgDistance =
      distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const variance =
      distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) /
      distances.length;
    const tolerance = avgDistance * 0.3; // 30% tolerance

    // Check if start and end points are close (closed shape)
    const startEnd = Math.sqrt(
      Math.pow(path[0].x - path[path.length - 1].x, 2) +
        Math.pow(path[0].y - path[path.length - 1].y, 2),
    );

    return variance < tolerance * tolerance && startEnd < avgDistance * 0.5;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setShowError(true);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setShowError(true);
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setShowError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    const hasValidDrawing = detectCircleOrDrawing();
    const hasImage = uploadedImage !== null;

    if (hasValidDrawing) {
      setTimeout(() => {
        onSuccess(uploadedImage, hasImage);
      }, 500);
    } else {
      setShowError(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowError(false);
      }, 2000);
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

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatEndDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canSubmit = detectCircleOrDrawing() && !isSubmitted;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">👟</div>
          <h2 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
            Nikex Brand Challenge
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Design your dream sneaker and win $1000 + exclusive access!
          </p>
        </div>

        {/* Challenge Details */}
        <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple-900/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-sm font-semibold text-purple-300">
                🏆 Challenge Details
              </h3>
              <p className="text-xs text-gray-300">
                Your design will be reviewed by Nikex judges
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Challenge ends:</div>
              <div className="text-sm font-semibold text-purple-300">
                {formatEndDate(challengeEndDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {/* Bot Gate Drawing */}
          <div className="rounded-lg border border-purple-500/30 bg-purple-900/20 p-4">
            <h3 className="mb-3 text-sm font-semibold text-purple-300">
              🤖 Prove You're Human
            </h3>
            <div className="mb-3 flex justify-center">
              <canvas
                ref={canvasRef}
                width={280}
                height={200}
                className="cursor-crosshair rounded-lg border-2 border-gray-300 bg-gray-100"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-gray-400">
                Draw a circle or sketch freely to verify you're human
              </p>
              <button
                onClick={handleClear}
                className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-600"
              >
                Clear Drawing
              </button>
            </div>
          </div>

          {/* Design Upload */}
          <div className="rounded-lg border border-purple-500/30 bg-purple-900/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-purple-300">
                🎨 Upload Your Design
              </h3>
              <span className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300">
                Optional
              </span>
            </div>

            {!uploadedImage ? (
              <div className="rounded-lg border-2 border-dashed border-purple-400/50 p-6 text-center">
                <div className="mb-2 text-4xl">📁</div>
                <p className="mb-2 text-sm text-gray-300">
                  Upload your sneaker design
                </p>
                <p className="mb-3 text-xs text-purple-300">
                  📈 Your design becomes an NFT - earn from every sale!
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700"
                >
                  Choose Image
                </button>
                <p className="mt-2 text-xs text-gray-400">
                  Max 5MB • JPG, PNG, GIF
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded design"
                  className="h-48 w-full rounded-lg border border-purple-400/30 object-cover"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white transition-colors hover:bg-red-700"
                >
                  ✕
                </button>
                <div className="mt-2 text-center">
                  <p className="text-xs text-green-400">
                    ✓ Design uploaded successfully
                  </p>
                  <p className="text-xs text-purple-300">
                    🎨 Will become an NFT with royalties!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {showError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-center">
            <p className="text-sm text-red-300">
              {!detectCircleOrDrawing()
                ? "Please draw something to prove you're human!"
                : "Invalid file. Please upload an image under 5MB."}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`rounded-lg px-8 py-3 font-semibold transition-all ${
              canSubmit
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:from-purple-600 hover:to-pink-600"
                : "cursor-not-allowed bg-gray-600 text-gray-400"
            }`}
          >
            {isSubmitted
              ? "Submitting..."
              : uploadedImage
                ? "Submit Design to Contest"
                : "Submit Entry to Contest"}
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
