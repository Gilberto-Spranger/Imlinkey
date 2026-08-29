import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function ExecutiveLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-serif flex flex-col p-16">
      <header className="border-b-2 border-slate-900 pb-8 mb-8 flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-2 uppercase">{data.name}</h1>
          <h2 className="text-2xl font-medium text-slate-600 italic mb-4">{data.job_title}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600 font-sans">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span>{data.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><span>{data.phone}</span></div>
            {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400" /><span>{data.website}</span></div>}
            {data.socials && data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-2">
                {social.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-slate-400" />}
                {social.platform === 'github' && <Github className="w-4 h-4 text-slate-400" />}
                {social.platform === 'twitter' && <Twitter className="w-4 h-4 text-slate-400" />}
                {social.platform === 'instagram' && <Instagram className="w-4 h-4 text-slate-400" />}
                {social.platform === 'facebook' && <Facebook className="w-4 h-4 text-slate-400" />}
                {social.platform === 'portfolio' && <Globe className="w-4 h-4 text-slate-400" />}
                <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        {data.image && (
          <div className="w-40 h-40 border-4 border-slate-100 shadow-lg overflow-hidden shrink-0 ml-8">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="flex flex-col gap-8">
        <section>
          <h3 className="text-lg font-bold border-b border-slate-300 mb-3 uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-5 h-5" /> Professional Summary</h3>
          <p className="text-slate-700 leading-relaxed text-sm font-sans">{data.about}</p>
        </section>
        <section>
          <h3 className="text-lg font-bold border-b border-slate-300 mb-4 uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-5 h-5" /> Professional Experience</h3>
          <div className="space-y-6">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                <div className="flex justify-between items-start mb-1"><h4 className="font-bold text-slate-900">{exp.role}</h4><span className="text-sm font-bold text-slate-500 font-sans">{exp.period}</span></div>
                <div className="flex justify-between text-sm text-slate-600 mb-2 italic"><span>{exp.company}</span></div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <h3 className="text-lg font-bold border-b border-slate-300 mb-4 uppercase tracking-widest flex items-center gap-2"><UserCheck className="w-5 h-5" /> Professional References</h3>
            <div className="grid grid-cols-2 gap-8">
              {data.references.map((ref) => (
                <div key={ref.id}>
                  <h4 className="font-bold text-slate-900 text-base">{ref.name}</h4>
                  <div className="text-sm text-slate-600 italic mb-1">{ref.position} @ {ref.company}</div>
                  <div className="text-sm text-slate-500 font-sans">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
