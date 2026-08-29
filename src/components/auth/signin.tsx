"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { FaAt, FaLock } from "react-icons/fa";
import Image from "next/image";
import { api } from "@/utils";
import type { AxiosError } from "axios";

interface SigninProps {
  setMode: (mode: "signin" | "signup") => void;
}

type AlertType = "error" | "warning" | "info" | "success";

interface AlertMessage {
  type: AlertType;
  message: string;
}

const ALERT_STYLES: Record<AlertType, string> = {
  error: "bg-red-100 text-red-700 border-red-400",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
  info: "bg-blue-100 text-blue-700 border-blue-400",
  success: "bg-green-100 text-green-700 border-green-400",
};

export default function Signin({ setMode }: SigninProps) {
  const router = useRouter();

  // ---------------- STATE ----------------
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // controle inteligente
  const [hasError, setHasError] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // animação
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["green", "white", "black", "red"];

  // ---------------- HELPERS ----------------
  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // desbloqueia auto login ao editar
    setHasError(false);
    setIsTyping(true);
  };

  const validate = () => {
    if (!form.identifier.trim() || !form.password.trim()) {
      setAlert({ type: "warning", message: "Preencha todos os campos." });
      return false;
    }
    return true;
  };

  const parseError = (err: unknown): string => {
    const axiosErr = err as AxiosError;

    if (!axiosErr.response) return "Erro de rede ou servidor offline.";

    const data = axiosErr.response.data;

    if (!data) return `Erro ${axiosErr.response.status}`;
    if (typeof data === "string") return data;

    return Object.entries(data)
      .map(
        ([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
      )
      .join(" | ");
  };

  // ---------------- SIGNIN ----------------
  const handleSignIn = async () => {
    if (loading) return;

    setAlert(null);

    if (!validate()) return;

    setLoading(true);
    setLastAttempt(Date.now());

    try {
      const { data } = await api.post(
        "/auth/signin/",
        {
          identifier: form.identifier.trim(),
          password: form.password,
        },
        { withCredentials: true }
      );

      setLoginSuccess(true);

      setAlert({
        type: "success",
        message: `Login bem-sucedido! ${data.message || ""}`,
      });

      setTimeout(() => router.replace("/dashboard"), 1200);
    } catch (err) {
      setHasError(true); // 🔒 bloqueia auto login
      setAlert({ type: "error", message: parseError(err) });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- AUTO LOGIN ----------------

  // detecta quando user parou de digitar
  useEffect(() => {
    if (!isTyping) return;

    const t = setTimeout(() => setIsTyping(false), 700);
    return () => clearTimeout(t);
  }, [isTyping]);

  useEffect(() => {
    if (loginSuccess || loading || hasError) return;

    if (!form.identifier.trim() || !form.password.trim()) return;

    if (isTyping) return;

    const now = Date.now();

    // cooldown anti spam
    if (now - lastAttempt < 2000) return;

    const timer = setTimeout(() => {
      handleSignIn();
    }, 800);

    return () => clearTimeout(timer);
  }, [
    form.identifier,
    form.password,
    isTyping,
    hasError,
    loading,
    loginSuccess,
  ]);

  // ---------------- ANIMAÇÃO ----------------
  useEffect(() => {
    if (loginSuccess) return;

    const interval = setInterval(
      () => setColorIndex((prev) => (prev + 1) % colors.length),
      10000
    );

    return () => clearInterval(interval);
  }, [loginSuccess]);

  const paypalStyle = {
    backgroundColor: loginSuccess ? "green" : colors[colorIndex],
    color: loginSuccess ? "white" : colorIndex === 1 ? "black" : "white",
    animation: loginSuccess
      ? "successPulse 0.8s infinite"
      : "wave 2s infinite, pulse 1s infinite",
  };

  // ---------------- UI ----------------
  return (
    <div className="relative">
      {/* PAYPAL BTN */}
      <div className="flex justify-center mt-6 z-50">
        <a
          href={!loginSuccess ? "https://www.paypal.me/kordelmauve" : undefined}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            textAlign: "center",
            transition: "all 0.3s ease",
            ...paypalStyle,
          }}
        >
          {loginSuccess ? "✔ Login Successful" : "Ceo's PayPal"}
        </a>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col gap-4 mt-6">
        {/* ALERT */}
        {alert && (
          <div
            className={`border-l-4 p-3 rounded text-sm font-medium ${
              ALERT_STYLES[alert.type]
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* INPUTS */}
        <Input
          placeholder="Username, Email ou Phone"
          icon={<FaAt />}
          value={form.identifier}
          onChange={(e) => setField("identifier", e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          icon={<FaLock />}
          eye
          value={form.password}
          onChange={(e) => setField("password", e.target.value)}
          disabled={loading}
        />

        {/* FORGOT */}
        <div className="text-right text-sm">
          <button
            onClick={() => window.open("/forgot-password", "_blank")}
            className="text-blue-400 hover:underline"
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>

        {/* BUTTON */}
        <Button className="w-full" onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        {/* SIGNUP */}
        <p className="text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => setMode("signup")}
            className="text-blue-400 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* ANIMAÇÕES */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(15deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        @keyframes successPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
