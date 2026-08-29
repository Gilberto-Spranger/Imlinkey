import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';
import { CVData } from '@/types';

export default function VibrantLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-sans flex flex-col">
      <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-16 text-white space-y-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">{data.name}</h1>
          <h2 className="text-xl font-bold mt-2 opacity-90">{data.job_title}</h2>
        </div>
        <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest opacity-80">
          <div className="flex items-center gap-2"><Mail size={14} /> {data.email}</div>
          <div className="flex items-center gap-2"><Phone size={14} /> {data.phone}</div>
          {data.website && <div className="flex items-center gap-2"><Globe size={14} /> {data.website}</div>}
        </div>
      </header>
      <div className="p-16 grid grid-cols-3 gap-12">
        <main className="col-span-2 space-y-12">
          <section>
            <h3 className="text-xl font-bold text-purple-600 mb-4">Profile</h3>
            <p className="text-sm leading-relaxed">{data.about}</p>
          </section>
          <section>
            <h3 className="text-xl font-bold text-purple-600 mb-6">Experience</h3>
            <div className="space-y-8">
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <h4 className="font-bold text-lg">{exp.role}</h4>
                  <p className="text-sm text-slate-500">{exp.company} | {exp.period}</p>
                  <p className="text-sm mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          {data.references && data.references.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-purple-600 mb-6">References</h3>
              <div className="grid grid-cols-2 gap-8">
                {data.references.map(ref => (
                  <div key={ref.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-bold text-base">{ref.name}</h4>
                    <p className="text-xs text-slate-500">{ref.position} @ {ref.company}</p>
                    <p className="text-xs text-purple-600 mt-2 font-bold">{ref.contact}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        <aside className="space-y-8">
          {data.socials && data.socials.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-purple-600 mb-4">Socials</h3>
              <div className="space-y-3">
                {data.socials.map((social, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                    {social.platform === 'linkedin' && <Linkedin size={14} className="text-blue-600" />}
                    {social.platform === 'github' && <Github size={14} className="text-slate-900" />}
                    {social.platform === 'twitter' && <Twitter size={14} className="text-blue-400" />}
                    {social.platform === 'instagram' && <Instagram size={14} className="text-pink-500" />}
                    {social.platform === 'facebook' && <Facebook size={14} className="text-blue-700" />}
                    {social.platform === 'portfolio' && <Globe size={14} className="text-slate-500" />}
                    <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section>
            <h3 className="text-xl font-bold text-purple-600 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(s => <span key={s.name} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">{s.name}</span>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
