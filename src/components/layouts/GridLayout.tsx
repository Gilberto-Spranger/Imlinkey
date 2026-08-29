import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function GridLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-slate-100 text-slate-900 font-sans flex flex-col p-8 gap-8">
      <header className="bg-white rounded-3xl p-12 shadow-sm flex justify-between items-center border border-slate-200">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.name}</h1>
            <h2 className="text-xl font-bold text-slate-500 uppercase tracking-[0.2em]">{data.job_title}</h2>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-300" /><span>{data.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-300" /><span>{data.phone}</span></div>
            {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-slate-300" /><span>{data.website}</span></div>}
            {data.socials && data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-2">
                {social.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-slate-300" />}
                {social.platform === 'github' && <Github className="w-4 h-4 text-slate-300" />}
                {social.platform === 'twitter' && <Twitter className="w-4 h-4 text-slate-300" />}
                {social.platform === 'instagram' && <Instagram className="w-4 h-4 text-slate-300" />}
                {social.platform === 'facebook' && <Facebook className="w-4 h-4 text-slate-300" />}
                {social.platform === 'portfolio' && <Globe className="w-4 h-4 text-slate-300" />}
                <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        {data.image && (
          <div className="w-40 h-40 rounded-2xl overflow-hidden shrink-0 ml-8 shadow-xl">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-6">About</h3>
            <p className="text-slate-700 leading-relaxed text-lg font-medium italic">{data.about}</p>
          </section>
          <section className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Experience</h3>
            <div className="space-y-10">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2"><h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">{exp.role}</h4><span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">{exp.period}</span></div>
                  <div className="flex justify-between text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest"><span>{exp.company}</span></div>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          {data.references && data.references.length > 0 && (
            <section className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8">References</h3>
              <div className="grid grid-cols-2 gap-8">
                {data.references.map((ref) => (
                  <div key={ref.id}>
                    <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-1">{ref.name}</h4>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{ref.position} @ {ref.company}</div>
                    <div className="text-xs text-slate-500 italic">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.name} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">{skill.name}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
