"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Lock,
  Search,
  HelpCircle,
  Wallpaper,
  ChevronRight,
  Crown,
  MessageSquare,
  TriangleAlert,
  LogOut,
  UserCog,
} from "lucide-react";
import { Picture, LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import { AxiosError } from "axios";
import type { User as UserType } from "@/types";
import { useTheme } from "@/hooks/use-theme";
import { useAccountSettings } from "@/hooks/use-account-settings";

// ---------------------
// Helpers
// ---------------------

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-[10px] font-bold uppercase text-foreground/30 mb-2 ml-2 tracking-[0.2em]">
    {title}
  </h2>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-foreground/5 rounded-3xl border border-border p-5 backdrop-blur-md">
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (val: boolean) => void; disabled?: boolean }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
    <span className="text-sm text-foreground/90">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-foreground/10 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
    </label>
  </div>
);

const LinkButton = ({
  label,
  icon: Icon,
  onClick,
  description,
}: {
  label: string;
  icon: any;
  onClick: () => void;
  description?: string;
}) => (
  <button
    onClick={onClick}
    className="group w-full flex items-center justify-between py-4 border-b border-border last:border-b-0 transition-colors hover:bg-foreground/5"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition">
        <Icon className="w-5 h-5 text-foreground/60" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground/90">{label}</span>
        {description && (
          <span className="text-[10px] uppercase text-foreground/40">{description}</span>
        )}
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:translate-x-1 transition" />
  </button>
);

// ---------------------
// Main Page
// ---------------------

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<Record<string, boolean> | null>(null);
  const [updating, setUpdating] = useState(false);

  const { settings, loading: loadingSettings } = useAccountSettings();
  useTheme(settings?.theme_preference ?? "dark");

  const prefsKeys = [
    "push_notifications",
    "email_notifications",
    "sms_notifications",
    "marketing_emails",
    "product_updates",
    "reminders",
  ];
 
  const country = settings?.country?.toLowerCase();

  // ---------------------
  // Fetch Profile
  // ---------------------
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<UserType>("profile/");
      setProfile({
        ...data,
        languages: typeof data.languages === "string" ? JSON.parse(data.languages) : data.languages || [],
        skills: typeof data.skills === "string" ? JSON.parse(data.skills) : data.skills || [],
        interests: typeof data.interests === "string" ? JSON.parse(data.interests) : data.interests || [],
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) router.replace("/auth");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ---------------------
  // Fetch Preferences
  // ---------------------
  const fetchPrefs = useCallback(async () => {
    try {
      const res = await api.get("/notification-preferences/", { withCredentials: true });
      setPrefs(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (!loading) fetchPrefs();
  }, [loading, fetchPrefs]);

  const updatePref = async (key: string, value: boolean) => {
    if (!prefs) return;
    const prev = { ...prefs };
    setPrefs({ ...prefs, [key]: value });
    setUpdating(true);
    try {
      await api.put(`/notification-preferences/`, { [key]: value }, { withCredentials: true });
    } catch {
      setPrefs(prev);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || loadingSettings || !profile) return <LoadingPage />;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 pb-20">
      <div className="max-w-xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex flex-col items-center gap-3 py-4">
          <Picture value={profile.avatar_url || "/icons/profile.svg"} size={110} />
          <div className="text-center">
            <h1 className="text-2xl font-bold">{profile.full_name || "User"}</h1>
            <Link
              href={`https://imlinkey.store/${profile.username}`}
              target="_blank"
              className="text-emerald-400 text-xs mt-1 hover:underline"
            >
              @{profile.username}
            </Link>
          </div>
        </header>

        {/* PERSONALIZAR */}
        <section>
          <SectionHeader title="Personalizar" />
          <Card>
            <LinkButton label="Editar Perfil" icon={User} onClick={() => router.push("/profile")} />
            <LinkButton label="Conta" icon={UserCog} onClick={() => router.push("/account-settings")} />
            <LinkButton label="Segurança" icon={Lock} onClick={() => router.push("/password")} />
            <LinkButton label="Histórico" icon={Search} onClick={() => router.push("/search-history")} />
            <LinkButton label="Wallpaper" icon={Wallpaper} onClick={() => router.push("/bg-image")} />
          </Card>
        </section>

        {/* NOTIFICAÇÕES */}
        {prefs && (
          <section>
            <SectionHeader title="Notificações" />
            <Card>
              {prefsKeys.map((key) => (
                <Toggle
                  key={key}
                  label={key.replace("_", " ").toUpperCase()}
                  checked={prefs[key]}
                  onChange={(v) => updatePref(key, v)}
                  disabled={updating}
                />
              ))}
            </Card>
          </section>
        )}

        {/* MAIS */}
        <section>
          <SectionHeader title="Mais" />
          <Card>
            <LinkButton label="Assinatura Pro" icon={Crown} onClick={() => router.push(`/payments/${country}/billing`)} />
            <LinkButton label="Suporte" icon={MessageSquare} onClick={() => router.push("/support")} />
            <LinkButton label="Sobre" icon={HelpCircle} onClick={() => router.push("/about")} />
            <LinkButton label="Danger Zone" icon={TriangleAlert} onClick={() => router.push("/danger-zone")} />
          </Card>
        </section>

        {/* LOGOUT */}
        <button
          onClick={async () => {
            await api.post("/auth/signout/", {}, { withCredentials: true });
            router.replace("/auth");
          }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-border bg-foreground/5 hover:bg-foreground/10 font-bold"
        >
          <LogOut size={18} /> Sair da Conta
        </button>
      </div>
    </main>
  );
}