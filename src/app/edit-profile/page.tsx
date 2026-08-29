"use client";
import { useEffect, useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Save, User as UserIcon, Zap } from "lucide-react";

import { api, GenderOptions, formatArray, countries } from "@/utils";
import type { User } from "@/types";
import useAuthRedirect from "@/hooks/use-auth-redirect";
import { LoadingPage, Input, Select, Button } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { useAccountSettings } from "@/hooks/use-account-settings";

const CardSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-border bg-background">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-foreground/5">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
    </div>
    <div className="grid grid-cols-1 gap-4">{children}</div>
  </div>
);

export default function EditProfile() {
  const router = useRouter();
  const loadingAuth = useAuthRedirect();
  const { settings, loading: loadingSettings } = useAccountSettings();

  useTheme(settings?.theme_preference ?? "dark");

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("profile/", { withCredentials: true });
      const data = res.data;

      // Tratamento do Telefone: Se não tiver "+", adicionamos para o Input Phone reconhecer o país
      const formattedPhone = data.phone && !data.phone.startsWith("+") 
        ? `+${data.phone}` 
        : data.phone;

      setProfile({
        ...data,
        phone: formattedPhone,
        languages: Array.isArray(data.languages) ? data.languages : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        interests: Array.isArray(data.interests) ? data.interests : [],
      });
    } catch (err: any) {
      if (err.response?.status === 401) router.replace("/auth/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!loadingAuth) fetchProfile();
  }, [fetchProfile, loadingAuth]);

  const handleInputChange = (field: keyof User, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
  };

  const handleValueChange = <K extends keyof User>(field: K, value: User[K]) =>
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      if (avatar) formData.append("avatar_file", avatar);

      Object.entries(profile).forEach(([key, value]) => {
        if (["avatar_url", "id"].includes(key) || value === null) return;

        let finalValue = value;

        // Se for o campo de telefone, removemos o "+" antes de enviar para o backend
        if (key === "phone" && typeof value === "string") {
          finalValue = value.replace("+", "");
        }

        if (Array.isArray(finalValue)) {
          formData.append(key, JSON.stringify(finalValue));
        } else {
          formData.append(key, String(finalValue));
        }
      });

      await api.put("profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage({ text: "Perfil atualizado com sucesso!", type: "success" });
      setAvatar(null);
      fetchProfile();
    } catch {
      setMessage({ text: "Erro ao salvar alterações.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingAuth || loadingSettings) return <LoadingPage />;
  if (!profile) return null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-border p-6 md:p-8 bg-background">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-36 h-36">
              <Image
                src={avatar ? URL.createObjectURL(avatar) : profile.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                fill
                className="object-cover rounded-full border-4 border-border"
              />
              <label className="absolute bottom-1 right-1 p-3 rounded-full cursor-pointer shadow-lg bg-background border border-border hover:bg-foreground/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                />
                <Pencil className="w-5 h-5 text-foreground" />
              </label>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-foreground">
                {profile.full_name || "Nome do Usuário"}
              </h2>
              <Link
                href={`https://imlinkey.store/${profile.username}`}
                target="_blank"
                className="text-emerald-400 text-sm mt-1 hover:underline inline-block"
              >
                @{profile.username}
              </Link>
            </div>
          </div>
        </div>

        {/* Grid de Seções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSection title="Identidade" icon={UserIcon}>
            <Input label="Nome completo" value={profile.full_name || ""} onChange={(e) => handleInputChange("full_name", e)} />
            <Input label="Username" value={profile.username || ""} onChange={(e) => handleInputChange("username", e)} />
            <Input label="Email" type="email" value={profile.email || ""} onChange={(e) => handleInputChange("email", e)} />
            <Input 
              variant="phone" 
              label="Telefone"
              value={profile.phone || ""} 
              onChange={(v) => handleValueChange("phone", v)} 
              required 
            />
            <Input label="Website" value={profile.website || ""} onChange={(e) => handleInputChange("website", e)} />
          </CardSection>

          <CardSection title="Dados Pessoais" icon={Zap}>
            <Input label="Nascimento" type="date" value={profile.birth_date || ""} onChange={(e) => handleInputChange("birth_date", e)} />
            <Select
              label="Gênero"
              value={profile.gender ?? ""}
              options={GenderOptions}
              onChange={(v) => handleValueChange("gender", v === "" ? null : (v as "Male" | "Female"))}
            />
            <Input label="Nacionalidade" value={profile.nationality || ""} onChange={(e) => handleInputChange("nationality", e)} />
            <Input
              label="Nº do Documento (BI / NIF / Passaporte)"
              value={(profile as any).national_id || ""}
              onChange={(e) => handleInputChange("national_id" as any, e)}
              placeholder="Ex: 000000000LA000"
            />
          </CardSection>

          <div className="md:col-span-2">
            <CardSection title="Bio & Skills" icon={Zap}>
              <div className="flex flex-col gap-4">
                <Input
                  label="Sobre você"
                  type="textarea"
                  value={profile.bio || ""}
                  onChange={(e: any) => handleInputChange("bio", e)}
                  placeholder="Escreva algo sobre você..."
                  className="min-h-[100px]"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Habilidades"
                    value={formatArray(profile.skills)}
                    onChange={(e) => handleValueChange("skills", e.target.value.split(",").map((s) => s.trim()))}
                  />
                  <Input
                    label="Interesses"
                    value={formatArray(profile.interests)}
                    onChange={(e) => handleValueChange("interests", e.target.value.split(",").map((s) => s.trim()))}
                  />
                  <Input
                    label="Idiomas"
                    value={formatArray(profile.languages)}
                    onChange={(e) => handleValueChange("languages", e.target.value.split(",").map((s) => s.trim()))}
                  />
                </div>
              </div>
            </CardSection>
          </div>
        </div>

        {/* Feedback e Botão */}
        <div className="flex flex-col items-center gap-4 mt-6">
          {message && (
            <p className={`text-center p-3 rounded-xl font-medium ${message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
              {message.text}
            </p>
          )}

          <Button type="submit" disabled={saving} className="flex items-center gap-3 px-12 py-4 rounded-2xl font-bold shadow-lg">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </main>
  );
}