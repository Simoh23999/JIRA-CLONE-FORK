"use client";
import { useState } from "react";

interface ToastData {
  type: "success" | "error";
  message: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  return {
    toast,
    showToast,
    hideToast: () => setToast(null),
  };
};
