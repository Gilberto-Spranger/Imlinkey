import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function BoldLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black font-sans flex flex-col">
      <header className="bg-black text-white p-16 flex justify-between items-end">
        <div className="space-y-6">
          <h1 className="text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-4">{data.name}</h1>
          <h2 className="text-2xl font-bold text-yellow-400 uppercase tracking-[0.2em]">{data.job_title}</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-yellow-400" /><span>{data.email}</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-yellow-400" /><span>{data.phone}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-yellow-400" /><span>{data.address}</span></div>
            {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-yellow-400" /><span>{data.website}</span></div>}
            {data.socials && data.socials.map((social, i) => (
              <div key={i} className="flex items-center gap-2">
                {social.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-yellow-400" />}
                {social.platform === 'github' && <Github className="w-4 h-4 text-yellow-400" />}
                {social.platform === 'twitter' && <Twitter className="w-4 h-4 text-yellow-400" />}
                {social.platform === 'instagram' && <Instagram className="w-4 h-4 text-yellow-400" />}
                {social.platform === 'facebook' && <Facebook className="w-4 h-4 text-yellow-400" />}
                {social.platform === 'portfolio' && <Globe className="w-4 h-4 text-yellow-400" />}
                <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            ))}
          </div>
        </div>
        {data.image && (
          <div className="w-48 h-48 border-8 border-yellow-400 shadow-2xl overflow-hidden shrink-0 ml-8">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover grayscale contrast-125" />
          </div>
        )}
      </header>
      <div className="p-16 flex flex-col gap-16">
        <section className="grid grid-cols-[1fr_3fr] gap-12 items-start">
          <h3 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">Profile</h3>
          <p className="text-slate-700 leading-relaxed text-lg font-medium">{data.about}</p>
        </section>
        <section className="grid grid-cols-[1fr_3fr] gap-12 items-start">
          <h3 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">Experience</h3>
          <div className="space-y-12">
            {data.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-4xl font-black uppercase tracking-tighter leading-none">{exp.role}</h4>
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1">{exp.period}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-600 mb-4 uppercase tracking-widest">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <p className="text-slate-700 leading-relaxed text-sm font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section className="grid grid-cols-[1fr_3fr] gap-12 items-start">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">References</h3>
            <div className="grid grid-cols-2 gap-8">
              {data.references.map((ref) => (
                <div key={ref.id} className="border-2 border-black p-6">
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-1">{ref.name}</h4>
                  <div className="text-sm font-black text-yellow-600 uppercase tracking-widest mb-4">{ref.position} @ {ref.company}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
