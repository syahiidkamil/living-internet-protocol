import React from "react";
import { HumanityToken } from "../services/backendService";

interface Props {
  token: HumanityToken | null;
}

export const TokenStatusBadge: React.FC<Props> = ({ token }) => {
  const getTimeRemaining = () => {
    if (!token) return null;

    const now = Date.now() * 1_000_000; // Convert to nanoseconds
    const remaining = Number(token.expires_at) - now;

    if (remaining <= 0) return "Expired";

    const hours = Math.floor(remaining / (1_000_000_000 * 60 * 60));
    const minutes = Math.floor(
      (remaining % (1_000_000_000 * 60 * 60)) / (1_000_000_000 * 60),
    );

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const timeRemaining = getTimeRemaining();
  const isValid = token && timeRemaining !== "Expired";

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
        isValid
          ? "border border-green-500/30 bg-green-500/20 text-green-400"
          : "border border-red-500/30 bg-red-500/20 text-red-400"
      }`}
    >
      <div
        className={`h-2 w-2 rounded-full ${isValid ? "bg-green-500" : "bg-red-500"}`}
      />
      <span>
        {!token
          ? "Not Verified"
          : isValid
            ? `Verified (${timeRemaining})`
            : "Token Expired"}
      </span>
    </div>
  );
};
