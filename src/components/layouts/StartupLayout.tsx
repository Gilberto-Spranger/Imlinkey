import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';
import { CVData } from '@/types';

export default function StartupLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-slate-50 text-slate-900 font-sans p-16 flex flex-col gap-12">
      <header className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <h2 className="text-lg text-slate-500">{data.job_title}</h2>
        </div>
        <div className="text-right space-y-1 text-xs text-slate-400">
          <div className="flex items-center justify-end gap-2">{data.email} <Mail size={14} /></div>
          <div className="flex items-center justify-end gap-2">{data.phone} <Phone size={14} /></div>
          {data.website && <div className="flex items-center justify-end gap-2">{data.website} <Globe size={14} /></div>}
        </div>
      </header>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold mb-4">About</h3>
            <p className="text-sm leading-relaxed">{data.about}</p>
          </section>
          <section className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold mb-6">Experience</h3>
            <div className="space-y-6">
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <h4 className="font-bold">{exp.role} @ {exp.company}</h4>
                  <p className="text-xs text-slate-400">{exp.period}</p>
                  <p className="text-sm mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          {data.references && data.references.length > 0 && (
            <section className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-6">References</h3>
              <div className="grid grid-cols-2 gap-8">
                {data.references.map(ref => (
                  <div key={ref.id}>
                    <h4 className="font-bold text-sm">{ref.name}</h4>
                    <p className="text-xs text-slate-400">{ref.position} @ {ref.company}</p>
                    <p className="text-xs text-blue-500 mt-1">{ref.contact}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-8">
          {data.socials && data.socials.length > 0 && (
            <section className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-4">Socials</h3>
              <div className="space-y-3">
                {data.socials.map((social, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-600">
                    {social.platform === 'linkedin' && <Linkedin size={14} className="text-blue-500" />}
                    {social.platform === 'github' && <Github size={14} className="text-slate-900" />}
                    {social.platform === 'twitter' && <Twitter size={14} className="text-blue-400" />}
                    {social.platform === 'instagram' && <Instagram size={14} className="text-pink-500" />}
                    {social.platform === 'facebook' && <Facebook size={14} className="text-blue-600" />}
                    {social.platform === 'portfolio' && <Globe size={14} className="text-slate-500" />}
                    <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(s => <span key={s.name} className="px-2 py-1 bg-slate-100 text-xs rounded">{s.name}</span>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
