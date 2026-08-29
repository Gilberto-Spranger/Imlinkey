import { motion } from "framer-motion";
import { ConversionMetrics as Metrics } from "../../types/affiliate.types";

interface Props {
  metrics: Metrics | null;
  loading: boolean;
}

export function ConversionMetrics({ metrics, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse bg-white/5 rounded-[2.5rem] border border-white/10" />
        ))}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Cliques Totais</div>
        <div className="text-4xl lg:text-5xl font-black italic my-4">{metrics?.total_clicks?.toLocaleString() || '0'}</div>
        <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">+14% vs ontem</div>
      </div>
      <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Taxa de Conversão</div>
        <div className="text-4xl lg:text-5xl font-black italic my-4">{((metrics?.overall_conversion_rate || 0) * 100).toFixed(1)}%</div>
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Acima da média</div>
      </div>
    </section>
  );
}
