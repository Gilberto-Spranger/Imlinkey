"use client";

import { useState } from "react";
import { ProfileLayout, ProfileFormSection, Button, LoadingPage } from "@/components/ui";
import { KeyRound, ShieldCheck, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { api, ApiErrorResponse } from "@/utils";
import useAuthRedirect from "@/hooks/use-auth-redirect";
import { useTheme } from "@/hooks/use-theme";
import { useAccountSettings } from "@/hooks/use-account-settings";

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

interface MessageState {
  type: "success" | "error" | "";
  text: string;
}

export default function Password() {
  // 🔐 Bloqueia página se não estiver logado
  const loadingAuth = useAuthRedirect();
  
  // 🎨 Gestão de Tema
  const { settings, loading: loadingSettings } = useAccountSettings();
  useTheme(settings?.theme_preference ?? "dark");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<PasswordForm>({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [message, setMessage] = useState<MessageState>({
    type: "",
    text: "",
  });

  const handleChange = (field: keyof PasswordForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });
  };

  const validateForm = (): string | null => {
    if (formData.new_password.length < 8) {
      return "A nova senha deve ter no mínimo 8 caracteres";
    }
    if (formData.new_password !== formData.confirm_new_password) {
      return "As senhas não coincidem";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put<{ message: string }>(
        "auth/change-password/",
        formData
      );

      setMessage({
        type: "success",
        text: data.message || "Senha atualizada com sucesso",
      });
      resetForm();
    } catch (error) {
      const err = error as { response?: { data?: ApiErrorResponse } };
      const data = err.response?.data;

      const errorMessage =
        data?.current_password ||
        data?.confirm_new_password ||
        data?.detail ||
        data?.message ||
        "Erro ao atualizar senha";

      setMessage({
        type: "error",
        text: Array.isArray(errorMessage) ? errorMessage.join(" ") : String(errorMessage),
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth || loadingSettings) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ProfileLayout>
        <div className="max-w-2xl mx-auto p-4 space-y-8">
          
          {/* Header da Seção */}
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex p-4 bg-foreground/5 rounded-3xl border border-border">
              <KeyRound className="w-8 h-8 text-foreground/70" />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Segurança
            </h1>

            <p className="text-foreground/50 font-medium">
              Atualize sua senha para manter sua conta segura.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfileFormSection title="Alterar Senha">
              <div className="space-y-5 py-2">
                
                {/* Senha Atual */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.current_password}
                      onChange={(e) => handleChange("current_password", e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pl-11 bg-foreground/[0.03] border border-border rounded-xl focus:ring-2 focus:ring-foreground/20 outline-none text-foreground placeholder:text-foreground/20 transition-all"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                  </div>
                </div>

                {/* Nova Senha */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.new_password}
                      onChange={(e) => handleChange("new_password", e.target.value)}
                      required
                      placeholder="Mínimo 8 caracteres"
                      className="w-full px-4 py-3 pl-11 bg-foreground/[0.03] border border-border rounded-xl focus:ring-2 focus:ring-foreground/20 outline-none text-foreground placeholder:text-foreground/20 transition-all"
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nova Senha */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirm_new_password}
                    onChange={(e) => handleChange("confirm_new_password", e.target.value)}
                    required
                    placeholder="Repita a nova senha"
                    className="w-full px-4 py-3 bg-foreground/[0.03] border border-border rounded-xl focus:ring-2 focus:ring-foreground/20 outline-none text-foreground placeholder:text-foreground/20 transition-all"
                  />
                </div>

              </div>
            </ProfileFormSection>

            {/* Feedback de Mensagem */}
            {message.text && (
              <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              }`}>
                <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
                {message.text}
              </div>
            )}

            {/* Botão de Ação */}
            <Button
              type="submit"
              isLoading={loading}
              variant="primary"
              color="blue"
              size="lg"
              className="w-full py-7 font-black rounded-2xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar Senha"
              )}
            </Button>
          </form>
        </div>
      </ProfileLayout>
    </div>
  );
}