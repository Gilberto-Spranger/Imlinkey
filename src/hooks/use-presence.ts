"use client";

import { useEffect, useRef, useCallback, useState } from "react";

type StatusType = "online" | "offline";

interface UsePresenceOptions {
  userId: string;
  heartbeatInterval?: number;
  reconnectInterval?: number;
}

interface PresenceMessage {
  type?: "ping" | "status";
  status?: StatusType;
  user_id?: string;
}

// -------------------------
// COOKIE HELPER
// -------------------------
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || "";
  }

  return "";
}

export function usePresence({
  userId,
  heartbeatInterval = 10000,
  reconnectInterval = 5000,
}: UsePresenceOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [connected, setConnected] = useState(false);

  // -------------------------
  // BUILD URL
  // -------------------------
  const buildUrl = useCallback(() => {
    const token = getCookie("access_token");
    return `wss://api.imlinkey.store/ws/status/?token=${token}`;
  }, []);

  // -------------------------
  // SEND SAFE
  // -------------------------
  const send = useCallback(
    (data: PresenceMessage) => {
      const ws = wsRef.current;

      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      ws.send(
        JSON.stringify({
          user_id: userId,
          ...data,
        })
      );
    },
    [userId]
  );

  // -------------------------
  // CORE CONNECT (SEM LOOP)
  // -------------------------
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(buildUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);

      send({ type: "status", status: "online" });

      intervalRef.current = setInterval(() => {
        send({ type: "ping" });
      }, heartbeatInterval);
    };

    ws.onclose = () => {
      setConnected(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      reconnectRef.current = setTimeout(() => {
        connectRef.current(); // 👈 usa ref em vez de recursion direta
      }, reconnectInterval);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [buildUrl, send, heartbeatInterval, reconnectInterval]);

  // 🔗 liga a ref depois da definição
  connectRef.current = connect;

  // -------------------------
  // DISCONNECT
  // -------------------------
  const disconnect = useCallback(() => {
    send({ type: "status", status: "offline" });

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }

    wsRef.current?.close();
    wsRef.current = null;

    setConnected(false);
  }, [send]);

  // -------------------------
  // LIFECYCLE
  // -------------------------
  useEffect(() => {
    connect();

    const handleVisibility = () => {
      send({
        type: "status",
        status: document.hidden ? "offline" : "online",
      });
    };

    const handleBeforeUnload = () => {
      send({ type: "status", status: "offline" });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      disconnect();
    };
  }, [connect, disconnect, send]);

  return {
    connected,
    connect,
    disconnect,
  };
}