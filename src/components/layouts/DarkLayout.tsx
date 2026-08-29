import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function DarkLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-[#0a0a0a] text-slate-300 font-sans flex flex-col p-16 gap-16">
      <header className="flex justify-between items-end border-b border-slate-800 pb-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">{data.name}</h1>
            <h2 className="text-2xl font-bold text-slate-500 uppercase tracking-[0.3em]">{data.job_title}</h2>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-slate-700" /><span>{data.email}</span></div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-slate-700" /><span>{data.phone}</span></div>
            {data.website && <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-slate-700" /><span>{data.website}</span></div>}
            {data.socials && data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-3">
                {social.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-slate-700" />}
                {social.platform === 'github' && <Github className="w-5 h-5 text-slate-700" />}
                {social.platform === 'twitter' && <Twitter className="w-5 h-5 text-slate-700" />}
                {social.platform === 'instagram' && <Instagram className="w-5 h-5 text-slate-700" />}
                {social.platform === 'facebook' && <Facebook className="w-5 h-5 text-slate-700" />}
                {social.platform === 'portfolio' && <Globe className="w-5 h-5 text-slate-700" />}
                <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        {data.image && (
          <div className="w-48 h-48 rounded-2xl overflow-hidden shrink-0 ml-8 shadow-2xl border-4 border-slate-800 grayscale contrast-125 hover:grayscale-0 transition-all duration-500">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="flex flex-col gap-20">
        <section className="grid grid-cols-[1fr_3fr] gap-16 items-start">
          <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.5em] border-l-4 border-slate-800 pl-4">Profile</h3>
          <p className="text-slate-400 leading-relaxed text-xl font-medium italic">{data.about}</p>
        </section>
        <section className="grid grid-cols-[1fr_3fr] gap-16 items-start">
          <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.5em] border-l-4 border-slate-800 pl-4">Experience</h3>
          <div className="space-y-16">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-4"><h4 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">{exp.role}</h4><span className="text-xs font-black text-slate-600 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded">{exp.period}</span></div>
                <div className="flex justify-between text-lg font-bold text-slate-500 mb-6 uppercase tracking-widest"><span>{exp.company}</span></div>
                <p className="text-slate-500 leading-relaxed text-sm font-medium border-l border-slate-800 pl-6">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section className="grid grid-cols-[1fr_3fr] gap-16 items-start">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.5em] border-l-4 border-slate-800 pl-4">References</h3>
            <div className="grid grid-cols-2 gap-12">
              {data.references.map((ref) => (
                <div key={ref.id} className="p-8 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{ref.name}</h4>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{ref.position} @ {ref.company}</div>
                  <div className="text-sm text-slate-400 italic">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
