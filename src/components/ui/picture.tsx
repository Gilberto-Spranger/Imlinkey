"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { Camera, Image as ImageIcon, X, Pencil } from "lucide-react";

interface PictureProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  size?: number;
  status?: "online" | "offline" | null;
  isEditable?: boolean;
  shape?: "circle" | "rounded" | "square";
  pingColor?: "green" | "gray" | "purple" | "white" | "gold";
  userId?: string; // 🔥 agora é ID real (backend)
}

type WSMessage = {
  user_id: string;
  status: "online" | "offline";
};

function useRealtimeStatus(userId?: string) {
  const [status, setStatus] = useState<"online" | "offline">("offline");

  const wsRef = useRef<WebSocket | null>(null);
  const pingRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    if (!userId) return;

    const token = localStorage.getItem("token") || "";
    const ws = new WebSocket(
      `wss://api.imlinkey.store/ws/status/?token=${token}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("online");

      pingRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 10000);
    };

    ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);

        if (data.user_id === userId) {
          setStatus(data.status);
        }
      } catch {}
    };

    ws.onclose = () => {
      setStatus("offline");

      if (pingRef.current) clearInterval(pingRef.current);

      reconnectRef.current = setTimeout(() => {
        connect();
      }, 4000);
    };
  };

  useEffect(() => {
    if (!userId) return;

    connect();

    return () => {
      if (pingRef.current) clearInterval(pingRef.current);
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [userId]);

  return status;
}

export function Picture({
  value,
  onChange,
  size = 120,
  status: propStatus = null,
  isEditable = false,
  shape = "circle",
  pingColor = "green",
  userId,
}: PictureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const realtimeStatus = useRealtimeStatus(userId);
  const status = propStatus ?? realtimeStatus;

  useEffect(() => {
    if (!value) return setPreview(null);

    if (typeof value === "string") {
      setPreview(value);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const shapeStyle: CSSProperties =
    shape === "circle"
      ? { borderRadius: "50%" }
      : shape === "rounded"
      ? { borderRadius: "1rem" }
      : { borderRadius: "0" };

  const pingColors: Record<string, string> = {
    green: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    gray: "bg-gray-500",
    purple: "bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]",
    white: "bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]",
    gold: "bg-yellow-500 shadow-[0_0_8px_rgba(218,165,32,0.6)]",
  };

  return (
    <div className="relative inline-block">
      <div
        className={`relative border-4 border-white/10 overflow-hidden shadow-2xl transition-all ${
          isEditable ? "cursor-pointer hover:border-sky-500/50 group" : ""
        }`}
        style={{ width: size, height: size, ...shapeStyle }}
        onClick={() => isEditable && setShowDialog(true)}
      >
        <Image
          src={preview || "/icons/profile.svg"}
          alt="Avatar"
          fill
          className="object-cover"
        />

        {isEditable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="text-white w-6 h-6" />
          </div>
        )}
      </div>

      {/* STATUS */}
      {status && (
        <div
          className="absolute z-10"
          style={{ bottom: size * 0.05, left: size * 0.05 }}
        >
          <div className="relative flex items-center justify-center">
            {status === "online" && (
              <span
                className={`absolute h-full w-full rounded-full opacity-70 animate-ping ${pingColors[pingColor]}`}
              />
            )}

            <span
              className={`relative rounded-full border-2 border-[#020617] ${pingColors[pingColor]}`}
              style={{ width: size * 0.12, height: size * 0.12 }}
            />
          </div>
        </div>
      )}

      {/* MODAL */}
      {isEditable && showDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-[2rem] p-6 w-full max-w-xs">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold">Trocar foto</h3>
              <button onClick={() => setShowDialog(false)}>
                <X size={20} className="text-white/40" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                className="w-full bg-white/5 hover:bg-sky-500/20 text-white p-4 rounded-2xl flex items-center gap-3"
                onClick={() => {
                  cameraInputRef.current?.click();
                  setShowDialog(false);
                }}
              >
                <Camera size={20} className="text-sky-400" />
                Câmera
              </button>

              <button
                className="w-full bg-white/5 hover:bg-green-500/20 text-white p-4 rounded-2xl flex items-center gap-3"
                onClick={() => {
                  galleryInputRef.current?.click();
                  setShowDialog(false);
                }}
              >
                <ImageIcon size={20} className="text-green-400" />
                Galeria
              </button>
            </div>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => onChange?.(e.target.files?.[0] || null)}
          />

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange?.(e.target.files?.[0] || null)}
          />
        </div>
      )}
    </div>
  );
}