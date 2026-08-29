"use client";

import { useCallback, useEffect, useState } from "react";
import { Picture, LoadingPage } from "@/components/ui";
import { api } from "@/utils";
import type { User } from "@/types";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useTheme } from "@/hooks/use-theme";
import { useAccountSettings } from "@/hooks/use-account-settings";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Phone,
  FileText,
  Calendar,
  Venus,
  Flag,
  Star,
  Heart,
  Languages,
  Globe,
  IdCard,
} from "lucide-react";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// Campos permitidos (editáveis)
const allowedFields: Record<string, { label: string; icon: any }> = {
  full_name: { label: "Nome completo", icon: UserIcon },
  email: { label: "Email", icon: Mail },
  phone: { label: "Telefone", icon: Phone },
  bio: { label: "Bio", icon: FileText },
  birth_date: { label: "Nascimento", icon: Calendar },
  gender: { label: "Gênero", icon: Venus },
  nationality: { label: "Nacionalidade", icon: Flag },
  skills: { label: "Habilidades", icon: Star },
  interests: { label: "Interesses", icon: Heart },
  languages: { label: "Idiomas", icon: Languages },
  website: { label: "Website", icon: Globe },
  national_id: { label: "Documento", icon: IdCard },
};

// Helper
const formatValue = (val: any): string => {
  if (Array.isArray(val)) return val.join(", ");
  if (!val) return "-";
  return String(val);
};

// Item de perfil
const ProfileItem = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: any;
}) => (
  <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-foreground/50" />
      <span className="text-foreground/60 text-sm font-medium">{label}</span>
    </div>
    <span className="text-foreground text-sm font-semibold text-right max-w-[55%] break-words">
      {value}
    </span>
  </div>
);

// Página
export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { settings, loading: loadingSettings } = useAccountSettings();
  const loadingAuth = useAuthRedirect();

  // Aplica tema baseado na preferência do usuário
  useTheme(settings?.theme_preference ?? "dark");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<User>("profile/");

      const parsed = {
        ...data,
        languages:
          typeof data.languages === "string"
            ? JSON.parse(data.languages)
            : data.languages || [],
        skills:
          typeof data.skills === "string"
            ? JSON.parse(data.skills)
            : data.skills || [],
        interests:
          typeof data.interests === "string"
            ? JSON.parse(data.interests)
            : data.interests || [],
      };

      setProfile(parsed);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) router.replace("/auth");
      else console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading || loadingSettings || loadingAuth) return <LoadingPage />;
  if (!profile)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-red-500">
        Perfil não encontrado.
      </div>
    );

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border p-6">
          <Picture value={profile.avatar_url ?? null} size={120} />

          <div className="text-center">
            <h2 className="text-3xl font-extrabold">{profile.full_name || "User Full Name"}</h2>
            {/* Username com link */}
            <Link
              href={`https://imlinkey.store/${profile.username}`}
              target="_blank"
              className="text-emerald-400 text-sm mt-1 hover:underline inline-block"
            >
              @{profile.username}
            </Link>
          </div>

          <button
            onClick={() => router.push("/edit-profile")}
            className="px-6 py-2 bg-foreground/5 text-foreground rounded-xl text-sm font-semibold hover:bg-foreground/10 transition"
          >
            Editar Perfil
          </button>
        </div>

        {/* Dados dinâmicos - UI Premium */}
        <div className="rounded-3xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 text-foreground/80">
            Informações do Perfil
          </h3>
          {Object.entries(allowedFields).map(([key, { label, icon }]) => {
            const value = formatValue((profile as any)[key]);
            return <ProfileItem key={key} label={label} value={value} Icon={icon} />;
          })}
        </div>
      </div>
    </main>
  );
}