"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

export default function SuccessPage() {
  const router = useRouter();
  const loadingAuth = useAuthRedirect();

  if (loadingAuth) return <LoadingPage />;
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full text-center bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4">Pagamento Confirmado!</h1>
        <p className="text-slate-400 mb-10">
          Seu plano foi atualizado com sucesso. Você já pode desfrutar de todos os recursos premium do Imlinkey.
        </p>

        <Button 
          onClick={() => router.push("/dashboard")}
          className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all"
        >
          Ir para o Dashboard <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
