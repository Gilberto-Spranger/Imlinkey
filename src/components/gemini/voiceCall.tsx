"use client";

import React, { useState, useEffect, useRef } from "react";
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot } from "lucide-react";

interface VoiceCallProps {
  botName: string;
  botAvatar: string;
  onSendMessage: (message: string) => Promise<string>;
  onClose: () => void;
}

export default function VoiceCall({ botName, botAvatar, onSendMessage, onClose }: VoiceCallProps) {
  const [callStatus, setCallStatus] = useState<"connecting" | "active" | "user-speaking" | "bot-thinking" | "bot-speaking">("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [transcript, setTranscript] = useState("Conectando chamada criptografada...");
  const [botResponse, setBotResponse] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isSpeechActive = useRef(true);

  // Initialize call
  useEffect(() => {
    isSpeechActive.current = true;
    
    // Play connecting sound / trigger status
    const timer = setTimeout(() => {
      setCallStatus("active");
      setTranscript("Chamada ativa. Pode começar a falar...");
      speakText("Olá! Estou conectado. Como posso ajudar você hoje?");
      startListening();
    }, 1500);

    return () => {
      isSpeechActive.current = false;
      stopListening();
      stopAudio();
    };
  }, []);

  // Stop current active voice synthesis/audio
  const stopAudio = () => {
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {}
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Speaks text using either backend Gemini TTS or browser synthesis fallback
  const speakText = async (text: string) => {
    if (!isSoundEnabled || !isSpeechActive.current) return;
    setCallStatus("bot-speaking");
    setBotResponse(text);

    try {
      // Attempt backend Gemini high-quality TTS
      const res = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "Zephyr" }),
      });

      if (!res.ok) throw new Error("TTS endpoint error");
      const data = await res.json();
      
      if (data.audioData && isSpeechActive.current) {
        stopAudio();
        // Play PCM/WAV using Web Audio API
        const audioData = atob(data.audioData);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        currentAudioSourceRef.current = source;

        source.onended = () => {
          if (isSpeechActive.current) {
            setCallStatus("active");
            setTranscript("Ouvindo você...");
            startListening();
          }
        };

        source.start(0);
        return;
      }
    } catch (e) {
      console.warn("Falling back to client-side Web SpeechSynthesis:", e);
    }

    // Client-side fallback speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis && isSpeechActive.current) {
      stopAudio();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-PT"; // default Portuguese, or auto-detect
      utterance.onend = () => {
        if (isSpeechActive.current) {
          setCallStatus("active");
          setTranscript("Ouvindo você...");
          startListening();
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  // Setup Web Speech API speech recognition
  const startListening = () => {
    if (isMuted || !isSpeechActive.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "pt-PT"; // Portuguese default

      rec.onstart = () => {
        if (isSpeechActive.current) {
          setCallStatus("user-speaking");
        }
      };

      rec.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        if (!spokenText.trim() || !isSpeechActive.current) return;

        setTranscript(`Você: "${spokenText}"`);
        setCallStatus("bot-thinking");
        stopListening();

        // Send spoken text to parent to query Gemini chatbot
        const reply = await onSendMessage(spokenText);
        if (isSpeechActive.current) {
          speakText(reply);
        }
      };

      rec.onerror = (e: any) => {
        console.warn("Recognition error:", e.error);
        if (e.error === "no-speech") {
          // Restart listing if silent
          if (isSpeechActive.current && callStatus === "user-speaking") {
            setCallStatus("active");
          }
        }
      };

      rec.onend = () => {
        // Keep listening unless state shifted to thinking or speaking
        if (isSpeechActive.current && callStatus === "user-speaking") {
          setCallStatus("active");
          setTimeout(startListening, 1000);
        }
      };

      rec.start();
    } catch (err) {
      console.error("Failed starting speech recognition:", err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setTranscript("Microfone ativado. Ouvindo...");
      startListening();
    } else {
      setIsMuted(true);
      setTranscript("Microfone silenciado.");
      stopListening();
      if (callStatus === "user-speaking") setCallStatus("active");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020617]/98 z-50 flex flex-col items-center justify-between p-8 text-slate-100 backdrop-blur-md">
      
      {/* Voice Call Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-900/40 flex items-center justify-center text-lg shadow-inner">
            {botAvatar}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              {botName} <Sparkles size={13} className="text-amber-400" />
            </h3>
            <span className="text-[10px] text-indigo-400 uppercase font-mono tracking-widest font-bold">
              Chamada de Voz de IA
            </span>
          </div>
        </div>

        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider animate-pulse">
          Encriptado End-To-End
        </div>
      </div>

      {/* Pulsing Visualizer Core Orb */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full gap-8">
        <div className="relative flex items-center justify-center">
          {/* Animated glow waves depending on call state */}
          <div className={`absolute rounded-full filter blur-2xl opacity-40 transition-all duration-1000 ${
            callStatus === "bot-speaking" 
              ? "w-80 h-80 bg-indigo-500 scale-110" 
              : callStatus === "user-speaking"
              ? "w-72 h-72 bg-emerald-500 scale-105"
              : callStatus === "bot-thinking"
              ? "w-64 h-64 bg-violet-600 animate-spin"
              : "w-60 h-60 bg-slate-800"
          }`} />

          {/* Secondary pulsator */}
          <div className={`absolute rounded-full border border-indigo-500/20 transition-all duration-500 ${
            callStatus === "bot-speaking"
              ? "w-56 h-56 animate-ping bg-indigo-500/10"
              : callStatus === "user-speaking"
              ? "w-56 h-56 animate-ping bg-emerald-500/10"
              : "w-48 h-48"
          }`} />

          {/* Core Orb UI */}
          <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 relative shadow-2xl z-10 border ${
            callStatus === "bot-speaking"
              ? "bg-gradient-to-tr from-indigo-900 to-violet-700 border-indigo-400 text-white scale-105 shadow-indigo-500/35"
              : callStatus === "user-speaking"
              ? "bg-gradient-to-tr from-emerald-900 to-teal-700 border-emerald-400 text-white shadow-emerald-500/25"
              : callStatus === "bot-thinking"
              ? "bg-gradient-to-tr from-fuchsia-950 to-indigo-950 border-fuchsia-700 text-slate-300 animate-pulse"
              : "bg-slate-900 border-slate-700 text-slate-400"
          }`}>
            <Bot size={48} className={callStatus === "bot-thinking" ? "animate-bounce" : ""} />
          </div>
        </div>

        {/* Text cues of what's happening */}
        <div className="text-center space-y-2 px-6">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            {callStatus === "connecting" && "Iniciando canais seguros..."}
            {callStatus === "active" && "Imlinkey Voz Inteligente está ativado"}
            {callStatus === "user-speaking" && "Microfone Ativo • Captando voz..."}
            {callStatus === "bot-thinking" && `${botName} está a processar...`}
            {callStatus === "bot-speaking" && `${botName} falando`}
          </p>
          <div className="bg-slate-950/60 border border-slate-900/80 p-3.5 rounded-2xl max-w-sm mx-auto shadow-inner">
            <p className="text-xs md:text-sm font-semibold text-slate-200 italic leading-snug">
              {transcript}
            </p>
          </div>
        </div>
      </div>

      {/* Control Actions Bottom Bar */}
      <div className="w-full max-w-md flex items-center justify-center gap-6">
        
        {/* Toggle Mute microphone */}
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
            isMuted
              ? "bg-rose-950/30 border-rose-800/60 text-rose-400 hover:bg-rose-950/50"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          }`}
          title={isMuted ? "Ativar Microfone" : "Mutar Microfone"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* End Call (Hang Up) */}
        <button
          onClick={onClose}
          className="w-16 h-16 rounded-2xl bg-rose-600 hover:bg-rose-500 border border-rose-500/20 flex items-center justify-center text-white cursor-pointer shadow-lg shadow-rose-950/50 hover:scale-105 transition-all"
          title="Desligar Chamada"
        >
          <PhoneOff size={24} />
        </button>

        {/* Toggle Sound playback */}
        <button
          onClick={() => {
            const val = !isSoundEnabled;
            setIsSoundEnabled(val);
            if (!val) stopAudio();
          }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
            !isSoundEnabled
              ? "bg-slate-950 border-slate-850 text-slate-600"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          }`}
          title={isSoundEnabled ? "Desativar Áudio" : "Ativar Áudio"}
        >
          {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

      </div>

    </div>
  );
}
