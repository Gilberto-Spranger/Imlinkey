"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { Button, LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingAuth = useAuthRedirect();

  const country = params?.country as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Agora 'country' está acessível via useParams
        return_url: `${window.location.origin}/payments/${country}/billing/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "Ocorreu um erro no processamento.");
    }

    setLoading(false);
  };

  if (loadingAuth) return <LoadingPage />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
        >
          {errorMessage}
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-7 bg-sky-500 hover:bg-sky-400 text-white font-black text-xl rounded-2xl shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" /> Processando...
          </div>
        ) : (
          "Pagar Agora"
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-slate-500">
        <Lock size={12} />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Pagamento 100% Seguro
        </span>
      </div>
    </form>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-sky-500" size={40} />
        <p className="text-slate-400 font-medium">Preparando checkout seguro...</p>
      </div>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientSecret = searchParams.get("session");

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-xs space-y-4">
          <p className="text-slate-400 text-lg">Sessão de pagamento expirada ou inválida.</p>
          <Button onClick={() => router.back()} className="w-full" variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-200 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-foreground/5 border border-border rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl">
          <header className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 mb-6">
              <ShieldCheck size={36} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Checkout</h1>
            <p className="text-slate-400 text-sm">
              Complete sua assinatura para ativar os recursos do Imlinkey.
            </p>
          </header>

          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#0ea5e9',
                  colorBackground: '#0f172a',
                  colorText: '#f8fafc',
                  borderRadius: '12px',
                }
              }
            }}
          >
            <CheckoutForm />
          </Elements>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}