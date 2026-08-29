"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Award, AlertCircle } from "lucide-react";
import { api } from "@/utils/api";
import { LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// Components
import { DashboardStats } from "@/components/affiliate/DashboardStats";
import { ConversionMetrics } from "@/components/affiliate/ConversionMetrics";
import { AffiliateCharts } from "@/components/affiliate/AffiliateCharts";
import { ReferredUsersTable } from "@/components/affiliate/ReferredUsersTable";
import { FinancialHistory } from "@/components/affiliate/FinancialHistory";
import { SharingTools } from "@/components/affiliate/SharingTools";
import { LevelSystem } from "@/components/affiliate/LevelSystem";
import { RevenueCalculator } from "@/components/affiliate/RevenueCalculator";
import { AffiliateMissions } from "@/components/affiliate/AffiliateMissions";

// Types
import { 

  ReferrerData, 

  ReferredUserData, 
  ReferralRewardData, 
  UserSettings,
  DashboardStats as DashboardStatsType,
  ConversionMetrics as ConversionMetricsType
} from "@/types/affiliate.types";

export default function AffiliatePage() {
  const loadingAuth = useAuthRedirect();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<ReferrerData | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType | null>(null);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetricsType | null>(null);
  const [chartsData, setChartsData] = useState<any[]>([]);
  const [referredUsers, setReferredUsers] = useState<ReferredUserData[]>([]);
  const [rewards, setRewards] = useState<ReferralRewardData[]>([]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        refRes, setRes, referralsRes, rewardsRes, dashboardRes, analyticsRes, chartsRes
      ] = await Promise.all([
        api.get("/referrers/"),
        api.get("/account_settings/"),
        api.get("/my-referrals/"),
        api.get("/rewards/"),
        api.get("/referrers/dashboard/"),
        api.get("/referrers/analytics/"),
        api.get("/referrers/charts/")
      ]);
      
      const refData = Array.isArray(refRes.data) ? refRes.data[0] : null;
      const setData = Array.isArray(setRes.data) ? setRes.data[0] : null;
      
      if (refData) setStats(refData);
      else setError("Perfil de afiliado não encontrado.");
      
      if (setData) setSettings(setData);
      
      setReferredUsers(Array.isArray(referralsRes.data) ? referralsRes.data : []);
      setRewards(Array.isArray(rewardsRes.data) ? rewardsRes.data : []);
      setDashboardStats(dashboardRes.data);
      setConversionMetrics(analyticsRes.data);
      setChartsData(Array.isArray(chartsRes.data) ? chartsRes.data : []);
      
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha na conexão com o servidor de comissões.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitialData();
  }, [loadInitialData]);

  if (loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-12 font-sans">
      <main className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 shrink-0 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5 border border-white/10 overflow-hidden">
              <img src="https://imlinkey.store/favicon.png" alt="Imlinkey Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
              IMLINKEY <span className="text-slate-500 font-medium tracking-normal text-sm md:text-base ml-2 uppercase italic">Partners</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full pl-5 pr-1 border border-white/10">
              <span className="text-xs md:text-sm font-bold text-white">Afiliado Mestre</span>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-700 border border-slate-600 overflow-hidden flex items-center justify-center">
                <img src="https://picsum.photos/seed/user/100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/20 flex flex-col items-center text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <p className="text-slate-400 mb-6">{error}</p>
            <button onClick={loadInitialData} className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all">
              Tentar Novamente
            </button>
          </div>
        ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 md:row-span-2">
              <DashboardStats stats={dashboardStats} settings={settings} loading={loading} />
            </div>
            
            <div className="md:col-span-4 md:row-span-2 flex">
              <div className="w-full h-full">
                <LevelSystem />
              </div>
            </div>

            <div className="md:col-span-12 md:row-span-1">
              <SharingTools 
                referralCode={stats?.referral_code} 
                referralUrl={stats?.referral_url} 
                loading={loading} 
              />
            </div>

            <div className="md:col-span-7 md:row-span-3 flex">
              <div className="w-full h-full">
                <ReferredUsersTable users={referredUsers} loading={loading} settings={settings} />
              </div>
            </div>

            <div className="md:col-span-5 md:row-span-3 flex flex-col gap-4">
              <div className="flex-1">
                <ConversionMetrics metrics={conversionMetrics} loading={loading} />
              </div>
              <div className="h-auto shrink-0">
                <AffiliateMissions metrics={conversionMetrics} loading={loading} />
              </div>
            </div>

            <div className="md:col-span-6 flex">
              <div className="w-full h-full">
                <AffiliateCharts data={chartsData} loading={loading} />
              </div>
            </div>

            <div className="md:col-span-6 flex">
              <div className="w-full h-full">
                <RevenueCalculator settings={settings} />
              </div>
            </div>

            <div className="md:col-span-12">
              <FinancialHistory rewards={rewards} loading={loading} settings={settings} />
            </div>
          </div>

          <footer className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0 gap-4">
            <div className="flex gap-8 items-center">
              <span>Última atualização: agora mesmo</span>
              <span className="text-slate-700">ID: AF-{stats?.referral_code || "000"}</span>
            </div>
            <div className="flex gap-6 items-center">
              <button className="hover:text-white cursor-pointer transition-colors">Termos do Programa</button>
              <button className="hover:text-white cursor-pointer transition-colors">Suporte 24/7</button>
            </div>
          </footer>
        </>
        )}
      </main>
    </div>
  );
}
