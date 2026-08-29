"use client";

import { useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import { User, Globe, ShieldCheck, Activity, Check, Loader2, Link } from "lucide-react";
import { Button, LoadingPage, Select, ImlinkeyAlert } from "@/components/ui";
import { api } from "@/utils";
import { useTheme } from "@/hooks/use-theme";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// --- Tipagens Estritas ---
type Role = "user" | "artist" | "organizer";
type Status = "online" | "offline";
type AccountStatus = "active" | "suspended" | "banned";
type Language = "pt" | "zh" | "de" | "fr" | "it" | "en" | "hu";
type Currency = "AOA" | "BRL" | "CNY" | "EUR" | "GBP" | "HUF" | "USD" | "ZAR";
type Country = "AO" | "BR" | "CN" | "DE" | "FR" | "IT" | "GB" | "HU" | "US" | "ZA";
type ThemePreference = "light" | "dark" | "system";

interface AccountSettingsData {
  id: string;
  user_id: string;
  role: Role;
  status: Status;
  account_status: AccountStatus;
  timezone_str: string;
  language: Language;
  currency: Currency;
  country: Country;
  theme_preference: ThemePreference;
  two_factor_enabled: boolean;
  last_signin: string | null;
}

export default function AccountSettings() {
  const [settings, setSettings] = useState<AccountSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const loadingAuth = useAuthRedirect();

  useTheme(settings?.theme_preference ?? "system");

  const options = useMemo(() => ({
    timezones: [
      { label: "(GMT+00:00) Lisbon", value: "Europe/Lisbon" },
      { label: "(GMT+01:00) Luanda", value: "Africa/Luanda" },
      { label: "(GMT-03:00) São Paulo", value: "America/Sao_Paulo" },
      { label: "(GMT+08:00) Beijing", value: "Asia/Shanghai" },
      { label: "(GMT+01:00) Berlin", value: "Europe/Berlin" },
      { label: "(GMT+01:00) Paris", value: "Europe/Paris" },
      { label: "(GMT+01:00) Rome", value: "Europe/Rome" },
      { label: "(GMT+00:00) London", value: "Europe/London" },
      { label: "(GMT+01:00) Budapest", value: "Europe/Budapest" },
      { label: "(GMT-05:00) New York", value: "America/New_York" },
      { label: "(GMT+02:00) Johannesburg", value: "Africa/Johannesburg" },
    ],
    countries: [
      { label: "Portugal", value: "PT" },
      { label: "Angola", value: "AO" },
      { label: "Brasil", value: "BR" },
      { label: "China", value: "CN" },
      { label: "Alemanha", value: "DE" },
      { label: "França", value: "FR" },
      { label: "Itália", value: "IT" },
      { label: "Reino Unido", value: "GB" },
      { label: "Hungria", value: "HU" },
      { label: "Estados Unidos", value: "US" },
      { label: "África do Sul", value: "ZA" },
    ],
    languages: [
      { label: "Portuguese", value: "pt" },
      { label: "Chinese", value: "zh" },
      { label: "German", value: "de" },
      { label: "French", value: "fr" },
      { label: "Italian", value: "it" },
      { label: "English", value: "en" },
      { label: "Hungarian", value: "hu" },
    ],
    currencies: [
      { label: "AOA - Kwanza", value: "AOA" },
      { label: "BRL - Real", value: "BRL" },
      { label: "CNY - Yuan", value: "CNY" },
      { label: "EUR - Euro", value: "EUR" },
      { label: "GBP - Pound", value: "GBP" },
      { label: "HUF - Forint", value: "HUF" },
      { label: "USD - Dollar", value: "USD" },
      { label: "ZAR - Rand", value: "ZAR" },
    ]
  }), []);

  const handleUpdate = useCallback((updates: Partial<AccountSettingsData>) => {
    setSettings((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const detectDeviceSettings = useCallback(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = window.navigator.language || "en-US";
      const [langPart, countryPart] = locale.split("-");
      
      const countryCode = (countryPart?.toUpperCase() || "US") as Country;
      const langCode = (langPart || "en") as Language;

      const currencyMap: Record<string, Currency> = {
        "Africa/Luanda": "AOA",
        "America/Sao_Paulo": "BRL",
        "Asia/Shanghai": "CNY",
        "Europe/London": "GBP",
        "Africa/Johannesburg": "ZAR",
        "Europe/Berlin": "EUR",
        "Europe/Paris": "EUR",
        "Europe/Budapest": "HUF"
      };

      handleUpdate({
        timezone_str: timezone,
        language: langCode,
        country: countryCode,
        currency: currencyMap[timezone] || "USD"
      });

      setAlert({ message: "Preferências sincronizadas com o navegador!", type: "success" });
    } catch (e) {
      setAlert({ message: "Não foi possível detectar sua localização.", type: "error" });
    }
  }, [handleUpdate]);

  const loadSettings = useCallback(async () => {
    try {
      const { data } = await api.get<AccountSettingsData[]>("/account_settings/");
      const raw = Array.isArray(data) ? data[0] : data;
      setSettings(raw);
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.put(`/account_settings/${settings.id}/`, settings);
      setAlert({ message: "Configurações salvas com sucesso!", type: "success" });
    } catch (err) {
      setAlert({ message: "Erro ao salvar no servidor.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {alert && (
        <ImlinkeyAlert
          message={alert.message}
          type={alert.type}
          duration={3000}
          onClose={() => setAlert(null)}
        />
      )}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">
              Configurações <span className="text-primary">de Conta</span>
            </h1>
            <p className="text-slate-500">Gerencie sua experiência regional e de sistema.</p>
          </div>
          <Button 
            onClick={detectDeviceSettings}
            variant="outline"
            className="flex items-center gap-2 border-dashed border-primary text-primary hover:bg-primary/10 transition-all"
          >
            <Link size={16} /> Imlinkey
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Perfil & Status" icon={<User size={24} />} color="text-sky-400">
            <Select
              label="Função"
              value={settings.role}
              onChange={(v) => handleUpdate({ role: v as Role })}
              options={[
                { label: "Usuário", value: "user" },
                { label: "Artista", value: "artist" },
                { label: "Organizador", value: "organizer" },
              ]}
            />
            <Select
              label="Disponibilidade"
              value={settings.status}
              onChange={(v) => handleUpdate({ status: v as Status })}
              options={[
                { label: "Online", value: "online" },
                { label: "Offline", value: "offline" },
              ]}
            />
          </Card>

          <Card title="Regional" icon={<Globe size={24} />} color="text-emerald-400">
            <Select
              label="País"
              value={settings.country}
              onChange={(v) => handleUpdate({ country: v as Country })}
              options={options.countries}
            />
            <Select
              label="Idioma"
              value={settings.language}
              onChange={(v) => handleUpdate({ language: v as Language })}
              options={options.languages}
            />
            <Select
              label="Moeda Principal"
              value={settings.currency}
              onChange={(v) => handleUpdate({ currency: v as Currency })}
              options={options.currencies}
            />
            <Select
              label="Fuso Horário"
              value={settings.timezone_str}
              onChange={(v) => handleUpdate({ timezone_str: v })}
              options={options.timezones}
            />
          </Card>

          <Card title="Sistema" icon={<ShieldCheck size={24} />} color="text-purple-400">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Tema</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleUpdate({ theme_preference: t })}
                      className={`py-3 rounded-xl border text-[10px] uppercase font-bold transition-all ${
                        settings.theme_preference === t
                          ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-white"
                          : "border-border bg-card hover:bg-accent"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase">{settings.account_status}</span>
              </div>
              <Toggle
                label="Autenticação 2FA"
                enabled={settings.two_factor_enabled}
                onChange={(v: boolean) => handleUpdate({ two_factor_enabled: v })}
              />
            </div>
          </Card>
        </div>

        <footer className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border pt-8">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            Último acesso: {settings.last_signin ? new Date(settings.last_signin).toLocaleString() : "N/A"}
          </p>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-12 py-7 rounded-2xl text-lg font-black bg-primary text-white hover:opacity-90 transition-all shadow-lg"
          >
            {saving ? <Loader2 className="animate-spin" /> : "Salvar Configurações"}
          </Button>
        </footer>
      </main>
    </div>
  );
}

// --- Sub-componentes com Props Tipadas ---

interface CardProps {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
}

function Card({ title, icon, color, children }: CardProps) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6 shadow-sm transition-all hover:shadow-md">
      <div className={`flex items-center gap-3 ${color}`}>
        {icon}
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ label, enabled, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
          enabled ? "bg-purple-500 border-purple-500" : "border-border bg-background"
        }`}
      >
        <input
          type="checkbox"
          className="hidden"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        {enabled && <Check size={14} className="text-white" />}
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-foreground">
        {label}
      </span>
    </label>
  );
}