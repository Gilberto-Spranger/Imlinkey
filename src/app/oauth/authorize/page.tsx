"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiErrorResponse } from "@/utils";
import { LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

interface AppInfo {
  id: string;
  name: string;
  client_id: string;
  redirect_uri: string;
  scopes: string[];
  requested_user_data: string[];
  image_url?: string;
  description?: string;
}

interface UserInfo {
  username: string;
  email?: string;
  phone_number?: string;
  full_name: string;
  birthdate?: string;
  age?: number;
  avatar_url?: string;
}

export default function AuthorizePage() {
  const loadingAuth = useAuthRedirect();

  if (loadingAuth) return <LoadingPage />;
  return (
    <Suspense fallback={<CenteredMessage message="Carregando..." />}>
      <Authorize />
    </Suspense>
  );
}

function Authorize() {
  const params = useSearchParams();
  const client_id = params.get("client_id") ?? "";
  const redirect_uri = params.get("redirect_uri") ?? "";
  const oauth_complete_url = params.get("oauth_complete_url") ?? "";

  const [app, setApp] = useState<AppInfo | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client_id) {
      setError("client_id ausente");
      setLoading(false);
      return;
    }

    async function loadAppAndUser() {
      try {
        const resApp = await api.get<AppInfo>(`/oauth/apps/${client_id}/`, {
          params: { redirect_uri },
        });
        setApp(resApp.data);

        const resUser = await api.get<UserInfo>("/userinfo/", { withCredentials: true });
        setUser(resUser.data);
      } catch (err: any) {
        const status = err.response?.status;
        const data: ApiErrorResponse = err.response?.data;
        setError(status === 401 ? "Usuário não logado" : data?.detail || data?.error || "Erro ao buscar dados");
      } finally {
        setLoading(false);
      }
    }

    loadAppAndUser();
  }, [client_id, redirect_uri]);

  const handleAuthorize = (allow: boolean) => {
    if (!redirect_uri) return;

    if (!allow) {
      const deniedUrl = new URL(redirect_uri);
      deniedUrl.searchParams.set("error", "access_denied");
      window.location.href = deniedUrl.toString();
      return;
    }

    // Se houver a URL completa gerada pelo Django, usamos ela adicionando o confirm=true
    if (oauth_complete_url) {
      const targetUrl = new URL(oauth_complete_url);
      targetUrl.searchParams.set("confirm", "true");
      window.location.href = targetUrl.toString();
      return;
    }

    // Fallback caso a requisição venha diretamente da UI sem oauth_complete_url
    if (!app) return;
    const backendUrl = new URL("https://apis.imlinkey.store/api/v1/oauth/authorize/");
    backendUrl.searchParams.set("client_id", client_id);
    backendUrl.searchParams.set("redirect_uri", redirect_uri);
    backendUrl.searchParams.set("response_type", "code");
    backendUrl.searchParams.set("confirm", "true");
    if (app.scopes.length) backendUrl.searchParams.set("scope", app.scopes.join(" "));
    backendUrl.searchParams.set("state", crypto.randomUUID());
    window.location.href = backendUrl.toString();
  };

  if (loading) return <CenteredMessage message="Carregando..." />;
  if (error) return <CenteredMessage message={error} isError />;
  if (!app) return <CenteredMessage message="Aplicação inválida" />;

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#0c0d1f] to-[#020617] text-slate-200 p-4 md:p-12 font-sans flex items-center justify-center">
      <div className="bg-slate-900/50 rounded-3xl border border-white/10 p-8 md:p-12 backdrop-blur-xl shadow-2xl w-full max-w-md space-y-8 animate-fade-in">
        <AppHeader app={app} />

        <p className="text-slate-400">Este aplicativo quer acessar os seguintes dados da sua conta:</p>
        {app.requested_user_data && app.requested_user_data.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            {app.requested_user_data.map((field) => (
              <li key={field} className="capitalize hover:text-sky-400 transition-colors">
                {field.replace("_", " ")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm italic">Nenhum dado adicional solicitado.</p>
        )}

        {user && <UserCard user={user} />}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleAuthorize(false)}
            className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30 text-white px-6 py-3 rounded-3xl font-semibold transition-all transform hover:-translate-y-1 hover:scale-105"
          >
            Negar
          </button>
          <button
            onClick={() => handleAuthorize(true)}
            className="bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-900/30 text-slate-950 px-6 py-3 rounded-3xl font-semibold transition-all transform hover:-translate-y-1 hover:scale-105"
          >
            Permitir
          </button>
        </div>
      </div>
    </main>
  );
}

// 🔹 Componentes Auxiliares
function AppHeader({ app }: { app: AppInfo }) {
  return (
    <div className="flex items-center gap-4">
      {app.image_url ? (
        <img
          src={app.image_url}
          alt={app.name}
          className="w-20 h-20 rounded-xl object-cover ring-2 ring-sky-500/20 hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-2xl">
          {app.name[0]?.toUpperCase() ?? "A"}
        </div>
      )}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white">{app.name}</h1>
        {app.description && <p className="text-slate-400 text-sm">{app.description}</p>}
      </div>
    </div>
  );
}

function UserCard({ user }: { user: UserInfo }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-2xl p-5 shadow-lg shadow-sky-900/20 backdrop-blur-md mt-4 hover:scale-[1.02] transition-transform duration-300">
      <h2 className="text-xl text-sky-400 font-semibold mb-3">Seus dados</h2>
      <div className="flex items-center gap-4">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="w-16 h-16 rounded-full object-cover shadow-md" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xl shadow-md">
            {user.username[0]?.toUpperCase() ?? "U"}
          </div>
        )}
        <div className="space-y-1 text-slate-200">
          <p><span className="font-medium text-sky-300">Username:</span> {user.username}</p>
          <p><span className="font-medium text-sky-300">Nome completo:</span> {user.full_name}</p>
          {user.email && <p><span className="font-medium text-sky-300">Email:</span> {user.email}</p>}
          {user.phone_number && <p><span className="font-medium text-sky-300">Telefone:</span> {user.phone_number}</p>}
          {user.birthdate && <p><span className="font-medium text-sky-300">Data de nascimento:</span> {user.birthdate}</p>}
          {user.age && <p><span className="font-medium text-sky-300">Idade:</span> {user.age}</p>}
        </div>
      </div>
    </div>
  );
}

function CenteredMessage({ message, isError }: { message: string; isError?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className={isError ? "text-red-500 text-lg font-semibold" : "text-slate-200 text-lg font-medium"}>
        {message}
      </span>
    </div>
  );
}
