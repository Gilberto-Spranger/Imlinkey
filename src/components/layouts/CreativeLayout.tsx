import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Zap, User, Briefcase, GraduationCap, Linkedin, Github, Twitter, Instagram, Facebook, Globe, UserCheck } from 'lucide-react';

export default function CreativeLayout({ data }: { data: CVData }) {
  const nameParts = data.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="min-h-[297mm] w-[210mm] bg-[#020617] text-white flex mx-auto overflow-hidden font-sans">
      <div className="w-[40%] bg-[#0f172a] p-12 flex flex-col border-r border-white/5">
        <div className="relative mb-12">
          <div className="aspect-square rounded-3xl bg-slate-800 overflow-hidden border-4 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            {data.image ? <img src={data.image} alt={data.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-700 text-8xl font-black italic">{firstName.charAt(0)}</div>}
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl rotate-12"><Zap size={32} className="text-white" /></div>
        </div>
        <h1 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter mb-4">{firstName}<br/><span className="text-blue-500">{lastName}</span></h1>
        <p className="text-slate-400 tracking-[0.3em] text-[10px] uppercase font-black mb-16">{data.job_title}</p>
        <section className="mb-16 space-y-6">
          <h3 className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em] mb-6">Connect</h3>
          <div className="space-y-4 text-[11px] font-medium text-slate-400">
            <div className="flex items-center gap-4 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors"><Mail size={14} className="text-white" /></div><span className="break-all">{data.email}</span></div>
            <div className="flex items-center gap-4 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors"><Phone size={14} className="text-white" /></div><span>{data.phone}</span></div>
            {data.website && <div className="flex items-center gap-4 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors"><Globe size={14} className="text-white" /></div><span>{data.website}</span></div>}
          </div>
        </section>
        {data.socials && data.socials.length > 0 && (
          <section className="mb-16 space-y-6">
            <h3 className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em] mb-6">Socials</h3>
            <div className="space-y-4 text-[11px] font-medium text-slate-400">
              {data.socials.map((social, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    {social.platform === 'linkedin' && <Linkedin size={14} className="text-white" />}
                    {social.platform === 'github' && <Github size={14} className="text-white" />}
                    {social.platform === 'twitter' && <Twitter size={14} className="text-white" />}
                    {social.platform === 'instagram' && <Instagram size={14} className="text-white" />}
                    {social.platform === 'facebook' && <Facebook size={14} className="text-white" />}
                    {social.platform === 'portfolio' && <Globe size={14} className="text-white" />}
                  </div>
                  <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="w-[60%] p-16 space-y-16 flex flex-col">
        <section>
          <div className="flex items-center gap-4 mb-8"><div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><User size={20} className="text-white" /></div><h2 className="text-xl font-black uppercase tracking-tight">The Profile</h2></div>
          <p className="text-[13px] text-slate-400 leading-relaxed text-justify whitespace-pre-line font-medium">{data.about}</p>
        </section>
        <section>
          <div className="flex items-center gap-4 mb-10"><div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><Briefcase size={20} className="text-white" /></div><h2 className="text-xl font-black uppercase tracking-tight">The Journey</h2></div>
          <div className="space-y-12">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="relative pl-8 border-l-2 border-slate-800 hover:border-blue-500 transition-colors">
                <div className="absolute w-4 h-4 bg-[#020617] border-2 border-blue-500 rounded-full -left-[9px] top-0" />
                <div className="flex justify-between items-baseline mb-2"><h4 className="font-black text-base uppercase tracking-tight text-white">{exp.role}</h4><span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">{exp.period}</span></div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">{exp.company}</p>
                <p className="text-[12px] text-slate-400 leading-relaxed whitespace-pre-line text-justify">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10"><div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><UserCheck size={20} className="text-white" /></div><h2 className="text-xl font-black uppercase tracking-tight">References</h2></div>
            <div className="grid grid-cols-1 gap-8">
              {data.references.map((ref) => (
                <div key={ref.id} className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <h4 className="font-black text-base uppercase tracking-tight text-white mb-1">{ref.name}</h4>
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{ref.position} @ {ref.company}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
