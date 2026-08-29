"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils";
import { LoadingPage, Button } from "@/components/ui";
import { Trash2, LogOut, RefreshCcw, ShieldAlert, AlertTriangle } from "lucide-react";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// Componente simples de Modal para manter a UI coesa
const DangerModal = ({ isOpen, onClose, onConfirm, title, description, loading, confirmText, requireInput = false }: any) => {
  const [inputValue, setInputValue] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md border border-white/10 bg-[#0f172a] p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <p className="text-white/70 mb-6 text-sm leading-relaxed">{description}</p>
        
        {requireInput && (
          <div className="mb-6">
            <p className="text-xs text-white/40 mb-2 font-mono">Digite "DELETAR" para confirmar:</p>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:border-red-500 outline-none transition-all"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:text-white transition-colors">Cancelar</button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={loading || (requireInput && inputValue !== "DELETAR")}
          >
            {loading ? "Processando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function DangerZone() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const loadingAuth = useAuthRedirect();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/check/", { withCredentials: true });
        if (!res.data.authenticated) router.replace("/auth");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleAction = async (endpoint: string, method: 'post' | 'delete', redirect?: string) => {
    setLoadingAction(true);
    try {
      await api[method](endpoint, { withCredentials: true });
      if (redirect) router.replace(redirect);
      setActiveModal(null);
    } catch (err) {
      alert("Erro ao processar solicitação.");
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading || loadingAuth) return <LoadingPage />;

  return (
    <main className="min-h-screen bg-[#020617] p-6 flex flex-col items-center justify-center text-white font-sans">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-12">
          <div className="inline-block p-3 rounded-2xl bg-red-500/10 text-red-500 mb-4">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Danger Zone</h1>
          <p className="text-white/50 mt-2">Ações irreversíveis e críticas de segurança.</p>
        </header>

        <div className="grid gap-4">
          {/* Card: Encerrar Sessões */}
          <div className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><LogOut size={18} /> Sessões Ativas</h3>
              <p className="text-sm text-white/40">Desconectar sua conta de todos os outros navegadores.</p>
            </div>
            <Button variant="outline" className="border-white/10" onClick={() => setActiveModal('sessions')}>Encerrar</Button>
          </div>

          {/* Card: Resetar Dados */}
          <div className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><RefreshCcw size={18} /> Resetar Dados</h3>
              <p className="text-sm text-white/40">Limpar todo o conteúdo sem excluir o seu perfil.</p>
            </div>
            <Button variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10" onClick={() => setActiveModal('reset')}>Resetar</Button>
          </div>

          {/* Card: Deletar Conta */}
          <div className="flex items-center justify-between p-5 rounded-xl border border-red-500/20 bg-red-500/[0.02] hover:bg-red-500/[0.05] transition-all">
            <div>
              <h3 className="font-semibold text-red-500 flex items-center gap-2"><Trash2 size={18} /> Exclusão Permanente</h3>
              <p className="text-sm text-white/40">Apagar sua conta e todos os dados de forma definitiva.</p>
            </div>
            <Button variant="destructive" onClick={() => setActiveModal('delete')}>Delete</Button>
          </div>
        </div>
      </div>

      {/* Modais de Confirmação */}
      <DangerModal 
        isOpen={activeModal === 'sessions'}
        onClose={() => setActiveModal(null)}
        title="Encerrar Sessões?"
        description="Isso fará com que você seja desconectado de todos os aparelhos, exceto este atual."
        confirmText="Encerrar Sessões"
        loading={loadingAction}
        onConfirm={() => handleAction('/auth/sessions/terminate-all/', 'post')}
      />

      <DangerModal 
        isOpen={activeModal === 'reset'}
        onClose={() => setActiveModal(null)}
        title="Resetar sua conta?"
        description="Esta ação limpará todas as suas preferências e dados salvos. Seu usuário continuará existindo, mas vazio."
        confirmText="Resetar Tudo"
        loading={loadingAction}
        onConfirm={() => handleAction('/account/reset-data/', 'post')}
      />

      <DangerModal 
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Adeus é para sempre?"
        description="Esta ação é irreversível. Todos os seus dados serão destruídos imediatamente de nossos servidores."
        confirmText="Deletar Permanentemente"
        requireInput={true}
        loading={loadingAction}
        onConfirm={() => handleAction('/auth/delete_account/', 'delete', '/auth')}
      />
    </main>
  );
}