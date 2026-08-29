import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function SidebarRightLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-sans flex flex-row">
      <div className="flex-1 p-16 flex flex-col gap-12">
        <header className="space-y-4">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.name}</h1>
          <h2 className="text-2xl font-bold text-slate-500 uppercase tracking-[0.2em]">{data.job_title}</h2>
          <p className="text-slate-700 leading-relaxed text-lg font-medium italic pt-4 border-t border-slate-100">{data.about}</p>
        </header>
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-10 border-b border-slate-100 pb-4">Experience</h3>
          <div className="space-y-12">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <h4 className="text-2xl font-black uppercase tracking-tighter">{exp.role}</h4>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{exp.company} | {exp.period}</p>
                <p className="text-sm mt-4 text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-10 border-b border-slate-100 pb-4">References</h3>
            <div className="grid grid-cols-1 gap-8">
              {data.references.map((ref) => (
                <div key={ref.id}>
                  <h4 className="text-xl font-black uppercase tracking-tighter">{ref.name}</h4>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{ref.position} @ {ref.company}</div>
                  <div className="text-xs text-slate-500 italic">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <aside className="w-[30%] bg-slate-50 p-12 border-l border-slate-100 space-y-12">
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Contact</h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2"><Mail size={14} /> {data.email}</div>
            <div className="flex items-center gap-2"><Phone size={14} /> {data.phone}</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> {data.address}</div>
            {data.website && <div className="flex items-center gap-2"><Globe size={14} /> {data.website}</div>}
          </div>
        </section>
        {data.socials && data.socials.length > 0 && (
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Socials</h3>
            <div className="space-y-4 text-xs">
              {data.socials.map((social, i) => (
                <div key={i} className="flex items-center gap-2">
                  {social.platform === 'linkedin' && <Linkedin size={14} />}
                  {social.platform === 'github' && <Github size={14} />}
                  {social.platform === 'twitter' && <Twitter size={14} />}
                  {social.platform === 'instagram' && <Instagram size={14} />}
                  {social.platform === 'facebook' && <Facebook size={14} />}
                  {social.platform === 'portfolio' && <Globe size={14} />}
                  <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(s => <span key={s.name} className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-bold uppercase rounded">{s.name}</span>)}
          </div>
        </section>
      </aside>
    </div>
  );
}
