"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import useAuthRedirect from "@/hooks/use-auth-redirect";


function SuccessContent() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const loadingAuth = useAuthRedirect();

  useEffect(() => {
    const id = searchParams.get("purchase_id");
    if (!id) return;

    setPurchaseId(id);

    const fakePayment = async () => {
      try {
        // simula delay de gateway (tipo Stripe)
        await new Promise((res) => setTimeout(res, 2000));

        await api.post(`/ticket-purchases/${id}/confirm-payment/`, {
          transaction_id: `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        });

        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    fakePayment();
  }, [searchParams]);

  if (status === "loading" || loadingAuth) return <LoadingPage />;

  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-screen bg-[#05070A] text-red-500">
        <p>Erro ao confirmar pagamento</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05070A] text-white p-6 text-center">
      <h1 className="text-3xl font-black text-green-500 mb-4 uppercase">
        Pagamento Confirmado
      </h1>

      <p className="text-sm text-slate-400 mb-6 uppercase">
        Seus ingressos foram gerados com sucesso
      </p>

      <p className="text-xs text-slate-600 mb-8">
        ID: {purchaseId}
      </p>

      <button
        onClick={() => (window.location.href = "/")}
        className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase text-xs"
      >
        Voltar
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SuccessContent />
    </Suspense>
  );
}