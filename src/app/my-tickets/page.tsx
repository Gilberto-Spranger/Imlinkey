"use client";

import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/utils";
import { Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VisualTicket, LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

interface Ticket {
  id: string;
  short_code?: string;
  ticket_type: string;
  price: number | string;
  status: string;
  qr_hash?: string;
  is_checked_in: boolean;
  is_valid: { valid: boolean; reason: string };
  purchase_status: string;
  event: {
    title: string;
    location: string;
    date: string;
    image?: string;
  };
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const loadingAuth = useAuthRedirect();

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Ticket[]>("/tickets/");
      setTickets(response.data);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const activeTickets = tickets.filter(t => t.is_valid?.valid && !t.is_checked_in);
  const historyTickets = tickets.filter(t => !t.is_valid?.valid || t.is_checked_in);
  const displayTickets = activeTab === "active" ? activeTickets : historyTickets;

  if (loading || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-20">
      <div className="max-w-5xl mx-auto p-6 pt-12">
        <header className="mb-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black uppercase tracking-tight">Meus Ingressos</h1>
          </motion.div>
          <p className="text-slate-500 font-medium">
            Gerencie suas entradas e visualize seu histórico de eventos.
          </p>
        </header>

        <div className="flex p-1.5 bg-white/5 border border-white/5 rounded-2xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider ${
              activeTab === "active" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Ativos ({activeTickets.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider ${
              activeTab === "history" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Histórico ({historyTickets.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {displayTickets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 rounded-[2.5rem] border-2 border-dashed border-white/5 bg-white/[0.02]"
            >
              <AlertCircle className="w-12 h-12 mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Nada encontrado por aqui</p>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayTickets.map(ticket => (
                <VisualTicket
                  key={ticket.id}
                  ticket={{
                    id: ticket.id,
                    short_code: ticket.short_code || "N/A",
                    ticket_type: ticket.ticket_type,
                    price: ticket.price,
                    status: ticket.status,
                    qr_hash: ticket.qr_hash || "",
                  }}
                  event={{
                    title: ticket.event?.title || "Sem título",
                    location: ticket.event?.location || "Local não informado",
                    date: ticket.event?.date || "",
                    image: ticket.event?.image,
                  }}
                  currency="AKZ"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}