"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import { FaLock } from "react-icons/fa";
import useAuthRedirect from "@/hooks/use-auth-redirect";

export default function ResetPassword() {
  const router = useRouter();

  // verifica autenticação
  const loadingAuth = useAuthRedirect();

  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // pega token e uid da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    const u = params.get("uid");

    if (t) setToken(t);
    if (u) setUid(u);
  }, []);

  const handlePasswordUpdate = async () => {
    if (!token || !uid || password.length < 6) {
      setError("Senha, token ou UID inválido.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.post("/auth/reset_password/", {
        password,
        token,
        uid,
      });

      setMessage(res.data.message);
      setTimeout(() => router.push("/auth"), 2000);
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  // loading enquanto verifica autenticação
  if (loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617]">
      <div className="w-full max-w-sm">

        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Imlinked
        </h1>

        <h2 className="mb-6 text-xl text-gray-300 text-center">
          Create a new password
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
          type="password"
          placeholder="New password"
          icon={<FaLock />}
          eye
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="w-full mt-4"
          onClick={handlePasswordUpdate}
          disabled={password.length < 6 || !token || !uid || loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>

      </div>
    </div>
  );
}