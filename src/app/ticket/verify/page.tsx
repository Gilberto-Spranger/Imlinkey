"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/utils";
import { Loader2 } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const id = searchParams.get("id");
      const hash = searchParams.get("hash");

      if (!id || !hash) {
        setStatus("error");
        setMessage("Parâmetros inválidos.");
        return;
      }

      try {
        const res = await api.post(`/tickets/${id}/validate-secure/`, { qr_hash: hash });
        setStatus("success");
        setMessage(res.data.detail);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.detail || "Erro ao validar ingresso.");
      }
    };
    verify();
  }, [searchParams]);

  return (
    <div className="text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="font-black text-slate-500 uppercase tracking-widest">Processando Entrada...</p>
        </div>
      )}

      {status === "success" && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/20">
          <h1 className="text-6xl mb-4">✅</h1>
          <h2 className="text-4xl font-black text-emerald-500 uppercase italic">Válido</h2>
          <p className="mt-4 text-slate-300 font-bold">{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-rose-500/10 border border-rose-500/50 p-10 rounded-[3rem] shadow-2xl shadow-rose-500/20">
          <h1 className="text-6xl mb-4">❌</h1>
          <h2 className="text-4xl font-black text-rose-500 uppercase italic">Inválido</h2>
          <p className="mt-4 text-slate-300 font-bold">{message}</p>
        </div>
      )}
    </div>
  );
}

export default function VerifyTicketPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-6">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest">Carregando...</p>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}