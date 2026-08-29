"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils";
import { ProfileLayout, Button, LoadingPage } from "@/components/ui";
import { Search, Clock, Trash2, User, X, History, ArrowUpRight } from "lucide-react";
import useAuthRedirect from "@/hooks/use-auth-redirect";

// ---------------------------
// TYPES
// ---------------------------

export type SearchType = "profile" | "keyword";

export interface SearchHistoryItem {
  id: string;
  query: string;
  type: SearchType;
  date: string;
  url: string;
}

// ---------------------------
// COOKIE HELPERS
// ---------------------------

const HISTORY_COOKIE = "imlinkey_search_history";

function setCookie(history: SearchHistoryItem[]) {
  document.cookie = `${HISTORY_COOKIE}=${encodeURIComponent(
    JSON.stringify(history)
  )}; path=/; max-age=31536000`;
}

function getCookie(): SearchHistoryItem[] {
  const match = document.cookie.match(
    new RegExp("(^| )" + HISTORY_COOKIE + "=([^;]+)")
  );
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[2]));
    } catch {
      return [];
    }
  }
  return [];
}

function clearCookie() {
  document.cookie = `${HISTORY_COOKIE}=; path=/; max-age=0`;
}

// ---------------------------
// COMPONENTS
// ---------------------------

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// ---------------------------
// PAGE
// ---------------------------

export default function SearchHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingAuth = useAuthRedirect();

  // ---------------------------
  // FETCH HISTORY
  // ---------------------------
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/search-history/");

      const backendHistory: SearchHistoryItem[] = Array.isArray(res.data)
        ? res.data.map((item: any) => ({
            id: item.id,
            query: item.query,
            type: item.search_type === "profile" ? "profile" : "keyword",
            date: item.created_at,
            url: item.target_url,
          }))
        : [];

      const combined = [...backendHistory, ...getCookie()].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setHistory(combined);
      setCookie(combined);
    } catch {
      setHistory(getCookie());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ---------------------------
  // CLEAR ITEM / ALL
  // ---------------------------
  const clearItem = async (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    setCookie(updated);

    try {
      await api.delete(`/search-history/${id}/`);
    } catch {}
  };

  const clearAll = async () => {
    if (confirm("Tem certeza que deseja limpar todo o seu histórico?")) {
      setHistory([]);
      clearCookie();
      try {
        await api.delete("/search-history/");
      } catch {}
    }
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  if (loading || loadingAuth) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <ProfileLayout>
        <div className="max-w-3xl w-full mx-auto p-4 space-y-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                <History className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter">Histórico</h1>
                <p className="text-white/40 text-sm font-medium">
                  Suas pesquisas recentes no Imlinkey
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all border border-red-500/10"
              >
                <Trash2 size={14} />
                Limpar Tudo
              </button>
            )}
          </div>

          {/* SEARCH INPUT */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sky-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Pesquisar no histórico..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all backdrop-blur-md"
            />
          </div>

          {/* HISTORY LIST */}
          <div className="space-y-3">
            {history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-all hover:bg-white/[0.08]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${
                        item.type === "profile"
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {item.type === "profile" ? <User size={18} /> : <Search size={18} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                        {item.query}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock size={10} className="text-white/20" />
                        <span className="text-[10px] font-medium text-white/20 uppercase tracking-wider">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.url}
                      className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      title="Visitar"
                    >
                      <ArrowUpRight size={18} />
                    </a>
                    <button
                      onClick={() => clearItem(item.id)}
                      className="p-2 text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remover"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                <div className="inline-flex p-4 bg-white/5 rounded-full text-white/20">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-white/40">Nenhum registro encontrado</h3>
                <p className="text-sm text-white/20 max-w-xs mx-auto">
                  Suas pesquisas recentes aparecerão aqui para facilitar seu acesso.
                </p>
                <Button
                  className="bg-sky-500 hover:bg-sky-600 rounded-xl px-8"
                  onClick={() => router.push("/")}
                >
                  Explorar Imlinkey
                </Button>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="pt-10 flex items-center justify-center gap-2 text-white/20">
            <Clock size={14} />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              O histórico é armazenado localmente e no backend para sua privacidade
            </p>
          </div>
        </div>
      </ProfileLayout>
    </div>
  );
}