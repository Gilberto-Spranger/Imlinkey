import { Gift, FileText, Download } from "lucide-react";
import { ReferralRewardData } from "../../types/affiliate.types";

interface Props {
  rewards: ReferralRewardData[];
  loading: boolean;
  settings: any;
}

export function FinancialHistory({ rewards, loading, settings }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(settings?.language || 'pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(settings?.language || 'pt-BR', {
      style: 'currency', currency: settings?.currency || 'USD'
    }).format(val);
  };

  if (loading) {
    return (
      <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-4">
        <div className="h-8 w-48 animate-pulse bg-white/5 rounded-lg mb-8" />
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 animate-pulse bg-white/5 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <section className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 h-full relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Logs & Faturas</div>
          <h4 className="text-white font-black text-2xl">Histórico Financeiro</h4>
        </div>
        <button className="flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-white/10 shadow-lg w-full md:w-auto">
          <Download size={14} /> EXPORTAR CSV
        </button>
      </div>
      
      {rewards.length === 0 ? (
        <p className="text-sm text-slate-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
          Nenhuma transação registada ainda.
        </p>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="pb-4">Transação</th>
                <th className="pb-4">Origem (Fatura)</th>
                <th className="pb-4 text-center">Status</th>
                <th className="pb-4 text-right">Montante</th>
                <th className="pb-4 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rewards.map((reward) => (
                <tr key={reward.id} className="group hover:bg-white/[0.04] transition-colors">
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-xs mb-1">Comissão de Indicação</p>
                        <p className="font-mono text-[10px] text-slate-500 tracking-wider">ID: {reward.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 font-mono text-[11px] text-slate-400 font-bold uppercase tracking-wider">{reward.billing_event.substring(0, 8)}</td>
                  <td className="py-5 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      reward.status === 'approved' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" :
                      reward.status === 'pending' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]" :
                      "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                    }`}>
                      {reward.status === 'approved' ? "Aprovado" : reward.status === 'pending' ? "Pendente" : "Recusado"}
                    </span>
                  </td>
                  <td className="py-5 text-right font-black text-white text-base">{formatCurrency(reward.amount)}</td>
                  <td className="py-5 text-right text-slate-500 text-[11px] font-bold">{formatDate(reward.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
