import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, Check, Calendar, DollarSign } from "lucide-react";

export const PLANOS = [
  { id: "free", title: "Free", price: 0, color: "text-slate-400" },
  { id: "basic", title: "Basic", price: 955, color: "text-emerald-400" },
  { id: "starter", title: "Starter", price: 1699, color: "text-sky-400" },
  { id: "student", title: "Student", price: 2000, color: "text-orange-400" },
  { id: "student_pro", title: "Student Pro", price: 2895, color: "text-yellow-400" },
  { id: "professional", title: "Professional", price: 3955, color: "text-indigo-400" },
  { id: "professional_pro", title: "Professional Pro", price: 5775, color: "text-rose-400" },
  { id: "business", title: "Business", price: 10679, color: "text-purple-400" }
];

export function RevenueCalculator({ settings }: { settings: any }) {
  const [totalSignedPlans, setTotalSignedPlans] = useState<number>(2);
  const [totalReferred, setTotalReferred] = useState<number>(50);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("professional");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Regra de Negócio: 5.1% da assinatura mensal vai para o afiliado
  const affiliateCommissionRate = 5.1 / 100;

  const currentPlan = PLANOS.find(p => p.id === selectedPlanId) || PLANOS[1];
  const ticket = currentPlan.price;

  // Cálculo Mensal Total
  const calculateMonthlyRevenue = () => {
    const totalMonthlyGross = (totalSignedPlans * ticket) * totalReferred;
    return totalMonthlyGross * affiliateCommissionRate;
  };

  // Projeção Anual Total
  const calculateAnnualRevenue = () => {
    return calculateMonthlyRevenue() * 12;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(settings?.language || 'pt-BR', {
      style: 'currency', 
      currency: settings?.currency || 'BRL'
    }).format(val);
  };

  const monthlyEarnings = calculateMonthlyRevenue();
  const annualEarnings = calculateAnnualRevenue();

  return (
    <section className="p-6 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-900/10 to-transparent border border-emerald-500/10 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Calculator size={140} className="text-emerald-500" />
      </div>
      
      <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">
        Projeção e Simulação Mensal e Anual
      </div>
      <h3 className="text-2xl font-black text-white mb-8 relative z-10 flex items-center gap-3">
        Simulador de lucros por Afiliados <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/30">Beta</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* COLUNA DOS CONTROLES (SLIDERS / DROPDOWN) */}
        <div className="space-y-6 lg:col-span-7 w-full">
          
          {/* SELETOR DE PLANOS MENSAL */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Selecionar Assinatura Mensal
            </label>
            
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-[#020617] text-slate-200 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/50 font-medium flex items-center justify-between transition-colors shadow-inner"
            >
              <span className="flex items-center gap-2 text-left">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 bg-current ${currentPlan.color}`} />
                <span>{currentPlan.title} — <span className="text-emerald-400">{formatCurrency(currentPlan.price)}/mês</span></span>
              </span>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 w-full mt-2 bg-[#090d1f] border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
                >
                  {PLANOS.map((plano) => (
                    <li key={plano.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlanId(plano.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between hover:bg-white/5 ${
                          selectedPlanId === plano.id ? "bg-emerald-500/10 text-white" : "text-slate-300"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full bg-current ${plano.color}`} />
                          <span>{plano.title}</span>
                          <span className="text-slate-500 text-xs">— {formatCurrency(plano.price)}/mês</span>
                        </span>
                        {selectedPlanId === plano.id && <Check size={14} className="text-emerald-400" />}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* PLANOS ASSINADOS POR MÊS */}
          <div>
            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <span>Total de Planos Assinados no mês</span>
              <span className="text-emerald-400 font-mono font-bold">{totalSignedPlans}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="1" 
              value={totalSignedPlans} 
              onChange={(e) => setTotalSignedPlans(Number(e.target.value))} 
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
            />
          </div>

          {/* TOTAL DE AFILIADOS */}
          <div>
            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <span>Total de Afiliados Ativos</span>
              <span className="text-emerald-400 font-mono font-bold">{totalReferred}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="1000000" 
              step="1" 
              value={totalReferred} 
              onChange={(e) => setTotalReferred(Number(e.target.value))} 
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </div>

        {/* COLUNA DE CARD DE RESULTADOS EXCLUSIVOS */}
        <div className="lg:col-span-5 w-full flex flex-col p-6 md:p-8 bg-[#020617] rounded-3xl border border-white/5 shadow-2xl shadow-emerald-900/20 space-y-6">
          <div className="text-center border-b border-white/5 pb-4 w-full">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Comissões Acumuladas</p>
            <div className="inline-flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] font-semibold text-slate-400 bg-slate-900/50 border border-white/5 px-3 py-1 rounded-full">
              <span>Ref: <strong className="text-emerald-400">5.1%</strong></span>
              <span className="text-slate-600">|</span>
              <span>Indicação: <strong className="text-emerald-400">0.9%</strong></span>
              <span className="text-slate-600">|</span>
              <span>Imlinkey: <strong className="text-slate-300">94%</strong></span>
            </div>
          </div>
          
          {/* Ganhos Mensais */}
          <div className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-400" /> Ganhos Mensais por Comissão
            </span>
            <motion.h4 
              key={`monthly-${monthlyEarnings}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-500 tracking-tighter break-all"
            >
              {formatCurrency(monthlyEarnings)}
            </motion.h4>
          </div>

          {/* Ganhos Anuais */}
          <div className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-400" /> Ganhos Anuais por Comissão
            </span>
            <motion.h4 
              key={`annual-${annualEarnings}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-500 tracking-tighter break-all"
            >
              {formatCurrency(annualEarnings)}
            </motion.h4>
          </div>
        </div>
      </div>
    </section>
  );
}
