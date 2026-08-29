"use client";

import React from "react";
import { ProfileLayout, Section } from "@/components/ui";
import { 
  Rocket, 
  Target, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Users,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <ProfileLayout>
        <div className="max-w-4xl w-full mx-auto space-y-12 p-4">
          
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8 text-sky-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              Sobre o Imlinkey
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
              A plataforma multifuncional que transforma a forma como criadores, artistas e profissionais conectam seus conteúdos ao mundo.
            </p>
          </div>

          {/* Cards de Missão e Visão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all" />
              <Target className="w-10 h-10 text-sky-400 mb-6" />
              <h2 className="text-2xl font-black mb-4">Nossa Missão</h2>
              <p className="text-white/50 leading-relaxed font-medium">
                Democratizar a presença digital de alto nível. Nossa missão é consolidar links, produtos e experiências em um hub único e elegante, promovendo a monetização direta para quem vive de criatividade.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              <Rocket className="w-10 h-10 text-indigo-400 mb-6" />
              <h2 className="text-2xl font-black mb-4">Nossa Visão</h2>
              <p className="text-white/50 leading-relaxed font-medium">
                Ser o padrão global em bio-links inteligentes, onde a segurança e a inovação caminham juntas para facilitar o compartilhamento de conteúdo seguro entre profissionais e seu público fiel.
              </p>
            </div>
          </div>

          {/* O Que Nos Torna Únicos - Section Component */}
          <Section title="O Que Nos Torna Únicos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400"><Zap size={20} /></div>
                <div>
                  <h4 className="font-bold text-white">Alta Performance</h4>
                  <p className="text-sm text-white/40">Páginas ultra-rápidas otimizadas para SEO e conversão.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><ShieldCheck size={20} /></div>
                <div>
                  <h4 className="font-bold text-white">Segurança Total</h4>
                  <p className="text-sm text-white/40">Proteção de dados e links rastreáveis com total privacidade.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Globe size={20} /></div>
                <div>
                  <h4 className="font-bold text-white">Global & Escalável</h4>
                  <p className="text-sm text-white/40">Pronto para conectar você a seguidores em qualquer lugar do globo.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><Users size={20} /></div>
                <div>
                  <h4 className="font-bold text-white">Focado na Comunidade</h4>
                  <p className="text-sm text-white/40">Ferramentas feitas por criadores, para criadores.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Contato Footer */}
          <div className="bg-gradient-to-r from-sky-500/10 to-transparent border border-white/5 p-10 rounded-[3rem] text-center">
            <h2 className="text-2xl font-black mb-4">Vamos conversar?</h2>
            <p className="text-white/40 mb-8 font-medium">
              Dúvidas, sugestões ou parcerias? Estamos a um e-mail de distância.
            </p>
            <a
              href="mailto:imlinkeybio@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-sky-400 hover:text-white transition-all shadow-xl active:scale-95"
            >
              imlinkeybio@gmail.com
            </a>
          </div>

          <footer className="text-center opacity-20 text-[10px] font-black uppercase tracking-[0.4em] pt-10">
            Imlinkey &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </ProfileLayout>
    </div>
  );
}