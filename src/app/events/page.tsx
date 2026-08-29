"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Clock, Ticket, Search, Sparkles, ChevronDown, ShoppingCart, User } from "lucide-react";
import { Button, LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import useAuthRedirect from "@/hooks/use-auth-redirect"; 

// --- Tipos baseados no backend ---
interface TicketLot {
  id: string;
  ticket_type: string;
  price: number;
  event: string; // id do evento
}

interface EventType {
  id: string;
  title: string;
  slug: string;
  location?: string;
  start_time?: string;
  owner_full_name?: string;
  owner_avatar_url?: string;
}

export default function AllEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [tickets, setTickets] = useState<TicketLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const loadingAuth = useAuthRedirect();

  // --- Load events + tickets do backend ---
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [eventsRes, ticketsRes] = await Promise.all([
          api.get<EventType[]>("/public-events/"),
          api.get<TicketLot[]>("/ticket-lots/")
        ]);

        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
        setTickets(Array.isArray(ticketsRes.data) ? ticketsRes.data : []);
      } catch (err) {
        console.error("Erro ao buscar dados do backend:", err);
        setEvents([]);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredEvents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return events.filter(ev =>
      ev.title?.toLowerCase().includes(term) ||
      ev.location?.toLowerCase().includes(term)
    );
  }, [events, searchTerm]);

  if (loading || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> Bilheteira Oficial
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              Discovery<span className="text-blue-600">.</span>
            </h1>
          </div>

          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
            <input
              placeholder="Buscar experiências..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/40 transition-all text-sm"
            />
          </div>
        </div>
      </section>

      {/* Grid de eventos */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length ? (
            filteredEvents.map(ev => {
              const evTickets = tickets.filter(t => t.event === ev.id);
              return <EventCard key={ev.id} ev={ev} tickets={evTickets} />;
            })
          ) : (
            <p className="text-sm text-slate-500 col-span-full text-center mt-10">Nenhum evento encontrado 😢</p>
          )}
        </div>
      </section>
    </div>
  );
}

function EventCard({ ev, tickets }: { ev: EventType; tickets: TicketLot[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateObj = ev.start_time ? new Date(ev.start_time) : null;

  return (
    <motion.div layout className="bg-[#0D1117] border border-white/5 rounded-[2.5rem] p-6 hover:border-blue-500/20 transition-all flex flex-col group">
      {/* Organizador */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
          {ev.owner_avatar_url ? (
            <img src={ev.owner_avatar_url} alt={ev.owner_full_name} className="w-full h-full object-cover" />
          ) : (
            <User size={18} className="text-slate-600" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Organizador</span>
          <span className="text-xs font-bold text-white">{ev.owner_full_name || "Membro Imlinkey"}</span>
        </div>
      </div>

      {/* Título e info */}
      <div className="space-y-3 mb-8">
        <h3 className="text-2xl font-black text-white uppercase leading-tight">{ev.title}</h3>
        <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500 uppercase">
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500"/> {ev.location || "Localização desconhecida"}</span>
          {dateObj && (
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500"/> {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}h</span>
          )}
        </div>
      </div>

      {/* Tickets */}
      <div className="mt-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5"
        >
          <div className="flex items-center gap-3">
            <Ticket className="text-blue-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              {tickets.length} Ingressos
            </span>
          </div>
          <ChevronDown className={`text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={18} />
        </button>

        <AnimatePresence>
          {isExpanded && tickets.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2 pt-3"
            >
              {tickets.map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase">{ticket.ticket_type}</span>
                    <span className="text-sm font-black text-white">
                      {Number(ticket.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                  <Button
                    onClick={() => window.location.href = `/event-ticket/${ev.id}/${ticket.id}/buy`}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase px-5 h-9 rounded-xl active:scale-95 transition-all"
                  >
                    COMPRAR <ShoppingCart size={12} className="ml-2" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}