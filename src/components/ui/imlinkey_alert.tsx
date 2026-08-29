"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ImlinkeyAlertProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number; // em ms
  onClose?: () => void;
}

export function ImlinkeyAlert({
  message,
  type = "info",
  duration = 4000,
  onClose,
}: ImlinkeyAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => handleClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const typeColors = {
    info: "border-sky-400 text-sky-500",
    success: "border-emerald-400 text-emerald-500",
    warning: "border-yellow-400 text-yellow-500",
    error: "border-red-400 text-red-500",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur de fundo */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card do alerta */}
      <div
        className={`relative flex items-center justify-between gap-4 p-6 rounded-xl border shadow-lg bg-background ${typeColors[type]}`}
      >
        <span className="text-sm font-medium break-words w-full max-w-[90vw] sm:max-w-md md:max-w-lg leading-relaxed">{message}</span>
        <button onClick={handleClose} className="p-1 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}