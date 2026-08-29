"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, Check, Sparkles, Languages } from "lucide-react";

interface AudioRecorderProps {
  onAudioReady: (audioUrl: string, blob: Blob) => void;
  onTranscriptionReady: (text: string) => void;
  isTranscribing: boolean;
  setIsTranscribing: (val: boolean) => void;
}

export default function AudioRecorder({
  onAudioReady,
  onTranscriptionReady,
  isTranscribing,
  setIsTranscribing,
}: AudioRecorderProps) {
  const [status, setStatus] = useState<"idle" | "recording" | "recorded">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  // Clean up audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioBlobRef.current = audioBlob;
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setStatus("recorded");
        
        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setStatus("recording");
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Não foi possível acessar seu microfone. Por favor, verifique as permissões de áudio no seu navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    resetRecorder();
  };

  const resetRecorder = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioBlobRef.current = null;
    setStatus("idle");
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Convert audio blob to base64 and request server transcription
  const handleTranscribe = async () => {
    if (!audioBlobRef.current) return;
    setIsTranscribing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlobRef.current);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        const response = await fetch("/api/transcribe-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioData: base64Data,
            mimeType: "audio/webm",
          }),
        });

        const data = await response.json();
        if (data.transcription) {
          onTranscriptionReady(data.transcription);
          resetRecorder();
        } else {
          alert("Não conseguimos transcrever seu áudio. Tente falar mais claro ou de novo.");
        }
      };
    } catch (err) {
      console.error("Transcription failed:", err);
      alert("Erro de conexão ao transcrever o áudio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSendAudio = () => {
    if (audioUrl && audioBlobRef.current) {
      onAudioReady(audioUrl, audioBlobRef.current);
      resetRecorder();
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl max-w-lg mx-auto w-full">
      {status === "idle" && (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Mic size={16} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Mensagem de Voz</p>
              <p className="text-[10px] text-slate-400">Grave um áudio para enviar ou transcrever</p>
            </div>
          </div>
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Mic size={14} />
            <span>Gravar</span>
          </button>
        </div>
      )}

      {status === "recording" && (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </div>
            <span className="text-xs font-semibold font-mono text-rose-400">
              Gravando... {formatTime(recordingTime)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cancelRecording}
              className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs transition-colors"
              title="Cancelar"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-slate-100 hover:bg-white text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              title="Parar e Salvar"
            >
              <Square size={12} className="fill-slate-950" />
              <span>Concluir</span>
            </button>
          </div>
        </div>
      )}

      {status === "recorded" && (
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayback}
                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </button>
              <span className="text-xs text-slate-300 font-medium">Áudio Gravado</span>
            </div>
            <button
              onClick={resetRecorder}
              className="p-2 hover:bg-slate-900 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
              title="Excluir gravação"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={handleTranscribe}
              disabled={isTranscribing}
              className="px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {isTranscribing ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Transcrevendo...</span>
                </>
              ) : (
                <>
                  <Languages size={13} />
                  <span>Transcrever Áudio</span>
                </>
              )}
            </button>
            <button
              onClick={handleSendAudio}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Check size={13} />
              <span>Enviar Áudio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
