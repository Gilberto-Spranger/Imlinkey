"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Download, ArrowLeft, Loader2, FileText, ChevronDown, AlertCircle, Printer } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AxiosError } from "axios";

import { CVData } from "@/types";
import { api } from "@/utils";
import * as Layouts from "@/components/layouts";

interface DownloadOption {
  id: string;
  label: string;
  icon: typeof FileText;
}

const DOWNLOAD_OPTIONS: DownloadOption[] = [
  { id: "pdf", label: "PDF (Pronto para impressão)", icon: FileText },
  { id: "docx", label: "Word (.docx) – Editável", icon: FileText },
  { id: "txt", label: "Texto (.txt) – Simples", icon: FileText },
  { id: "html", label: "HTML – Página Web", icon: FileText },
  { id: "odt", label: "OpenDocument (.odt) – LibreOffice", icon: FileText },
  { id: "tex", label: "LaTeX (.tex) – Profissional", icon: FileText },
  { id: "rtf", label: "RTF – Compatível Universal", icon: FileText },
];

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.cvId as string;

  const [data, setData] = useState<CVData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [toast, setToast] = useState<{ msg: string; upgrade: boolean } | null>(null);

  const layouts: Record<string, React.FC<{ data: CVData }>> = useMemo(
    () => ({
      modern: Layouts.ModernLayout,
      minimal: Layouts.MinimalLayout,
      corporate: Layouts.CorporateLayout,
      creative: Layouts.CreativeLayout,
      executive: Layouts.ExecutiveLayout,
      tech: Layouts.TechLayout,
      academic: Layouts.AcademicLayout,
      elegant: Layouts.ElegantLayout,
      glass: Layouts.GlassLayout,
      swiss: Layouts.SwissLayout,
      bold: Layouts.BoldLayout,
      compact: Layouts.CompactLayout,
      timeline: Layouts.TimelineLayout,
      grid: Layouts.GridLayout,
      "sidebar-right": Layouts.SidebarRightLayout,
      classic: Layouts.ClassicLayout,
      "modern-v2": Layouts.ModernV2Layout,
      startup: Layouts.StartupLayout,
      vibrant: Layouts.VibrantLayout,
      dark: Layouts.DarkLayout,
    }),
    []
  );

  const showFeedback = useCallback((msg: string, upgrade = false) => {
    setToast({ msg, upgrade });
    setTimeout(() => setToast(null), 6000);
  }, []);

  useEffect(() => {
    async function loadCV() {
      if (!cvId) return;

      try {
        const res = await api.get<CVData>(`cv/${cvId}/preview/`);
        if (res.data) setData(res.data);
      } catch (err) {
        console.error("Erro ao carregar CV via API:", err);
        const saved = localStorage.getItem("cv_data_premium");
        if (saved) {
          try {
            setData(JSON.parse(saved));
          } catch (e) {
            console.error("Erro ao ler fallback do localStorage:", e);
          }
        }
      } finally {
        setTimeout(() => setIsReady(true), 600);
      }
    }

    loadCV();
  }, [cvId]);

  const handleNativePrint = () => {
    window.print();
  };

  const downloadCvFile = async (format: string) => {
    const response = await api.post(
      `cv/${cvId}/download/`,
      { format },
      { responseType: "blob" }
    );

    // Correção do Erro de Type Checking no TS (TS2322)
    const rawHeader = response.headers?.["content-disposition"];
    const contentDisposition = typeof rawHeader === "string" ? rawHeader : undefined;

    let filename = `cv.${format}`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);
      if (match?.[1]) filename = match[1];
    }

    const contentType =
      (typeof response.headers?.["content-type"] === "string"
        ? response.headers["content-type"]
        : undefined) || "application/octet-stream";

    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = async (format: string) => {
    if (!data) return;

    setIsDownloading(true);
    setShowDownloadMenu(false);
    showFeedback("Iniciando exportação premium...");

    try {
      await downloadCvFile(format);
      showFeedback("Download concluído com sucesso!");
    } catch (err) {
      const status = (err as AxiosError)?.response?.status;
      if (status === 403) {
        showFeedback("Limite atingido ou plano necessário.", true);
      } else {
        showFeedback("Falha na conexão com o servidor.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isReady || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <div className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Gerando Renderização Premium...
        </div>
      </div>
    );
  }

  const SelectedLayout = layouts[data.layout] || Layouts.ModernLayout;

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-12 relative overflow-x-hidden">
      {/* HEADER CONTROLS */}
      <div className="max-w-[210mm] mx-auto mb-12 flex flex-col sm:flex-row justify-between items-center gap-6 print:hidden">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all font-bold text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar ao Editor
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleNativePrint}
            className="flex items-center gap-3 bg-muted text-foreground border border-border px-6 py-4 rounded-full hover:bg-muted/80 shadow-sm transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            <Printer size={16} className="text-emerald-500" />
            Imprimir / PDF Rápido
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu((prev) => !prev)}
              disabled={isDownloading}
              className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 shadow-sm transition-all font-bold text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Exportar Legado
              <ChevronDown
                size={14}
                className={showDownloadMenu ? "rotate-180 transition-transform" : "transition-transform"}
              />
            </button>

            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-4 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 p-2"
                >
                  {DOWNLOAD_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleDownload(opt.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl font-bold text-[9px] uppercase tracking-widest text-left transition-colors"
                      >
                        <Icon size={14} className="text-primary" />
                        {opt.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CV RENDER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[210mm] mx-auto bg-white shadow-2xl rounded-sm overflow-hidden min-h-[297mm]"
      >
        <SelectedLayout data={data} />
      </motion.div>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-8 right-8 z-[100] w-[320px]"
          >
            <div className="bg-card border border-border p-5 rounded-2xl shadow-2xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                  <AlertCircle className="text-red-500 w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground font-black text-[8px] uppercase tracking-[0.2em]">
                    Notificação do Sistema
                  </span>
                  <p className="text-foreground text-[11px] font-bold leading-relaxed">
                    {toast.msg}
                  </p>
                </div>
              </div>

              {toast.upgrade && (
                <button
                  onClick={() => router.push("/billing")}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-md"
                >
                  Fazer Upgrade Agora
                </button>
              )}

              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-[2px] bg-primary/30 absolute bottom-0 left-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
