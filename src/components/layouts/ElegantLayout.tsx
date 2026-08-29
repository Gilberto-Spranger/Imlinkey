import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function ElegantLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-[#fdfbf7] text-slate-800 font-serif flex flex-col p-16">
      <header className="mb-12 text-center border-b border-slate-200 pb-12">
        <h1 className="text-6xl font-light text-slate-900 tracking-tight mb-4">{data.name}</h1>
        <h2 className="text-lg font-medium text-amber-700 uppercase tracking-[0.4em] mb-8">{data.job_title}</h2>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm text-slate-500 font-sans tracking-widest uppercase">
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-600" /><span>{data.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-600" /><span>{data.phone}</span></div>
          {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-amber-600" /><span>{data.website}</span></div>}
          {data.socials && data.socials.map((social, i) => (
            <div key={i} className="flex items-center gap-2">
              {social.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-amber-600" />}
              {social.platform === 'github' && <Github className="w-4 h-4 text-amber-600" />}
              {social.platform === 'twitter' && <Twitter className="w-4 h-4 text-amber-600" />}
              {social.platform === 'instagram' && <Instagram className="w-4 h-4 text-amber-600" />}
              {social.platform === 'facebook' && <Facebook className="w-4 h-4 text-amber-600" />}
              {social.platform === 'portfolio' && <Globe className="w-4 h-4 text-amber-600" />}
              <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          ))}
        </div>
      </header>
      <div className="flex flex-col gap-16">
        <section className="max-w-3xl mx-auto text-center">
          <h3 className="text-xs font-bold text-amber-700 uppercase tracking-[0.5em] mb-6">About Me</h3>
          <p className="text-slate-600 leading-relaxed text-lg italic">{data.about}</p>
        </section>
        <section>
          <h3 className="text-xs font-bold text-amber-700 uppercase tracking-[0.5em] mb-10 border-b border-slate-100 pb-4">Professional Journey</h3>
          <div className="space-y-12">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[1fr_3fr] gap-12">
                <div className="text-right"><span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{exp.period}</span></div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-light text-slate-900 leading-none">{exp.role}</h4>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">{exp.company}</div>
                  <p className="text-slate-600 leading-relaxed text-sm font-sans">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-[0.5em] mb-10 border-b border-slate-100 pb-4 text-center">References</h3>
            <div className="grid grid-cols-2 gap-12">
              {data.references.map((ref) => (
                <div key={ref.id} className="text-center">
                  <h4 className="text-xl font-light text-slate-900 mb-1">{ref.name}</h4>
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">{ref.position} @ {ref.company}</div>
                  <div className="text-sm text-slate-500 italic">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
