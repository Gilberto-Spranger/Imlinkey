"use client";

import { useState } from "react";
import { Button, Input, LoadingPage } from "@/components/ui";
import { FaEnvelope } from "react-icons/fa";
import { api } from "@/utils";
import { useRouter } from "next/navigation";
import useAuthRedirect from "@/hooks/use-auth-redirect";

export default function ForgotPassword() {
  const router = useRouter();

  // verifica autenticação
  const loadingAuth = useAuthRedirect();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmailValid = email.includes("@");

  const handlePasswordReset = async () => {
    if (!isEmailValid || loading) return;

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot_password/", { email });
      setMessage(data?.message || "Link de redefinição enviado.");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(
        err?.response?.data?.message ||
          "Erro ao enviar o link de redefinição."
      );
    } finally {
      setLoading(false);
    }
  };

  const openGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  // loading de verificação auth
  if (loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617]">
      <div className="w-full max-w-sm">

        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Imlinkey
        </h1>

        <h2 className="mb-6 text-xl text-gray-300 text-center">
          Reset your password
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-500 text-center mb-4">
            {message}
          </p>
        )}

        <Input
          type="email"
          placeholder="Your email"
          icon={<FaEnvelope />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <Button
          className="w-full mt-4"
          onClick={handlePasswordReset}
          disabled={!isEmailValid || loading}
        >
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        {message && (
          <Button
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
            onClick={openGmail}
          >
            Open Gmail
          </Button>
        )}

      </div>
    </div>
  );
}