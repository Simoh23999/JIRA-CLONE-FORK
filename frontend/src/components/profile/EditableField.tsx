"use client";
import React, { useState } from "react";
import { SquarePen, Check, X } from "lucide-react";

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  onCancel?: () => void;
  validationError?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  renderContent?: (value: string) => React.ReactNode;
  // renderEditButton?: () => React.ReactNode;
  renderEditButton?: (onClick: () => void) => React.ReactNode;

  multiline?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  onCancel,
  validationError,
  placeholder,
  className = "",
  inputClassName = "",
  renderContent,
  renderEditButton,
  multiline = false,
  maxLength,
  showCharacterCount = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    setCurrentValue(value); // S'assurer que la valeur est synchronisée
    setIsEditing(true);
  };
  const handleSave = async () => {
    await onSave(currentValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isEditing ? (
        <div className="flex items-center max-sm:flex-col max-sm:items-center gap-3 max-sm:gap-2">
          {renderContent ? (
            renderContent(value)
          ) : (
            <span className={inputClassName}>{value}</span>
          )}
          {isHovered &&
            (renderEditButton ? (
              renderEditButton(handleEdit)
            ) : (
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 animate-fade-in hover:cursor-pointer"
                aria-label="Edit field"
              >
                <SquarePen size={18} />
              </button>
            ))}
        </div>
      ) : (
        <div className="flex items-start gap-2 w-full max-sm:flex-col max-sm:gap-3">
          <div className="flex-1">
            {multiline ? (
              <textarea
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className={`w-full resize-none bg-transparent border-0 border-b-2 px-0 py-2 focus:outline-none focus:ring-0 transition-all duration-200 ${
                  validationError
                    ? "border-red-500 focus:border-red-500"
                    : "border-emerald-500 focus:border-emerald-600"
                } ${inputClassName}`}
                placeholder={placeholder}
                maxLength={maxLength}
                autoFocus
                onKeyDown={handleKeyDown}
              />
            ) : (
              <input
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className={`bg-transparent border-0 border-b-2 px-0 py-1 focus:outline-none focus:ring-0 flex-1 max-sm:w-full transition-all duration-200 ${
                  validationError
                    ? "border-red-500 focus:border-red-500"
                    : "border-emerald-500 focus:border-emerald-600"
                } ${inputClassName}`}
                placeholder={placeholder}
                maxLength={maxLength}
                autoFocus
                onKeyDown={handleKeyDown}
              />
            )}
            {showCharacterCount && maxLength && (
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-[12px] ${
                    currentValue.length > maxLength
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {currentValue.length}/{maxLength} caractères
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {validationError && (
        <p className="text-red-500 text-sm mt-1 animate-slide-down">
          {validationError}
        </p>
      )}
    </div>
  );
};
