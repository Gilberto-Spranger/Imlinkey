import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, User, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function CorporateLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-sans flex flex-col">
      <div className="h-4 bg-[#1e293b] w-full" />
      <header className="px-16 py-12 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.name}</h1>
          <h2 className="text-xl font-bold text-blue-700 uppercase tracking-[0.2em]">{data.job_title}</h2>
        </div>
        {data.image && (
          <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl grayscale hover:grayscale-0 transition-all">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="bg-[#1e293b] text-white px-16 py-4 flex flex-wrap justify-between items-center text-[10px] font-bold uppercase tracking-widest gap-4">
        <div className="flex items-center gap-2"><Mail size={12} className="text-blue-400" /> {data.email}</div>
        <div className="flex items-center gap-2"><Phone size={12} className="text-blue-400" /> {data.phone}</div>
        <div className="flex items-center gap-2"><MapPin size={12} className="text-blue-400" /> {data.address}</div>
        {data.socials && data.socials.length > 0 && data.socials.map((social, i) => (
          <div key={i} className="flex items-center gap-2">
            {social.platform === 'linkedin' && <Linkedin size={12} className="text-blue-400" />}
            {social.platform === 'github' && <Github size={12} className="text-blue-400" />}
            {social.platform === 'twitter' && <Twitter size={12} className="text-blue-400" />}
            {social.platform === 'instagram' && <Instagram size={12} className="text-blue-400" />}
            {social.platform === 'facebook' && <Facebook size={12} className="text-blue-400" />}
            {social.platform === 'portfolio' && <Globe size={12} className="text-blue-400" />}
            {social.url.replace(/^https?:\/\/(www\.)?/, '')}
          </div>
        ))}
      </div>
      <div className="p-16 grid grid-cols-[1.8fr_1fr] gap-16 flex-1">
        <main className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <User size={18} className="text-blue-700" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Executive Summary</h3>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <p className="text-[12px] leading-relaxed text-slate-600 text-justify font-medium">{data.about}</p>
          </section>
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Briefcase size={18} className="text-blue-700" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Professional Experience</h3>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-10">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">{exp.role}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{exp.period}</span>
                  </div>
                  <p className="text-blue-700 font-bold text-[11px] uppercase tracking-widest mb-3">{exp.company}</p>
                  <p className="text-[11px] leading-relaxed text-slate-600 text-justify whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          {data.references && data.references.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <UserCheck size={18} className="text-blue-700" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Professional References</h3>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                {data.references.map((ref) => (
                  <div key={ref.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{ref.name}</h4>
                    <div className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-2">{ref.position} @ {ref.company}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        <aside className="space-y-12">
          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-6 border-b-2 border-slate-900 pb-2">Core Expertise</h3>
            <div className="space-y-4">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5"><span>{skill.name}</span><span className="text-slate-400">{skill.level}%</span></div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#1e293b]" style={{ width: `${skill.level}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      <div className="mt-auto h-2 bg-blue-700 w-full" />
    </div>
  );
}
