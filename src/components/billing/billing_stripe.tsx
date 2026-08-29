"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Crown, Zap, UserCircle, Loader2, Check,
  BookOpen, Briefcase, Star, Building2, MousePointer2
} from "lucide-react";

import { Button, ImlinkeyAlert, LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import { useTheme } from "@/hooks/use-theme";
import { ThemePreference } from "@/hooks/use-account-settings";

// --- Planos ---
const PLANS = [
  { id: "free", title: "Free", price: 0, icon: UserCircle, color: "text-slate-400", features: ["Acesso imediato sem download", "Perfil público básico, limitado", "Experiência inicial da plataforma"] },
  { id: "basic", title: "Basic", price: 0.80, icon: MousePointer2, color: "text-emerald-400", features: ["Até 2 downloads de CV por mês", "Perfil profissional com 2 links clicáveis", "Acesso aos recursos essenciais"] },
  { id: "starter", title: "Starter", price: 1.65, icon: Zap, color: "text-sky-400", features: ["Até 4 downloads de CV por mês", "Perfil aprimorado com 3 links clicáveis", "Ferramentas iniciais de gestão"] },
  { id: "student", title: "Student", price: 2, icon: BookOpen, color: "text-orange-400", features: ["Até 6 downloads de CV por mês", "Interface melhorada e 5 links clicáveis", "Trabalhos escolares (6 pág / 4 transf. mês)", "2 Layouts profissionais para trabalhos"] },
  { id: "student_pro", title: "Student Pro", price: 2.95, icon: Star, color: "text-yellow-400", features: ["Até 10 downloads de CV por mês", "Perfil sofisticado (6 links + fundo custom)", "Trabalhos (15 pág / transf. ilimitadas)", "5 Layouts profissionais para trabalhos"] },
  { id: "professional", title: "Professional", price: 3.69, icon: Briefcase, color: "text-indigo-400", features: ["8 downloads de CV a cada 2 semanas", "Interface profissional com 8 links clicáveis", "Ferramentas avançadas de apresentação"] },
  { id: "professional_pro", title: "Professional Pro", price: 5.65, icon: Crown, color: "text-rose-400", features: ["8 downloads de CV por semana", "Premium (10 links + fundo custom)", "Venda de tickets (6 eventos / 5.000 un.)", "Cartas e Contratos (8 downloads/semana)", "Portfólio profissional"] },
  { id: "business", title: "Business", price: 10, icon: Building2, color: "text-purple-400", features: ["Downloads ILIMITADOS (CV e Docs)", "Links ilimitados + Vídeo de fundo", "Eventos e Ingressos SEM LIMITES", "Análises avançadas e Chat com clientes", "Selo de Verificação Corporativa"] }
];

export default function Billing_Stripe({ country }: { country: string }) {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState("free");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileState, setProfile] = useState<any>(null);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // --- Usa o theme do settings ---
  useTheme((settings?.theme_preference || "dark") as ThemePreference);

  const loadBillingData = useCallback(async () => {
    try {
      setLoading(true);
      const [profRes, settRes] = await Promise.all([
        api.get("/billing/role/"),
        api.get("/account_settings/")
      ]);

      const profileData = profRes.data;
      const settingsData = Array.isArray(settRes.data) ? settRes.data[0] : settRes.data;

      setProfile(profileData);
      setSettings(settingsData);

      const now = new Date();
      const expirationDate = profileData.plan_expires_at ? new Date(profileData.plan_expires_at) : null;
      const isPlanActive = expirationDate && expirationDate > now;

      if (isPlanActive && profileData.role) {
        setSelectedPlanId(profileData.role.toLowerCase());
      } else {
        setSelectedPlanId("free");
      }
    } catch (err) {
      console.error(err);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { loadBillingData(); }, [loadBillingData]);

  const selectedPlan = useMemo(() => PLANS.find(p => p.id === selectedPlanId) || PLANS[0], [selectedPlanId]);

  const isSelectedPlanActive = useMemo(() => {
    if (!profileState || !selectedPlanId) return false;
    const now = new Date();
    const expirationDate = profileState.plan_expires_at ? new Date(profileState.plan_expires_at) : null;
    return profileState.role?.toLowerCase() === selectedPlanId && expirationDate && expirationDate > now;
  }, [profileState, selectedPlanId]);

  const formatCurrency = (value: number) => {
    const currencyCode = settings?.currency || "AOA";
    return new Intl.NumberFormat(settings?.language === "pt" ? "pt-AO" : "en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleCheckout = useCallback(async () => {
    if (!selectedPlan || selectedPlan.price === 0 || isSelectedPlanActive) return;
    try {
      setProcessing(true);
      const { data } = await api.post("/billing/create-intent/", {
        plan: selectedPlan.id,
        currency: settings?.currency?.toLowerCase(),
        ref_code: ""
      });

      if (data.clientSecret) {
        router.push(`/payments/${country}/billing/checkout?session=${data.clientSecret}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Erro no processamento.";
      setAlert({ message: msg, type: "error" });
    } finally {
      setProcessing(false);
    }
  }, [selectedPlan, router, settings, isSelectedPlanActive, country]);

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {alert && (
        <ImlinkeyAlert
          message={alert.message}
          type={alert.type}
          duration={3000}
          onClose={() => setAlert(null)}
        />
      )}

      <main className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-2">
            Planos de Assinatura <span className="text-emerald-400">Imlinkey</span>
          </h1>
          <p className="text-foreground/60">Gerencie sua assinatura e recursos premium.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PLANOS */}
          <div className="lg:col-span-8 space-y-4">
            {PLANS.map((plan) => {
              const now = new Date();
              const expirationDate = profileState?.plan_expires_at ? new Date(profileState.plan_expires_at) : null;
              const isActive = profileState?.role?.toLowerCase() === plan.id && expirationDate && expirationDate > now;

              return (
                <motion.div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all
                    ${selectedPlanId === plan.id
                      ? "border-emerald-400 bg-emerald-400/5 ring-1 ring-emerald-400/20"
                      : "border-foreground/10 bg-foreground/5"
                    }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-foreground/10 ${plan.color}`}>
                        <plan.icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {plan.title}
                          {isActive && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              PLANO ATUAL
                            </span>
                          )}
                        </h3>
                        <div className="mt-2 space-y-1">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-foreground/60">
                              <Check size={14} className="text-emerald-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black">{formatCurrency(plan.price)}</span>
                      <p className="text-[10px] text-foreground/50 uppercase tracking-widest">por mês</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RESUMO */}
          <aside className="lg:col-span-4">
            <div className="sticky top-10 p-8 rounded-3xl bg-foreground/5 border border-foreground/10 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-6">Resumo</h2>

              <div className="flex justify-between mb-2 text-foreground/60">
                <span>Plano selecionado</span>
                <span className="font-bold">{selectedPlan?.title}</span>
              </div>

              <div className="text-4xl font-black text-foreground mb-8">
                {formatCurrency(selectedPlan?.price || 0)}
                <span className="text-sm font-normal text-foreground/50 ml-1">/mês</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={processing || isSelectedPlanActive || selectedPlan?.price === 0}
                className={`w-full py-6 rounded-2xl text-lg font-bold transition-all
                  ${isSelectedPlanActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-not-allowed"
                    : "bg-emerald-400 hover:bg-emerald-500 text-white"
                  }`}
              >
                {processing ? <Loader2 className="animate-spin" /> : isSelectedPlanActive ? "Plano Ativo" : "Confirmar Assinatura"}
              </Button>

              {isSelectedPlanActive && profileState?.plan_expires_at && (
                <p className="mt-4 text-center text-xs text-foreground/50 uppercase tracking-tighter">
                  Válido até: {new Date(profileState.plan_expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}