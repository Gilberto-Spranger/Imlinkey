"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Database } from "lucide-react";

import { api, loadCVFromStorage, saveCVToStorage } from "@/utils";
import { CVData } from "@/types";
import CVForm from "@/components/forms/CVForm";
import { LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

const INITIAL_DATA: CVData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  about: "",
  job_title: "",
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  professional_courses: [],
  certifications: [],
  projects: [],
  references: [],
  interests: [],
  socials: [],
  layout: "modern",
};

export default function CVPage() {
  const router = useRouter();
  const loadingAuth = useAuthRedirect();

  // ---------------- FORM STATE ----------------
  const [formData] = useState<CVData>(() => {
    if (typeof window !== "undefined") {
      return loadCVFromStorage() || INITIAL_DATA;
    }
    return INITIAL_DATA;
  });

  // ---------------- PROCESS / UX STATES ----------------
  const [isSyncing, setIsSyncing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("Processando dados...");
  const [apiDone, setApiDone] = useState(false);
  const [cvId, setCvId] = useState<string | number | null>(null);

  // Phase visual calculation
  const phase = seconds < 6 ? 1 : seconds < 12 ? 2 : 3;

  // ---------------- REFS ----------------
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------- TIMER CONTROLS ----------------
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setSeconds(0);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // ---------------- API SUBMIT ----------------
  const sendToAPI = async (data: CVData & { image_file?: File }) => {
    try {
      const formDataToSend = new FormData();
      const { image, image_file, ...rest } = data;

      // Append serializable parameters
      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (typeof value === "object") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      if (image_file instanceof File) {
        formDataToSend.append("image_file", image_file);
      }

      // Requisição à API do Backend
      const response = await api.post("/cv/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const returnedId = response.data?.id;

      if (returnedId) {
        setCvId(returnedId);
        setApiDone(true);
        setMessage("Finalizando design do seu CV...");

        saveCVToStorage({
          ...rest,
          id: returnedId,
          image: response.data.image || image,
        });
      } else {
        throw new Error("ID não retornado pelo servidor.");
      }
    } catch (err) {
      console.error("Critical submission error:", err);
      stopTimer();
      setIsSyncing(false);
      alert("Falha ao salvar os dados no servidor. Tente novamente.");
    }
  };

  // ---------------- HANDLERS ----------------
  const handleSubmit = useCallback(
    (data: CVData & { image_file?: File }) => {
      setIsSyncing(true);
      setApiDone(false);
      setCvId(null);
      setMessage("Processando dados...");

      startTimer();
      sendToAPI(data);
    },
    [startTimer]
  );

  const handleFinish = useCallback(() => {
    stopTimer();
    setIsSyncing(false);

    if (cvId) {
      router.push(`/cv/preview/${cvId}/`);
    }
  }, [cvId, router, stopTimer]);

  // ---------------- FLOW CONTROL ----------------
  useEffect(() => {
    if (!isSyncing) return;

    // Redireciona com sucesso após pelo menos 6s para simular UX de processamento
    if (apiDone && seconds >= 6) {
      handleFinish();
      return;
    }

    // Timeout de segurança caso a API demore mais de 16s
    if (!apiDone && seconds >= 16) {
      stopTimer();
      setIsSyncing(false);
      alert("Tempo limite atingido ao conectar com o servidor. Tente novamente.");
    }
  }, [seconds, apiDone, isSyncing, handleFinish, stopTimer]);

  // ---------------- RENDER ----------------
  if (loadingAuth) return <LoadingPage />;

  return (
    <main className="min-h-screen bg-background text-foreground py-20 px-4 selection:bg-primary/30">
      {/* 🔮 PROCESS OVERLAY */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-xl z-[100] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-10">
              {/* ⏱ CONTADOR */}
              <motion.div
                key={seconds}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-8xl font-black transition-colors duration-500 ${
                  phase === 1
                    ? "text-blue-500"
                    : phase === 2
                    ? "text-yellow-500"
                    : "text-emerald-500"
                }`}
              >
                {seconds}s
              </motion.div>

              {/* 🧠 LOADER ICON */}
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <Database
                  className={`w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 ${
                  phase === 1
                    ? "text-blue-500"
                    : phase === 2
                    ? "text-yellow-500"
                    : "text-emerald-500"
                }`}
                />
              </div>

              {/* 💬 MENSAGEM */}
              <p className="text-muted-foreground text-xs uppercase tracking-widest animate-pulse text-center max-w-xs">
                {message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧾 MAIN FORM CONTENT */}
      <div className="max-w-5xl mx-auto">
        <header className="mb-20 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            Imlinkey Premium Resume Builder
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">
            Crie seu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              Currículum Vitae
            </span>
          </h1>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card text-card-foreground rounded-[2rem] p-8 md:p-16 border border-border shadow-xl"
        >
          <CVForm
            key={formData.name || "new-cv"}
            initialData={formData}
            onSubmit={handleSubmit}
          />
        </motion.div>

        <footer className="mt-20 text-center text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">
          © 2026 Imlinkey Premium Resume Secure.
        </footer>
      </div>
    </main>
  );
}
