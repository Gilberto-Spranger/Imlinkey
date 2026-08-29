"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileLayout, LoadingPage, Button } from "@/components/ui";
import {
  Mail,
  MessageCircle,
  Upload,
  X,
  CheckCircle2,
  Info,
  Calendar,
  Ticket,
  CreditCard,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { api } from "@/utils";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// ===============================
// COMPONENTE: TOAST DE ALERTA
// ===============================
const ApiToast = ({ message, details, onClose }: { message: string, details?: any, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed bottom-10 right-10 z-[100] max-w-md w-full bg-slate-900 border border-rose-500/50 rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.3)] overflow-hidden"
  >
    <div className="bg-rose-500 p-4 flex items-center justify-between text-white">
      <div className="flex items-center gap-2 font-bold uppercase tracking-tighter text-sm">
        <AlertTriangle size={18} />
        Erro de Processamento
      </div>
      <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
        <X size={18} />
      </button>
    </div>
    <div className="p-5">
      <p className="text-white font-medium mb-2">{message}</p>
      {details && (
        <div className="space-y-1">
          {Object.entries(details).map(([key, val]: any) => (
            <p key={key} className="text-xs text-rose-300">
              <span className="font-bold uppercase opacity-60">• {key}:</span> {Array.isArray(val) ? val[0] : val}
            </p>
          ))}
        </div>
      )}
    </div>
    <div className="bg-white/5 p-3 px-5 text-[10px] text-slate-500 italic border-t border-white/5">
      Por favor, revise os campos destacados e tente novamente.
    </div>
  </motion.div>
);

// --- Componente de Input Reutilizável ---
const InputField = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className={`w-full bg-slate-900/50 border ${error ? "border-rose-500" : "border-white/5"} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all`}
      />
    </div>
  </div>
);

function SupportContent() {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [errorToast, setErrorToast] = useState<{show: boolean, msg: string, details?: any}>({
    show: false, msg: ""
  });

  // CORREÇÃO: 'related_event_id' alterado para 'related_issue_id' para alinhar com o Django
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    subject: "technical",
    message: "",
    priority: "medium",
    attachment_file: null as File | null,
    related_issue_id: "" 
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get("/profile/")
      .then((res) => setForm(prev => ({ ...prev, full_name: res.data.full_name || "", email: res.data.email || "" })))
      .catch(() => console.error("Erro ao carregar perfil"))
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorToast({ show: true, msg: "Ficheiro demasiado grande", details: { tamanho: "O limite é 5MB" } });
        return;
      }
      setForm({ ...form, attachment_file: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorToast({ show: false, msg: "" });

    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("subject", form.subject);
      formData.append("priority", form.priority);
      formData.append("message", form.message);
      
      if (form.attachment_file) formData.append("attachment_file", form.attachment_file);
      // CORREÇÃO: Enviando com a chave correta para o Serializer
      if (form.related_issue_id) formData.append("related_issue_id", form.related_issue_id);

      await api.post("/support-tickets/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      const apiErrors = err.response?.data;
      setErrorToast({
        show: true,
        msg: "Não foi possível enviar o seu pedido.",
        details: typeof apiErrors === "object" ? apiErrors : { erro: "Falha na conexão com o servidor" }
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingProfile) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <AnimatePresence>
        {errorToast.show && (
          <ApiToast 
            message={errorToast.msg} 
            details={errorToast.details} 
            onClose={() => setErrorToast({ ...errorToast, show: false })} 
          />
        )}
      </AnimatePresence>

      <ProfileLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            <div className="lg:col-span-8">
              <header className="mb-10">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-widest border border-sky-500/20">
                  Suporte Especializado
                </motion.span>
                <h1 className="text-4xl md:text-5xl font-black text-white mt-4">Fale com a <span className="text-sky-500">Gente</span></h1>
              </header>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    onSubmit={handleSubmit} 
                    className="space-y-8 bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-3xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Nome" icon={MessageCircle} value={form.full_name} onChange={(e: any) => setForm({ ...form, full_name: e.target.value })} required />
                      <InputField label="E-mail" type="email" icon={Mail} value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Assunto</label>
                        <select 
                          className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-sky-500 appearance-none cursor-pointer" 
                          value={form.subject} 
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        >
                          <option value="technical">🛠 Bug Técnico</option>
                          <option value="bio_custom">🎨 Design da Bio</option>
                          <option value="event_creation">📅 Criar Evento</option>
                          <option value="ticket_purchase">🎫 Ingressos</option>
                          <option value="withdrawal">💰 Financeiro</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Prioridade</label>
                        <div className="flex p-1.5 bg-slate-900 rounded-2xl border border-white/10">
                          {["low", "medium", "high"].map((p) => (
                            <button 
                              key={p} 
                              type="button" 
                              onClick={() => setForm({ ...form, priority: p })} 
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${form.priority === p ? "bg-sky-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                            >
                              {p === "low" ? "Baixa" : p === "medium" ? "Média" : "Alta"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Sua Mensagem</label>
                      <textarea 
                        required 
                        rows={5} 
                        value={form.message} 
                        onChange={(e) => setForm({ ...form, message: e.target.value })} 
                        className="w-full bg-slate-900 border border-white/5 rounded-3xl p-5 text-white focus:border-sky-500/50 transition-all resize-none" 
                        placeholder="Detalhes do problema..." 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* CORREÇÃO: Atribuindo valor ao campo de ID relacionado correto */}
                       <InputField 
                         label="ID do Evento / Pedido (Opcional)" 
                         icon={Ticket} 
                         value={form.related_issue_id} 
                         onChange={(e: any) => setForm({ ...form, related_issue_id: e.target.value })} 
                         placeholder="Ex: EVT-123" 
                       />
                       <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Anexo</label>
                          <div 
                            onClick={() => !form.attachment_file && fileInputRef.current?.click()} 
                            className={`h-[58px] border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all ${form.attachment_file ? "border-sky-500 bg-sky-500/5" : "border-white/10 hover:border-sky-500/40"}`}
                          >
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                            {form.attachment_file ? (
                              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
                                <CheckCircle2 size={16} /> Imagem Carregada 
                                <X 
                                  size={14} 
                                  className="text-rose-500 ml-2 hover:scale-125 transition-transform" 
                                  onClick={(e) => { e.stopPropagation(); setForm({ ...form, attachment_file: null }); setPreviewUrl(null); }} 
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                                <Upload size={16} /> Print do Erro
                              </div>
                            )}
                          </div>
                       </div>
                    </div>

                    <Button 
                      isLoading={loadingSubmit} 
                      className="w-full h-16 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-lg shadow-[0_10px_40px_rgba(14,165,233,0.3)] transition-all"
                    >
                      Abrir Chamado Agora
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 text-center"
                  >
                    <CheckCircle2 size={60} className="text-emerald-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-white mb-4">Enviado com Sucesso!</h2>
                    <p className="text-slate-400 mb-8">Nossa equipe analisará o seu caso em até 24h.</p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">Novo Ticket</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Info size={18} className="text-sky-500" /> Suporte Rápido
                </h3>
                <div className="space-y-4">
                  {[ 
                    { icon: Calendar, label: "Eventos", color: "text-amber-400" }, 
                    { icon: Ticket, label: "Ingressos", color: "text-purple-400" }, 
                    { icon: CreditCard, label: "Financeiro", color: "text-emerald-400" } 
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer group transition-all">
                      <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}><item.icon size={20} /></div>
                      <p className="text-sm font-bold text-white flex-1">{item.label}</p>
                      <ChevronRight size={14} className="text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </ProfileLayout>
    </div>
  );
}

export default function SupportPage() {
  const loadingAuth = useAuthRedirect();
  if (loadingAuth) return <LoadingPage />
  return (
    <Suspense fallback={<LoadingPage />}>
      <SupportContent />
    </Suspense>
  );
}