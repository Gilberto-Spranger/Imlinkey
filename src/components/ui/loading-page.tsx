"use client";

import { useEffect, useState } from "react";
import { Link, CloudOff, WifiOff } from "lucide-react";

interface Connection extends Navigator {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
}

const LoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    const nav = navigator as Connection;
    if (nav.connection) {
      const { saveData, effectiveType } = nav.connection;
      if (
        saveData ||
        effectiveType?.includes("2g") ||
        effectiveType?.includes("slow-2g")
      ) {
        setIsSlowNetwork(true);
      }
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020617] text-white">

      {/* Container */}
      <div className="flex flex-col items-center gap-6">

        {/* Ícone dinâmico */}
        <div className="relative flex items-center justify-center">

          {/* Glow effect */}
          <div className="absolute w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>

          {isOffline ? (
            <CloudOff size={120} className="text-red-500 animate-pulse" />
          ) : isSlowNetwork ? (
            <WifiOff size={120} className="text-yellow-400 animate-pulse" />
          ) : (
            <Link
              size={130}
              strokeWidth={2.8}
              className="transform -rotate-45 text-white animate-[spin_6s_linear_infinite]"
            />
          )}
        </div>

        {/* Texto */}
        <h1 className="text-[72px] font-bold tracking-tight leading-none">
          Imlinkey
        </h1>

        {/* Status */}
        <div className="h-6">
          {isOffline && (
            <p className="text-red-400 font-medium">
              Você está offline
            </p>
          )}

          {isSlowNetwork && !isOffline && (
            <p className="text-yellow-400 font-medium">
              Conexão lenta detectada...
            </p>
          )}
        </div>

        {/* Loading bar premium */}
        {!isOffline && (
          <div className="w-48 h-[3px] bg-white/10 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-white animate-[loading_1.5s_ease-in-out_infinite]"></div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; opacity: 0.3; }
          50% { width: 100%; opacity: 1; }
          100% { width: 0%; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;