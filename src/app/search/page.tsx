"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, User as UserIcon, Phone, Mail, AtSign, ArrowUpRight } from "lucide-react";
import { LoadingPage, Picture } from "@/components/ui";
import { api } from "@/utils";
import { motion } from "framer-motion";
import type { User } from "@/types";
import { useTheme } from "@/hooks/use-theme";
import { useAccountSettings } from "@/hooks/use-account-settings";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// --- debounce helper ---
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// --- escape regex ---
function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- Search Page ---
export default function SearchPage() {
  const router = useRouter();
  const { settings, loading: loadingSettings } = useAccountSettings();
  const loadingAuth = useAuthRedirect();

  // Aplica tema baseado na preferência do usuário
  useTheme(settings?.theme_preference ?? "dark");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 350);

  // Fetch users
  useEffect(() => {
    if (!debouncedSearch) {
      setUsers([]);
      return;
    }

    let isMounted = true;
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await api.get<User[]>("/users", { params: { search: debouncedSearch } });
        if (isMounted) setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erro ao buscar users:", err);
        if (isMounted) setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUsers();
    return () => { isMounted = false; };
  }, [debouncedSearch]);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return [];
    const term = debouncedSearch.toLowerCase();

    return users.filter((user) =>
      user.first_name?.toLowerCase().includes(term) ||
      user.last_name?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.full_name?.toLowerCase().includes(term) ||
      String(user.phone || "").toLowerCase().includes(term)
    );
  }, [users, debouncedSearch]);

  // Loading completo só na inicial
  if (loadingSettings || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
      {/* Header */}
      <section className="max-w-4xl mx-auto space-y-6 pt-24 pb-10">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-center md:text-left">
          Imlinkey Search<span className="text-blue-500">.</span>
        </h1>

        <div className="relative max-w-xl mx-auto md:mx-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />

          <input
            autoFocus
            placeholder="Buscar por nome, username, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-foreground"
          />

          {/* Loading interno pequeno */}
          {loading && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-t-blue-500 border-border rounded-full animate-spin"
            />
          )}
        </div>
      </section>

      {/* Conteúdo */}
      <section className="max-w-4xl mx-auto pb-24 space-y-4">
        {!searchTerm ? (
          <IdleState />
        ) : filteredUsers.length ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                search={debouncedSearch}
              />
            ))}
          </div>
        ) : (
          !loading && <EmptyState search={debouncedSearch} />
        )}
      </section>
    </div>
  );
}

// --- Card com UI Premium ---
function UserCard({ user, search }: { user: User; search: string }) {
  const displayName =
    user.full_name ||
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.username ||
    "Usuário";

  return (
    <motion.a
      href={`https://imlinkey.store/${user.username}`}
      target="_blank"
      whileHover={{ scale: 1.008, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group flex items-center justify-between p-5 border border-border/50 rounded-2xl cursor-pointer transition-all bg-card/30 backdrop-blur-md hover:bg-card/60 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5"
    >
      <div className="flex items-center gap-5 min-w-0">
        {/* Avatar mantido fixo e redondo conforme solicitado */}
        <div className="w-16 h-16 rounded-full border-2 border-border/80 overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/50 transition-colors bg-background">
          {user.avatar_url ? (
            <Picture value={user.avatar_url} size={64} />
          ) : (
            <UserIcon className="text-foreground/40 w-7 h-7" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0 space-y-1">
          <span className="text-foreground font-semibold text-base tracking-tight leading-tight group-hover:text-blue-400 transition-colors truncate">
            {highlight(displayName, search)}
          </span>

          {user.username && (
            <span className="text-xs text-foreground/50 flex items-center gap-1 font-medium truncate">
              <AtSign size={12} className="text-blue-500/70" /> 
              {highlight(user.username, search)}
            </span>
          )}

          {/* Badges de Contato Otimizados */}
          <div className="flex flex-wrap gap-2 mt-1.5">
            {user.email && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-foreground/[0.03] border border-border/30 text-[11px] text-foreground/60 transition-colors group-hover:border-border/60">
                <Mail size={11} className="text-foreground/40" /> 
                <span className="truncate max-w-[180px] sm:max-w-xs">{highlight(user.email, search)}</span>
              </span>
            )}
            {user.phone && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-foreground/[0.03] border border-border/30 text-[11px] text-foreground/60 transition-colors group-hover:border-border/60">
                <Phone size={11} className="text-foreground/40" /> 
                <span>{highlight(String(user.phone), search)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botão de Ação / View Interativo */}
      <div className="flex items-center gap-1 ml-5 mb-4 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest border border-blue-500/20 opacity-80 group-hover:opacity-100 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
        <span>View</span>
        <ArrowUpRight size={13} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </motion.a>
  );
}

// --- Highlight seguro ---
function highlight(text: string, term: string) {
  if (!term) return text;
  const safeTerm = escapeRegex(term);
  const regex = new RegExp(`(${safeTerm})`, "gi");

  return text.split(regex).map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <span key={i} className="text-blue-500 font-bold bg-blue-500/10 px-0.5 rounded-sm">{part}</span>
    ) : (
      part
    )
  );
}

// --- EmptyState ---
function EmptyState({ search }: { search: string }) {
  return (
    <div className="text-center py-16 text-foreground/40 space-y-2 bg-card/10 rounded-2xl border border-dashed border-border/60">
      <p className="text-sm font-bold uppercase tracking-widest text-foreground/60">Nenhum resultado</p>
      <p className="text-xs">Nada encontrado para <span className="text-blue-500 font-medium">"{search}"</span></p>
    </div>
  );
}

// --- IdleState ---
function IdleState() {
  return (
    <div className="text-center py-16 text-foreground/40 text-sm font-medium bg-card/10 rounded-2xl border border-dashed border-border/60">
      Comece a digitar para buscar usuários 👀
    </div>
  );
}
