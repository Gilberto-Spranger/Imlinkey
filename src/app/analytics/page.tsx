"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import useAuthRedirect from "@/hooks/use-auth-redirect";
import { 
  TrendingUp, Users, MousePointer2, Globe, 
  ArrowUpRight, Share2, Ticket, ShoppingBag, 
  FileText, Download, Zap, Target, CreditCard,
  ChevronDown, Filter, CalendarDays, MoreVertical,
  ArrowDownRight, Smartphone
} from "lucide-react";

import { api } from "@/utils";
import { LoadingPage, Button } from "@/components/ui";

export default function CommercialAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const loadingAuth = useAuthRedirect();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/analytics/dashboard/");
        setStats(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-sky-500/20">
      <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">

        {/* --- GLOBAL COMMERCIAL HEADER --- */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6 border-b border-slate-800 pb-8">
          <div>
            <p className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-1">Performance</p>
            <h1 className="text-4xl font-extrabold text-white tracking-tighter flex items-center gap-3">
              Imlinkey <span className="text-slate-500 font-normal">Analytics</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-inner">
            <Button variant="ghost" className="text-xs font-semibold hover:bg-slate-800 text-slate-400 hover:text-white gap-2">
              <CalendarDays size={14} /> Este Mês <ChevronDown size={14} />
            </Button>
            <Button variant="ghost" className="text-xs font-semibold hover:bg-slate-800 text-slate-400 hover:text-white">
              <Filter size={14} className="mr-2" /> Filtrar
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-500 shadow-md font-bold text-xs uppercase tracking-widest px-6 rounded-lg">
              <Zap size={16} className="mr-2 fill-current" /> Atualizar
            </Button>
          </div>
        </header>

        {/* 1. KEY PERFORMANCE INDICATORS (KPIs) com Gráfico de Área */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard title="Cliques Totais" value={stats?.overview.total_clicks} icon={<MousePointer2 />} color="sky" data={[20, 35, 30, 50, 45, 70, 65, 90]} change="+15.2%" />
          <KpiCard title="Visitantes Únicos" value={stats?.overview.unique_visitors} icon={<Users />} color="purple" data={[10, 20, 25, 22, 35, 30, 40, 50]} change="+8.1%" />
          <KpiCard title="Taxa de Conversão" value={`${stats?.overview.conversion_rate}%`} icon={<Target />} color="emerald" data={[60, 62, 61, 65, 63, 68, 67, 70]} change="-0.5%" isNegative />
          <KpiCard title="Receita Estimada" value={`$${stats?.tickets.revenue + stats?.products.revenue}`} icon={<CreditCard />} color="amber" data={[30, 40, 60, 55, 80, 75, 100, 110]} change="+22.4%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* 2. ANÁLISE COMERCIAL PROFUNDA (TICKETS) */}
          <section className="lg:col-span-2 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-950 rounded-xl border border-emerald-800 text-emerald-400"><Ticket size={22}/></div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Performance de Eventos & Tickets</h2>
                  <p className="text-xs text-slate-500 font-medium">Faturamento e conversão de vendas</p>
                </div>
              </div>
              <Button variant="ghost" size="md" className="text-slate-600 hover:text-white hover:bg-slate-800"><MoreVertical size={20}/></Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-8">
              <CommercialMetric label="Tickets Vendidos" value={stats?.tickets.sold} change="+18%" />
              <CommercialMetric label="Taxa de Check-in" value={`${((stats?.tickets.check_ins / stats?.tickets.sold) * 100).toFixed(1)}%`} change="-2%" isNegative />
              <CommercialMetric label="Receita Líquida" value={stats?.tickets.revenue} isMoney change="+25%" />
            </div>

            {/* Gráfico de Área Comercial Suavizado */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
               <AreaChart color="#10b981" data={[30, 50, 40, 80, 60, 95, 70]} />
            </div>
          </section>

          {/* 3. RANKING DE PRODUTOS DIGITAIS */}
          <section className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <ShoppingBag size={20} className="text-amber-400"/> Top Produtos <span className="text-slate-600 text-xs">(Loja)</span>
            </h2>
            <div className="space-y-4">
              <ProductRow name="CV Templates" sales={142} revenue={1420} />
              <ProductRow name="Ingressos" sales={98} revenue={4900} />
              <ProductRow name="Verificação" sales={75} revenue={375} />
            </div>
          </section>
        </div>

        {/* 4. PERFORMANCE DE ATIVOS (CV & PERFIL) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AssetCard 
            title="Análise de Conversão CV Pro"
            subtitle="Views vs. Downloads de PDF"
            icon={<FileText className="text-rose-400" />}
            color="rose"
            metrics={[
              { label: "Visualizações", value: stats?.cv.views },
              { label: "Downloads", value: stats?.cv.downloads },
              { label: "Conv. Rate", value: "32.1%", isTag: true }
            ]}
            data={[20, 40, 35, 60, 55, 80, 75]}
          />

          <section className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center justify-between">
              Alcance do Perfil Público <Globe size={18} className="text-slate-600" />
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <ProfileStat label="Partilhas" value={stats?.profile.shares} icon={<Share2 />} color="sky" />
              <ProfileStat label="QR Code" value={stats?.profile.qr_scans} icon={<Smartphone />} color="purple" />
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}

// --- COMMERCIAL UI COMPONENTS ---

function KpiCard({ title, value, icon, color, data, change, isNegative }: any) {
  const colors: any = {
    sky: "text-sky-500", purple: "text-purple-500", emerald: "text-emerald-500", amber: "text-amber-500",
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="relative overflow-hidden p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl group">
      <div className="flex justify-between items-center mb-5 relative z-10">
        <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</h3>
        <div className={`p-2.5 rounded-lg bg-slate-800 border border-slate-700 ${colors[color]}`}>{icon}</div>
      </div>
      
      <div className="flex items-end justify-between relative z-10 mb-6">
        <p className="text-4xl font-extrabold text-white tracking-tighter">{value}</p>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isNegative ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
          {isNegative ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />} {change}
        </div>
      </div>
      
      {/* Área Chart Comercial Sutil de Fundo */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity">
        <AreaChart color={color === 'sky' ? '#0ea5e9' : color === 'purple' ? '#a855f7' : color === 'emerald' ? '#10b981' : '#f59e0b'} data={data} />
      </div>
    </motion.div>
  );
}

function CommercialMetric({ label, value, isMoney, change, isNegative }: any) {
  return (
    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 shadow-inner relative">
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-extrabold text-white tracking-tight">{isMoney ? `$${value?.toLocaleString('en-US', {minimumFractionDigits: 2})}` : value}</p>
      <div className={`absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isNegative ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'}`}>
         {change}
      </div>
    </div>
  );
}

function AssetCard({ title, subtitle, icon, metrics, color, data, className }: any) {
  return (
    <section className={`p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group ${className}`}>
      <div className="flex gap-5 mb-10 relative z-10">
        <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 items-end">
        {metrics.map((m:any, i:number) => (
          <div key={i} className={m.isTag ? 'bg-sky-950 p-4 rounded-xl border border-sky-800' : ''}>
            <p className={`${m.isTag ? 'text-sky-300' : 'text-slate-500'} text-xs font-semibold uppercase tracking-widest mb-1`}>{m.label}</p>
            <p className={`${m.isTag ? 'text-2xl text-white' : 'text-4xl text-white'} font-extrabold tracking-tighter`}>{m.value}</p>
          </div>
        ))}
      </div>
      
      {/* Gráfico de Área Suavizado */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
        <AreaChart color="#f43f5e" data={data} />
      </div>
    </section>
  );
}

function ProductRow({ name, sales, revenue }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
      <div>
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-slate-500">{sales} vendas</p>
      </div>
      <span className="text-sm font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
        + ${revenue.toLocaleString()}
      </span>
    </div>
  );
}

function ProfileStat({ label, value, icon, color }: any) {
  const colors: any = { sky: "text-sky-400", purple: "text-purple-400" };
  return (
    <div className="flex items-center gap-4 p-5 bg-slate-800/50 rounded-xl border border-slate-800 shadow-inner">
      <div className={`p-3 bg-slate-900 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// --- GÁFICO DE ÁREA COMERCIAL (SVG + FRAMER) ---

function AreaChart({ color, data }: { color: string; data: number[] }) {
  const maxValue = Math.max(...data);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / maxValue) * 100}`).join(" ");
  
  // Caminho da área (fecha a forma embaixo)
  const areaPath = `M0,100 L${points} L100,100 Z`;
  // Caminho da linha (apenas a linha de cima)
  const linePath = `M0,${100 - (data[0] / maxValue) * 100} L${points}`;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.6} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      
      {/* Área Preenchida com Gradiente */}
      <motion.path
        d={areaPath}
        fill={`url(#gradient-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Linha de Cima Animada */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
}