"use client";

import { Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { ConversionMetrics } from "@/types/affiliate.types";

interface AffiliateMissionsProps {
  metrics: ConversionMetrics | null;
  loading: boolean;
}

export function AffiliateMissions({ metrics, loading }: AffiliateMissionsProps) {
  // 1. Caso esteja carregando a API
  if (loading || !metrics) {
    return (
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-6 md:p-8 flex items-center justify-between h-full animate-pulse">
        <div className="space-y-3 w-2/3">
          <div className="h-3 bg-emerald-500/20 rounded w-1/4" />
          <div className="h-6 bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
        <div className="h-10 bg-emerald-500/20 rounded-2xl w-24" />
      </div>
    );
  }

  // 2. Mapeamento das regras de negócio com base no modelo 'ReferrerConversionMetric' do Django
  const clickTarget = 1000;
  const currentClicks = metrics.total_clicks || 0;
  const isDone = currentClicks >= clickTarget;

  return (
    <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 h-full relative overflow-hidden">
      
      <div className="flex flex-col w-full md:w-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            Missão do Sistema
          </span>
          {isDone && (
            <span className="flex items-center gap-1 text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
              <CheckCircle2 size={10} /> Concluída
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Target size={20} className="text-emerald-500 shrink-0" />
          Influenciador Inicial
        </h3>
        
        <p className="text-xs text-slate-400 mt-2 italic">
          Alcance {clickTarget.toLocaleString()} cliques no seu link de afiliado.
        </p>

        {/* Barra de Progresso Visual Reativa */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 mt-4 overflow-hidden border border-white/5">
          <motion.div 
            className="bg-emerald-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((currentClicks / clickTarget) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-[10px] font-bold text-slate-500 mt-1.5 text-right uppercase tracking-wider">
          {currentClicks.toLocaleString()} / {clickTarget.toLocaleString()} Cliques
        </div>
      </div>

      {/* Recompensa Dinâmica */}
      <div className="bg-emerald-500 text-[#020617] px-6 py-3 rounded-2xl font-black text-sm shrink-0 mt-2 md:mt-0 shadow-lg shadow-emerald-500/20 self-stretch md:self-auto flex items-center justify-center">
        {isDone ? "Nível Prata Ativo" : "+ Nível Prata"}
      </div>
    </section>
  );
}
