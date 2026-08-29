"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { api } from "@/utils";
import { Copy, Trash2, Plus, Globe, ShieldCheck, Image as ImageIcon, Check } from "lucide-react";
import useAuthRedirect from "@/hooks/use-auth-redirect";
import { LoadingPage } from "@/components/ui";

type OAuthApp = {
  id: string;
  name: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  image_url?: string;
};

export default function OAuthApps() {
  const [apps, setApps] = useState<OAuthApp[]>([]);
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const loadingAuth = useAuthRedirect();

  useEffect(() => { loadApps(); }, []);

  function showMessage(text: string, type: "success" | "error") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }

  async function loadApps() {
    try {
      const res = await api.get("oauth/apps/");
      setApps(res.data);
    } catch {
      showMessage("Falha ao carregar aplicações.", "error");
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  }

  async function createApp() {
    if (!name || !redirect || !image) return showMessage("Preencha todos os campos, incluindo a imagem.", "error");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("redirect_uri", redirect);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await api.post("oauth/apps/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApps(prev => [res.data, ...prev]);
      setName(""); setRedirect(""); setImage(null);
      showMessage("Aplicação criada com sucesso!", "success");
    } catch (err: any) {
      showMessage(err?.response?.data?.detail || "Erro ao criar app", "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteApp(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta aplicação?")) return;
    try {
      await api.delete(`oauth/apps/${id}/`);
      setApps(apps.filter(a => a.id !== id));
      showMessage("Aplicação removida.", "success");
    } catch {
      showMessage("Erro ao deletar.", "error");
    }
  }

  function copyToClipboard(text: string, fieldId: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(fieldId);
    setTimeout(() => setCopiedId(null), 2000);
  }

if (loadingAuth) return <LoadingPage />;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-12 font-sans selection:bg-sky-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* TOAST NOTIFICATION */}
        {message && (
          <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            message.type === "success" ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-red-500/10 border-red-500/50 text-red-400"}`}>
            {message.text}
          </div>
        )}

        {/* HEADER SECTION */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Developer Console
          </h1>
          <p className="text-slate-400 max-w-2xl">Gerencie suas credenciais OAuth e configure as URIs de redirecionamento para integração com nossa API.</p>
        </header>

        {/* CREATE APP CARD */}
        <section className="bg-slate-900/40 rounded-[2rem] border border-white/5 p-6 md:p-10 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-sky-500/10 blur-[80px] rounded-full group-hover:bg-sky-500/20 transition-all duration-700" />
          
          <div className="relative flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                <Plus size={24} />
              </div>
              <h2 className="font-bold text-xl md:text-2xl">Registrar Nova App</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-4 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Nome da App</label>
                <input
                  className="w-full bg-slate-800/50 border border-white/10 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="Ex: Meu App Incrível"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="lg:col-span-4 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Redirect URI</label>
                <input
                  className="w-full bg-slate-800/50 border border-white/10 text-white p-3.5 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="https://seu-site.com/callback"
                  value={redirect}
                  onChange={e => setRedirect(e.target.value)}
                />
              </div>

              <div className="lg:col-span-4 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Logotipo</label>
                <label className="flex items-center justify-center gap-2 w-full bg-slate-800/50 border border-dashed border-white/20 text-slate-400 p-3 rounded-xl hover:bg-slate-800 hover:border-sky-500/50 cursor-pointer transition-all">
                   <ImageIcon size={18} />
                   <span className="truncate">{image ? image.name : "Selecionar Imagem"}</span>
                   <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            <button
              onClick={createApp}
              disabled={loading}
              className="group relative ml-auto bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:hover:bg-sky-500 text-slate-950 font-bold py-3.5 px-8 rounded-2xl transition-all active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>Criar Credenciais <ShieldCheck size={18} /></>
              )}
            </button>
          </div>
        </section>

        {/* LIST APPS */}
        <div className="space-y-6">
            <h2 className="text-xl font-semibold px-2 flex items-center gap-2">
                Suas Aplicações <span className="text-sm font-normal text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{apps.length}</span>
            </h2>
            
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map(app => (
                <div
                key={app.id}
                className="group bg-slate-900/40 rounded-[2rem] border border-white/5 p-6 backdrop-blur-sm hover:border-sky-500/30 transition-all duration-300 flex flex-col gap-5 relative"
                >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {app.image_url ? (
                            <img src={app.image_url} alt={app.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400"><Globe size={20} /></div>
                        )}
                        <div>
                            <h3 className="font-bold text-lg leading-tight truncate max-w-[140px]">{app.name}</h3>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">OAuth 2.0 Client</p>
                        </div>
                    </div>
                    <button
                        onClick={() => deleteApp(app.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 ml-1">CLIENT ID</label>
                        <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl group/field">
                            <code className="text-xs text-sky-300 truncate mr-2">{app.client_id}</code>
                            <button onClick={() => copyToClipboard(app.client_id, app.id + 'id')} className="text-slate-500 hover:text-white transition-colors">
                                {copiedId === app.id + 'id' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 ml-1">CLIENT SECRET</label>
                        <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl group/field">
                            <code className="text-xs text-slate-400 truncate mr-2 italic">••••••••••••••••</code>
                            <button onClick={() => copyToClipboard(app.client_secret, app.id + 'sec')} className="text-slate-500 hover:text-white transition-colors">
                                {copiedId === app.id + 'sec' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                         <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5">
                            <Globe size={12} className="shrink-0" />
                            <span className="truncate italic">{app.redirect_uri}</span>
                         </div>
                    </div>
                </div>
                </div>
            ))}

            {apps.length === 0 && (
                <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-slate-500">
                    <p>Nenhuma aplicação encontrada.</p>
                </div>
            )}
            </section>
        </div>
      </div>
    </main>
  );
}