import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function ModernV2Layout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-sans flex flex-col">
      <header className="bg-slate-50 p-16 flex justify-between items-center border-b border-slate-200">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.name}</h1>
            <h2 className="text-2xl font-bold text-blue-600 uppercase tracking-[0.2em]">{data.job_title}</h2>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" /><span>{data.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-500" /><span>{data.phone}</span></div>
            {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /><span>{data.website}</span></div>}
            {data.socials && data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-2">
                {social.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-500" />}
                {social.platform === 'github' && <Github className="w-4 h-4 text-blue-500" />}
                {social.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-500" />}
                {social.platform === 'instagram' && <Instagram className="w-4 h-4 text-blue-500" />}
                {social.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-500" />}
                {social.platform === 'portfolio' && <Globe className="w-4 h-4 text-blue-500" />}
                <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        {data.image && (
          <div className="w-40 h-40 rounded-full overflow-hidden shrink-0 ml-8 shadow-2xl border-4 border-white">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="p-16 flex flex-col gap-16">
        <section>
          <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-6">About</h3>
          <p className="text-slate-700 leading-relaxed text-lg font-medium italic">{data.about}</p>
        </section>
        <section>
          <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-10 border-b border-slate-100 pb-4">Experience</h3>
          <div className="space-y-12">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[1fr_3fr] gap-12">
                <div><span className="text-sm font-black text-slate-400 uppercase tracking-widest">{exp.period}</span></div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{exp.role}</h4>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{exp.company}</div>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-10 border-b border-slate-100 pb-4">References</h3>
            <div className="grid grid-cols-2 gap-12">
              {data.references.map((ref) => (
                <div key={ref.id} className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">{ref.name}</h4>
                  <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">{ref.position} @ {ref.company}</div>
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
