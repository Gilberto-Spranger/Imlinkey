import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function CompactLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-sans flex flex-col p-8 gap-6">
      <header className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{data.name}</h1>
          <h2 className="text-lg font-medium text-blue-600">{data.job_title}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1"><Mail className="w-3 h-3" /><span>{data.email}</span></div>
            <div className="flex items-center gap-1"><Phone className="w-3 h-3" /><span>{data.phone}</span></div>
            {data.website && <div className="flex items-center gap-1"><Globe className="w-3 h-3" /><span>{data.website}</span></div>}
            {data.socials && data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-1">
                {social.platform === 'linkedin' && <Linkedin className="w-3 h-3" />}
                {social.platform === 'github' && <Github className="w-3 h-3" />}
                {social.platform === 'twitter' && <Twitter className="w-3 h-3" />}
                {social.platform === 'instagram' && <Instagram className="w-3 h-3" />}
                {social.platform === 'facebook' && <Facebook className="w-3 h-3" />}
                {social.platform === 'portfolio' && <Globe className="w-3 h-3" />}
                <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        {data.image && (
          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 ml-4">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="grid grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold border-b border-slate-100 mb-2 uppercase tracking-widest text-slate-400">Profile</h3>
            <p className="text-slate-700 leading-snug text-sm">{data.about}</p>
          </section>
          <section>
            <h3 className="text-sm font-bold border-b border-slate-100 mb-4 uppercase tracking-widest text-slate-400">Experience</h3>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">{exp.role}</h4>
                    <span className="text-xs font-bold text-slate-400">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          {data.references && data.references.length > 0 && (
            <section>
              <h3 className="text-sm font-bold border-b border-slate-100 mb-4 uppercase tracking-widest text-slate-400">References</h3>
              <div className="grid grid-cols-1 gap-4">
                {data.references.map((ref) => (
                  <div key={ref.id}>
                    <h4 className="font-bold text-slate-900 text-xs">{ref.name}</h4>
                    <div className="text-[10px] font-medium text-slate-500 italic mb-1">{ref.position} @ {ref.company}</div>
                    <div className="text-[10px] text-slate-400">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold border-b border-slate-100 mb-4 uppercase tracking-widest text-slate-400">Expertise</h3>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span key={skill.name} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded">{skill.name}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
