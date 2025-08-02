import React from "react";

interface PasswordStrengthIndicatorProps {
  strength: number;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ strength }) => {
  const getStrengthText = (strength: number) => {
    if (strength < 3) return "Faible";
    if (strength < 5) return "Moyenne";
    return "Forte";
  };

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded transition-all duration-300 ${
              strength >= level ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-[12px] text-gray-500 mt-1 block">
        Force: {getStrengthText(strength)}
      </span>
    </div>
  );
};
