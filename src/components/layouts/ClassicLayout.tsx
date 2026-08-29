import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function ClassicLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black font-serif flex flex-col p-20 gap-10">
      <header className="text-center border-b-2 border-black pb-8">
        <h1 className="text-5xl font-bold tracking-tight mb-4 uppercase">{data.name}</h1>
        <h2 className="text-xl font-medium text-slate-600 italic mb-6">{data.job_title}</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-sans uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{data.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{data.phone}</span></div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{data.address}</span></div>
          {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4" /><span>{data.website}</span></div>}
          {data.socials && data.socials.map((social, i) => (
            <div key={i} className="flex items-center gap-2">
              {social.platform === 'linkedin' && <Linkedin className="w-4 h-4" />}
              {social.platform === 'github' && <Github className="w-4 h-4" />}
              {social.platform === 'twitter' && <Twitter className="w-4 h-4" />}
              {social.platform === 'instagram' && <Instagram className="w-4 h-4" />}
              {social.platform === 'facebook' && <Facebook className="w-4 h-4" />}
              {social.platform === 'portfolio' && <Globe className="w-4 h-4" />}
              <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          ))}
        </div>
      </header>
      <div className="flex flex-col gap-12">
        <section>
          <h3 className="text-lg font-bold border-b border-black mb-4 uppercase tracking-widest text-black">Professional Summary</h3>
          <p className="text-slate-700 leading-relaxed text-sm font-sans">{data.about}</p>
        </section>
        <section>
          <h3 className="text-lg font-bold border-b border-black mb-6 uppercase tracking-widest text-black">Experience</h3>
          <div className="space-y-8">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-black text-lg">{exp.role}</h4>
                  <span className="text-sm font-bold text-slate-500 font-sans uppercase tracking-widest">{exp.period}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 mb-3 font-sans italic">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <h3 className="text-lg font-bold border-b border-black mb-6 uppercase tracking-widest text-black">References</h3>
            <div className="grid grid-cols-2 gap-12">
              {data.references.map((ref) => (
                <div key={ref.id} className="space-y-1">
                  <h4 className="font-bold text-black text-base">{ref.name}</h4>
                  <div className="text-sm text-slate-600 font-sans italic">{ref.position} @ {ref.company}</div>
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
