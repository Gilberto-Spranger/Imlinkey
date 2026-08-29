"use client";

import React, { useState } from "react";
import { Link2, Plus, Globe, Check, ExternalLink } from "lucide-react";
import { Link as SharedLink } from "@/types";

interface LinkShareProps {
  onLinkAdded: (title: string, url: string) => void;
  isLoading: boolean;
}

export default function LinkShare({ onLinkAdded, isLoading }: LinkShareProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onLinkAdded(title.trim(), formattedUrl);
    setTitle("");
    setUrl("");
    setIsOpen(false);
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-xl max-w-lg mx-auto w-full transition-all">
      {!isOpen ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Link2 size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Partilha de Link</p>
              <p className="text-[10px] text-slate-400">Adicione links úteis com pré-visualização</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md"
          >
            <Plus size={14} />
            <span>Compartilhar</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Link2 size={14} className="text-indigo-400" /> Compartilhar Novo Link
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1 font-mono">
              Título do Link
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Portfólio do Imlinkey, Google AI, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1 font-mono">
              Endereço URL
            </label>
            <input
              type="text"
              required
              placeholder="Ex: imlinkey.store ou https://google.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !title.trim() || !url.trim()}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/50 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={14} />
                <span>Gerar Pré-visualização</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
