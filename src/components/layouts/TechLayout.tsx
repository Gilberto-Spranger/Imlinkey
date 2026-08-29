import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function TechLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-[#0f172a] text-slate-300 font-mono flex flex-col p-16 gap-12">
      <header className="border-b border-slate-800 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">{data.name}</h1>
        <h2 className="text-xl text-blue-400 mb-6">{data.job_title}</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2"><Mail size={14} /> {data.email}</div>
          <div className="flex items-center gap-2"><Phone size={14} /> {data.phone}</div>
          <div className="flex items-center gap-2"><MapPin size={14} /> {data.address}</div>
          {data.website && <div className="flex items-center gap-2"><Globe size={14} /> {data.website}</div>}
          {data.socials && data.socials.map((social, i) => (
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
      </header>
      <main className="space-y-12">
        <section>
          <h3 className="text-blue-400 text-sm font-bold mb-4 uppercase tracking-widest">./profile</h3>
          <p className="text-sm leading-relaxed">{data.about}</p>
        </section>
        <section>
          <h3 className="text-blue-400 text-sm font-bold mb-6 uppercase tracking-widest">./experience</h3>
          <div className="space-y-8">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="border-l border-slate-800 pl-6">
                <h4 className="text-white font-bold">{exp.role} @ {exp.company}</h4>
                <p className="text-xs text-slate-500 mb-2">{exp.period}</p>
                <p className="text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-blue-400 text-sm font-bold mb-4 uppercase tracking-widest">./skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span key={skill.name} className="px-2 py-1 bg-slate-800 text-xs rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <h3 className="text-blue-400 text-sm font-bold mb-6 uppercase tracking-widest">./references</h3>
            <div className="grid grid-cols-1 gap-6">
              {data.references.map((ref) => (
                <div key={ref.id} className="border-l border-slate-800 pl-6">
                  <h4 className="text-white font-bold">{ref.name}</h4>
                  <p className="text-xs text-slate-500 mb-1">{ref.position} @ {ref.company}</p>
                  <p className="text-xs text-blue-400">{ref.contact}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
