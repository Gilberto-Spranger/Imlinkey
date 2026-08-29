import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Star, Sparkles, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function GlassLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-gradient-to-tr from-blue-400 via-emerald-400 to-indigo-500 text-slate-900 font-sans flex flex-col p-12 gap-12 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse" />
      <header className="bg-white/40 backdrop-blur-2xl rounded-[40px] p-12 shadow-2xl border border-white/40 flex justify-between items-center relative z-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.name}</h1>
            <div className="flex items-center gap-3"><h2 className="text-2xl font-bold text-indigo-700 uppercase tracking-[0.2em]">{data.job_title}</h2><Sparkles className="w-6 h-6 text-indigo-600" /></div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-black text-slate-700 uppercase tracking-widest">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-600" /><span>{data.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-600" /><span>{data.phone}</span></div>
            {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-600" /><span>{data.website}</span></div>}
            {data.socials && data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-2">
                {social.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-indigo-600" />}
                {social.platform === 'github' && <Github className="w-4 h-4 text-indigo-600" />}
                {social.platform === 'twitter' && <Twitter className="w-4 h-4 text-indigo-600" />}
                {social.platform === 'instagram' && <Instagram className="w-4 h-4 text-indigo-600" />}
                {social.platform === 'facebook' && <Facebook className="w-4 h-4 text-indigo-600" />}
                {social.platform === 'portfolio' && <Globe className="w-4 h-4 text-indigo-600" />}
                <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        {data.image && (
          <div className="w-44 h-44 rounded-full overflow-hidden shrink-0 ml-8 shadow-2xl border-8 border-white/40 p-1">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover rounded-full" />
          </div>
        )}
      </header>
      <div className="flex flex-col gap-12 relative z-10">
        <section className="bg-white/30 backdrop-blur-xl rounded-[40px] p-10 border border-white/30 shadow-xl">
          <h3 className="text-xs font-black text-indigo-700 uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><Star className="w-4 h-4" /> Professional Profile</h3>
          <p className="text-slate-800 leading-relaxed text-xl font-medium italic">{data.about}</p>
        </section>
        <section className="bg-white/40 backdrop-blur-2xl rounded-[40px] p-12 shadow-2xl border border-white/40">
          <h3 className="text-xs font-black text-indigo-700 uppercase tracking-[0.4em] mb-10 border-b-2 border-white/20 pb-4">Experience</h3>
          <div className="space-y-12">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="group relative pl-8">
                <div className="absolute left-0 top-1 bottom-0 w-1 bg-white/20 group-hover:bg-indigo-600 transition-colors rounded-full" />
                <div className="flex justify-between items-start mb-2"><h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none group-hover:text-indigo-700 transition-colors">{exp.role}</h4><span className="text-xs font-black text-indigo-700 bg-white/30 px-3 py-1 rounded-full uppercase tracking-widest">{exp.period}</span></div>
                <div className="flex justify-between text-sm font-bold text-slate-600 mb-4 uppercase tracking-widest"><span>{exp.company}</span></div>
                <p className="text-slate-700 leading-relaxed text-sm font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section className="bg-white/40 backdrop-blur-2xl rounded-[40px] p-12 shadow-2xl border border-white/40">
            <h3 className="text-xs font-black text-indigo-700 uppercase tracking-[0.4em] mb-10 border-b-2 border-white/20 pb-4">References</h3>
            <div className="grid grid-cols-2 gap-8">
              {data.references.map((ref) => (
                <div key={ref.id} className="p-6 bg-white/20 rounded-3xl border border-white/30">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">{ref.name}</h4>
                  <div className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-4">{ref.position} @ {ref.company}</div>
                  <div className="text-sm text-slate-600 italic">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
