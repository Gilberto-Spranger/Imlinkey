"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Ticket, ShieldCheck, Plus, Minus,
  CreditCard, AlertCircle, Loader2
} from "lucide-react";
import { Button, LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import { motion } from "framer-motion";
import useAuthRedirect from "@/hooks/use-auth-redirect";

interface TicketLot {
  id: string;
  ticket_type: string;
  price: string;
}

interface EventDetail {
  id: string;
  title: string;
  location: string;
  start_time: string;
}

export default function TicketPurchasePage() {
  const params = useParams();
  const router = useRouter();
  const loadingAuth = useAuthRedirect();
  const eventId = params?.id as string;
  const ticketId = params?.ticketId as string;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [ticketLot, setTicketLot] = useState<TicketLot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [issubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!eventId || !ticketId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [eventRes, ticketRes] = await Promise.all([
          api.get<EventDetail>(`/public-events/${eventId}/`),
          api.get<TicketLot>(`/ticket-lots/${ticketId}/`)
        ]);

        setEvent(eventRes.data);
        setTicketLot(ticketRes.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, ticketId]);

  const total = useMemo(() => {
    const price = parseFloat(ticketLot?.price || "0");
    return price * quantity;
  }, [ticketLot, quantity]);

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        event: eventId,
        ticket_lot: ticketId,
        quantity,
        total_amount: total.toFixed(2),
        customer_external_id: `EXT-${Math.random().toString(36).substring(2,10).toUpperCase()}`
      };

      const res = await api.post("/ticket-purchases/", payload);

      if (res.status === 201) {
        router.push(`/event-ticket/success?purchase_id=${res.data.id}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || "Erro ao criar intenção de compra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || loadingAuth) return <LoadingPage />;
  if (error || !event || !ticketLot) return <ErrorState onBack={() => router.back()} />;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 font-sans pb-20">
      <nav className="p-6 flex items-center gap-4 border-b border-white/5 bg-[#05070A]/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-black uppercase tracking-widest text-blue-500">Checkout</h1>
          <span className="text-[10px] text-slate-500 font-bold uppercase">Pagamento Seguro</span>
        </div>
      </nav>

      <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-6 space-y-8">
        <section className="bg-[#0D1117] border border-white/5 rounded-[2.5rem] p-6 flex gap-6 items-center shadow-2xl">
          <div className="h-20 w-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0">
            <Ticket size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase leading-tight mb-1">{event.title}</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{event.location}</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Quantidade</h3>
          <div className="bg-[#0D1117] border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between">
            <div>
              <p className="font-black text-white text-lg uppercase">{ticketLot.ticket_type}</p>
              <p className="text-xs text-blue-500 font-bold mt-1">Kz {parseFloat(ticketLot.price).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-4 bg-[#05070A] rounded-2xl p-2 border border-white/5">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(q => q - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 disabled:opacity-20 transition-all"
              >
                <Minus size={18} />
              </button>
              <span className="text-xl font-black w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-blue-500 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="bg-[#0D1117] border border-white/5 rounded-[2.5rem] p-8 space-y-5">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
            <span className="text-slate-500">{quantity}x Ingressos</span>
            <span className="text-white">Kz {total.toLocaleString()}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Total</span>
            <span className="text-3xl font-black text-blue-500 tracking-tighter">
              Kz {total.toLocaleString()}
            </span>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <Button
            disabled={issubmitting}
            onClick={handleConfirmPurchase}
            className="w-full h-20 rounded-[2rem] bg-white text-black hover:bg-blue-600 hover:text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-blue-900/20 shadow-2xl active:scale-[0.98]"
          >
            {issubmitting ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <CreditCard className="mr-3" size={20} />
                Confirmar e Pagar
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={14} className="text-green-500/50" />
            Pagamento Processado com Segurança
          </div>
        </div>
      </motion.main>
    </div>
  );
}


function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle size={48} className="text-red-500 mb-6 opacity-50" />
      <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Erro de Conexão</h2>
      <p className="text-xs text-slate-500 mb-8 max-w-xs leading-relaxed uppercase font-bold">
        Não foi possível recuperar os dados do lote. Tente novamente mais tarde.
      </p>
      <Button onClick={onBack} className="bg-white text-black px-10 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest">
        Voltar
      </Button>
    </div>
  );
}