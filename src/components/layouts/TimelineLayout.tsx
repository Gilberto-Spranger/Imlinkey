import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';
import { CVData } from '@/types';

export default function TimelineLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-sans p-16 flex flex-col gap-12">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black uppercase tracking-tighter">{data.name}</h1>
        <h2 className="text-xl text-slate-500 mt-2">{data.job_title}</h2>
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2"><Mail size={14} className="text-blue-500" /> {data.email}</div>
          <div className="flex items-center gap-2"><Phone size={14} className="text-blue-500" /> {data.phone}</div>
          {data.website && <div className="flex items-center gap-2"><Globe size={14} className="text-blue-500" /> {data.website}</div>}
        </div>
        {data.socials && data.socials.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
            {data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-2">
                {social.platform === 'linkedin' && <Linkedin size={14} className="text-blue-500" />}
                {social.platform === 'github' && <Github size={14} className="text-blue-500" />}
                {social.platform === 'twitter' && <Twitter size={14} className="text-blue-500" />}
                {social.platform === 'instagram' && <Instagram size={14} className="text-blue-500" />}
                {social.platform === 'facebook' && <Facebook size={14} className="text-blue-500" />}
                {social.platform === 'portfolio' && <Globe size={14} className="text-blue-500" />}
                <span>{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        )}
      </header>
      <main className="space-y-12 relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
        <section className="relative pl-12">
          <div className="absolute left-3 top-2 w-2.5 h-2.5 bg-blue-600 rounded-full" />
          <h3 className="font-bold uppercase tracking-widest text-blue-600 mb-4">Experience</h3>
          <div className="space-y-8">
            {data.experiences.map(exp => (
              <div key={exp.id}>
                <h4 className="font-bold">{exp.role}</h4>
                <p className="text-sm text-slate-500">{exp.company} | {exp.period}</p>
                <p className="text-sm mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="relative pl-12">
          <div className="absolute left-3 top-2 w-2.5 h-2.5 bg-blue-600 rounded-full" />
          <h3 className="font-bold uppercase tracking-widest text-blue-600 mb-4">Education</h3>
          <div className="space-y-6">
            {data.educations.map(edu => (
              <div key={edu.id}>
                <h4 className="font-bold">{edu.degree}</h4>
                <p className="text-sm text-slate-500">{edu.institution} | {edu.year}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section className="relative pl-12">
            <div className="absolute left-3 top-2 w-2.5 h-2.5 bg-blue-600 rounded-full" />
            <h3 className="font-bold uppercase tracking-widest text-blue-600 mb-4">References</h3>
            <div className="grid grid-cols-2 gap-8">
              {data.references.map(ref => (
                <div key={ref.id}>
                  <h4 className="font-bold">{ref.name}</h4>
                  <p className="text-sm text-slate-500">{ref.position} @ {ref.company}</p>
                  <p className="text-xs text-blue-600 mt-1">{ref.contact}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
