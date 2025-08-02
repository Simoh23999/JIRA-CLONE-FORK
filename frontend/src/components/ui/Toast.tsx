"use client";
import React from "react";

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`flex items-center gap-2 shadow-lg rounded-lg px-4 py-3 border ${
          type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.0001 14.4C9.69748 14.4 11.3253 13.7257 12.5256 12.5255C13.7258 11.3253 14.4001 9.69739 14.4001 8.00001C14.4001 6.30262 13.7258 4.67476 12.5256 3.47452C11.3253 2.27429 9.69748 1.60001 8.0001 1.60001C6.30271 1.60001 4.67485 2.27429 3.47461 3.47452C2.27438 4.67476 1.6001 6.30262 1.6001 8.00001C1.6001 9.69739 2.27438 11.3253 3.47461 12.5255C4.67485 13.7257 6.30271 14.4 8.0001 14.4ZM10.9657 6.96561C11.1114 6.81472 11.1921 6.61264 11.1902 6.40289C11.1884 6.19313 11.1043 5.99248 10.956 5.84415C10.8076 5.69582 10.607 5.61169 10.3972 5.60987C10.1875 5.60804 9.98538 5.68868 9.8345 5.83441L7.2001 8.46881L6.1657 7.43441C6.01482 7.28868 5.81273 7.20804 5.60298 7.20987C5.39322 7.21169 5.19257 7.29582 5.04424 7.44415C4.89592 7.59248 4.81178 7.79313 4.80996 8.00289C4.80814 8.21264 4.88877 8.41472 5.0345 8.56561L6.6345 10.1656C6.78452 10.3156 6.98797 10.3998 7.2001 10.3998C7.41223 10.3998 7.61568 10.3156 7.7657 10.1656L10.9657 6.96561Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7 4a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V4Zm1 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
              fill="currentColor"
            />
          </svg>
        )}
        <span className="text-[14px] font-medium">{message}</span>
      </div>
    </div>
  );
};
