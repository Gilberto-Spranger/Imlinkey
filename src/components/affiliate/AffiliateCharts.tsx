import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface Props {
  data: any[];
  loading: boolean;
}

export function AffiliateCharts({ data, loading }: Props) {
  if (loading) {
    return <div className="h-[300px] w-full animate-pulse bg-white/5 rounded-3xl" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-white/[0.01] rounded-3xl border border-white/5 text-slate-500">
        Sem dados suficientes para o gráfico
      </div>
    );
  }

  return (
    <section className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Métricas de Crescimento</div>
          <h3 className="text-2xl font-black text-white">Evolução de Receita</h3>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-white/10 text-white">6 Meses</button>
          <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg text-slate-400 hover:text-white transition-colors">1 Ano</button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#10b981', fontWeight: '900' }}
              labelStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: "#10b981", stroke: "#0f172a", strokeWidth: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
