import { motion } from "framer-motion";
import { Trophy, Star, Shield, Crown } from "lucide-react";

export function LevelSystem() {
  const currentXP = 3450;
  const nextLevelXP = 5000;
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <section className="p-8 md:p-10 h-full rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 relative overflow-hidden flex flex-col justify-between gap-6">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 pointer-events-none">
        <Crown size={180} />
      </div>
      
      <div className="flex justify-between items-start z-10">
        <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">Nível Atual: Ouro</div>
        <div className="text-amber-500/80 text-[10px] font-bold tracking-widest uppercase">{currentXP} / {nextLevelXP} XP</div>
      </div>
      
      <div className="z-10">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Próximo Nível</div>
        <div className="text-3xl md:text-4xl font-black mb-4 text-white drop-shadow-md">Platina Elite</div>
        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
          >
            <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]" />
          </motion.div>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 leading-relaxed z-10">
        Alcance o nível Platina para desbloquear o distintivo de Elite e aumentar sua comissão base para <span className="text-amber-400 font-bold">25%</span> em todas as vendas.
      </div>
    </section>
  );
}
