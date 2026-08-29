"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, MapPin, BarChart3, Ticket as TicketIcon, Trash2, Loader2 } from "lucide-react";
import { ProfileLayout, Button, Section, LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import { motion } from "framer-motion";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// --- Tipos ---
interface EventType {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  location: string;
  start_time: string;
  end_time: string;
  category: string;
  tags?: string;
  max_tickets?: number;
  tickets_sold: number;
  is_active: boolean;
  owner_id: string;
}

interface TicketLotType {
  id: string;
  ticket_type: string;
  price: string;
  event: string; // ⚡ Ajustado para o serializer
  created_at: string;
}

// --- Página Principal ---
export default function EventManagementPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadingAuth = useAuthRedirect();

  const initialFormState = {
    title: "",
    description: "",
    image_file: null as File | null,
    location: "",
    start_time: "",
    end_time: "",
    category: "Geral",
    tags: "{}",
    max_tickets: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Carregar eventos ---
  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<EventType[]>("/events/?my_events=true");
      setEvents(res.data);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // --- Criar evento ---
  const handleCreateEvent = async () => {
    if (!formData.title || !formData.start_time) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description || "");
      fd.append("location", formData.location);
      fd.append("start_time", formData.start_time);
      fd.append("end_time", formData.end_time);
      fd.append("category", formData.category);
      fd.append("tags", formData.tags || "{}");
      if (formData.max_tickets) fd.append("max_tickets", formData.max_tickets.toString());
      if (formData.image_file) fd.append("image_file", formData.image_file);

      await api.post("/events/", fd);

      setFormData(initialFormState);
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Excluir evento e todos os seus lotes?")) return;
    try {
      await api.delete(`/events/${id}/`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch {
      alert("Erro ao deletar. Existem vendas vinculadas.");
    }
  };

if (loadingAuth) return <LoadingPage />

  return (
    <ProfileLayout>
      <Section title="Gestão de Eventos e Ingressos">

        <EventForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateEvent}
          isSubmitting={isSubmitting}
        />

        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : (
            events.map(ev => (
              <EventSection key={ev.id} event={ev} onDelete={handleDeleteEvent} />
            ))
          )}
        </div>
      </Section>
    </ProfileLayout>
  );
}

// --- Formulário de Eventos ---
function EventForm({ formData, setFormData, onSubmit, isSubmitting }: any) {
  return (
    <div className="bg-[#0B0F1A] border border-white/5 rounded-[2.5rem] p-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <InputLabel label="Título do Evento">
            <input
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-4 rounded-2xl bg-slate-900/50 border border-white/5 text-white outline-none"
              placeholder="Nome do evento..."
            />
          </InputLabel>

          <InputLabel label="Descrição">
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/5 text-white resize-none"
              placeholder="Descrição do evento..."
            />
          </InputLabel>

          <InputLabel label="Imagem">
            <input
              type="file"
              accept="image/*"
              onChange={e => setFormData({ ...formData, image_file: e.target.files?.[0] || null })}
              className="w-full text-xs text-white"
            />
          </InputLabel>

          <div className="grid grid-cols-2 gap-4">
            <InputLabel label="Local">
              <input
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/5 text-white"
              />
            </InputLabel>

            <InputLabel label="Categoria">
              <input
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/5 text-white"
              />
            </InputLabel>
          </div>
        </div>

        <div className="space-y-4">
          <InputLabel label="Data Início">
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={e => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/5 text-white text-xs"
            />
          </InputLabel>

          <InputLabel label="Data Término">
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={e => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-white/5 text-white text-xs"
            />
          </InputLabel>
        </div>

        <div className="flex items-end">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !formData.title}
            className="w-full h-full lg:h-[110px] bg-indigo-600 rounded-3xl"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "CRIAR EVENTO"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Input Label ---
function InputLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}

// --- Event Section ---
function EventSection({ event, onDelete }: { event: EventType; onDelete: (id: string) => void }) {
  return (
    <motion.div layout className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-6 md:p-10">
      <div className="flex flex-col lg:flex-row gap-6 items-center mb-10">
        <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
          <Calendar size={28} />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-black text-white uppercase">{event.title}</h4>
          <div className="flex gap-4 text-[10px] font-bold text-slate-500 mt-2">
            <span className="flex items-center gap-1 uppercase tracking-tighter"><MapPin size={12}/> {event.location}</span>
            <span className="flex items-center gap-1 uppercase tracking-tighter text-indigo-400"><BarChart3 size={12}/> {event.tickets_sold} Vendas</span>
          </div>
        </div>
        <button onClick={() => onDelete(event.id)} className="p-4 rounded-2xl hover:bg-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-all">
          <Trash2 size={20} />
        </button>
      </div>

      <LotManager event={event} />
    </motion.div>
  );
}

// --- Lot Manager ---
function LotManager({ event }: { event: EventType }) {
  const [lots, setLots] = useState<TicketLotType[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ticket_type: "", price: "" });

  const loadLots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<TicketLotType[]>(`/ticket-lots/?event_id=${event.id}`);
      setLots(res.data.filter(lot => lot.event === event.id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [event.id]);

  useEffect(() => { loadLots(); }, [loadLots]);

  const handleCreateLot = async () => {
    if (!formData.ticket_type || !formData.price || Number(formData.price) <= 0) return alert("Digite um lote válido e preço > 0");
    try {
      await api.post("/ticket-lots/", { ...formData, event: event.id }); // ⚡ payload correto
      setFormData({ ticket_type: "", price: "" });
      loadLots();
    } catch { alert("Erro ao criar lote."); }
  };

  const handleDeleteLot = async (id: string) => {
    if (!confirm("Deletar este lote?")) return;
    try {
      await api.delete(`/ticket-lots/${id}/`);
      setLots(prev => prev.filter(l => l.id !== id));
    } catch { alert("Lote contém ingressos vendidos."); }
  };

  return (
    <div className="bg-slate-950/40 rounded-[2.2rem] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Nome do Lote (Ex: VIP, Geral)"
          value={formData.ticket_type}
          onChange={e => setFormData({ ...formData, ticket_type: e.target.value })}
          className="flex-1 bg-slate-900 border border-white/5 rounded-2xl p-4 text-sm text-white"
        />
        <input
          type="number"
          placeholder="Preço"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
          className="w-full sm:w-32 bg-slate-900 border border-white/5 rounded-2xl p-4 text-sm text-white"
        />
        <Button onClick={handleCreateLot} className="bg-white text-black px-8 rounded-2xl font-black">
          ADICIONAR LOTE
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-4 text-slate-500 text-[10px] font-black uppercase">Atualizando Lotes...</div>
        ) : (
          lots.map(lot => <TicketLotCard key={lot.id} lot={lot} onDelete={() => handleDeleteLot(lot.id)} />)
        )}
      </div>
    </div>
  );
}

// --- Ticket Card ---
function TicketLotCard({ lot, onDelete }: { lot: TicketLotType; onDelete: () => void }) {
  return (
    <div className="relative overflow-hidden bg-slate-900/60 border border-white/5 rounded-3xl p-5 flex items-center gap-5">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-500 rounded-r-full" />
      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
        <TicketIcon size={24} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lote de Ingressos</p>
        <h5 className="text-sm font-black text-white uppercase">{lot.ticket_type}</h5>
        <p className="text-lg font-black text-indigo-400 mt-1">
          <span className="text-[10px] mr-1 text-slate-500">AOA</span>
          {Number(lot.price).toLocaleString()}
        </p>
      </div>
      <button onClick={onDelete} className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
        <Trash2 size={16} />
      </button>
    </div>
  );
}