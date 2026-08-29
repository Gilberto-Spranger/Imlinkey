import { motion } from "framer-motion";
import { DashboardStats as Stats, UserSettings } from "../../types/affiliate.types";

interface Props {
  stats: Stats | null;
  settings: UserSettings | null;
  loading: boolean;
}

export function DashboardStats({ stats, settings, loading }: Props) {
  const formatValue = (value: number | undefined) => {
    if (value === undefined) return "—";
    return new Intl.NumberFormat(settings?.language || "pt-BR", {
      style: "currency",
      currency: settings?.currency || "USD",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="h-full min-h-[300px] animate-pulse bg-white/5 rounded-[2.5rem] border border-white/10" />
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-[#020617] to-indigo-950/30 border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden shadow-2xl">
       <div className="absolute top-0 right-0 p-8 opacity-5">
         <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-300"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
       </div>
       <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px]">Performance em Tempo Real</span>
       </div>
       <div className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-10 text-white">
         <span className="block text-slate-500 text-lg md:text-2xl font-bold tracking-normal mb-2 uppercase">Receita Total</span>
         {formatValue(stats?.total_accumulated)}
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-auto relative z-10">
         <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
           <div className="text-emerald-400/80 text-[10px] font-black uppercase tracking-widest mb-1">Hoje</div>
           <div className="text-xl md:text-3xl font-black text-emerald-400">+{formatValue(stats?.today_earnings)}</div>
         </div>
         <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
           <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Mês</div>
           <div className="text-xl md:text-3xl font-black text-white">{formatValue(stats?.month_earnings)}</div>
         </div>
         <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
           <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Saldo</div>
           <div className="text-xl md:text-3xl font-black text-slate-300">{formatValue(stats?.available_balance)}</div>
         </div>
         <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
           <div className="text-indigo-400/80 text-[10px] font-black uppercase tracking-widest mb-1">Previsão</div>
           <div className="text-xl md:text-3xl font-black text-indigo-400">{formatValue(stats?.next_month_forecast)}</div>
         </div>
       </div>
    </div>
  );
}
