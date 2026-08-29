"use client";

import React, { useState } from "react";
import { Sparkles, Image, Check, ChevronRight, X } from "lucide-react";

interface GenerateMediaProps {
  onMediaGenerated: (imageUrl: string, prompt: string) => void;
  onClose: () => void;
}

export default function GenerateMedia({ onMediaGenerated, onClose }: GenerateMediaProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const ratios = [
    { label: "Quadrado (1:1)", value: "1:1" },
    { label: "Widescreen (16:9)", value: "16:9" },
    { label: "Vertical (9:16)", value: "9:16" },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setStatus("generating");
    setResultUrl(null);

    try {
      const res = await fetch("/api/generate-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), aspectRatio }),
      });

      if (!res.ok) {
        throw new Error("API call returned an error.");
      }

      const data = await res.json();
      if (data.imageUrl) {
        setResultUrl(data.imageUrl);
        setStatus("success");
      } else {
        alert("Não conseguimos gerar a imagem. Tente mudar um pouco a descrição.");
        setStatus("idle");
      }
    } catch (e) {
      console.error("Image generation failed:", e);
      alert("Falha de rede ao se conectar ao estúdio de imagem do Gemini.");
      setStatus("idle");
    }
  };

  const handleSend = () => {
    if (resultUrl) {
      onMediaGenerated(resultUrl, prompt);
      setPrompt("");
      setResultUrl(null);
      setStatus("idle");
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-xl max-w-lg mx-auto w-full transition-all">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-900 mb-3.5">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Sparkles size={14} className="text-indigo-400" /> Estúdio de Mídia IA
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X size={15} />
        </button>
      </div>

      {status === "idle" && (
        <form onSubmit={handleGenerate} className="space-y-3.5">
          <div>
            <label className="block text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1.5 font-mono">
              Descrição da imagem (Prompt)
            </label>
            <textarea
              rows={2}
              required
              placeholder="Ex: Um gato cibernético com óculos futuristas com fundo cyberpunk..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1.5 font-mono">
              Proporção da Imagem
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ratios.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setAspectRatio(r.value)}
                  className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                    aspectRatio === r.value
                      ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                      : "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-400"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/50 cursor-pointer"
          >
            <Sparkles size={13} />
            <span>Gerar Mídia com Gemini</span>
          </button>
        </form>
      )}

      {status === "generating" && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 animate-spin">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Criando sua imagem...</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[250px]">
              O modelo Gemini 2.5 Flash Image está desenhando os detalhes com precisão de IA.
            </p>
          </div>
        </div>
      )}

      {status === "success" && resultUrl && (
        <div className="space-y-3.5">
          <div className="relative rounded-xl overflow-hidden border border-slate-800/80 aspect-video max-h-56 bg-slate-950 flex items-center justify-center">
            <img src={resultUrl} alt="Generated AI media" className="max-h-full max-w-full object-contain" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStatus("idle")}
              className="py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-colors"
            >
              Criar Outra
            </button>
            <button
              onClick={handleSend}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer"
            >
              <Check size={14} />
              <span>Enviar no Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
