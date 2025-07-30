"use client";
import React from "react";
import { CircleCheckBig } from "lucide-react";

interface AutoSaveIndicatorProps {
  status: "idle" | "saving" | "saved";
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  status,
}) => {
  if (status === "idle") return null;

  return (
    <div className="fixed top-4 right-4 z-40">
      {status === "saving" && (
        <div className="flex items-center gap-2 bg-white shadow-lg rounded-lg px-4 py-2 border animate-slide-in">
          <svg
            className="animate-spin w-4 h-4 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.25"
            />
            <path
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          <span className="text-[14px] font-medium text-gray-700">
            Sauvegarde...
          </span>
        </div>
      )}
      {status === "saved" && (
        <div className="flex items-center gap-2 bg-emerald-50 shadow-lg rounded-lg px-4 py-2 border border-emerald-200 animate-slide-in">
          <CircleCheckBig className="text-[#059669]" />
          <span className="text-[14px] font-medium text-emerald-700">
            Sauvegardé
          </span>
        </div>
      )}
    </div>
  );
};
