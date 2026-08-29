import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook } from 'lucide-react';

export default function MinimalLayout({ data }: { data: CVData }) {
  return (
    <div className="min-h-[297mm] w-[210mm] bg-white text-zinc-900 mx-auto font-serif p-20 flex flex-col">
      <header className="mb-16 border-b-2 border-zinc-900 pb-12 flex justify-between items-end">
        <div className="max-w-[70%]">
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-6">{data.name}</h1>
          <h2 className="text-xl font-medium italic text-zinc-500 tracking-wide">{data.job_title}</h2>
        </div>
        {data.image && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-100 grayscale">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="grid grid-cols-[1fr_2fr] gap-20 flex-1">
        <aside className="space-y-12">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">Contact</h3>
            <div className="space-y-3 text-[11px] leading-relaxed">
              <p className="flex items-center gap-2"><Mail size={12} /> {data.email}</p>
              <p className="flex items-center gap-2"><Phone size={12} /> {data.phone}</p>
              {data.website && <p className="flex items-center gap-2"><Globe size={12} /> {data.website}</p>}
            </div>
          </section>
          {data.socials && data.socials.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">Social</h3>
              <div className="space-y-3 text-[11px] leading-relaxed">
                {data.socials.map((social, i) => (
                  <p key={i} className="flex items-center gap-2">
                    {social.platform === 'linkedin' && <Linkedin size={12} />}
                    {social.platform === 'github' && <Github size={12} />}
                    {social.platform === 'twitter' && <Twitter size={12} />}
                    {social.platform === 'instagram' && <Instagram size={12} />}
                    {social.platform === 'facebook' && <Facebook size={12} />}
                    {social.platform === 'portfolio' && <Globe size={12} />}
                    <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">Expertise</h3>
            <ul className="space-y-2 text-[11px] font-medium">
              {data.skills.map((skill, i) => (
                <li key={i} className="flex justify-between items-center border-b border-zinc-100 pb-1"><span>{skill.name}</span><span className="text-[9px] text-zinc-400">{skill.level}%</span></li>
              ))}
            </ul>
          </section>
        </aside>
        <main className="space-y-16">
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">Summary</h3>
            <p className="text-[13px] leading-relaxed text-zinc-700 text-justify first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">{data.about}</p>
          </section>
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-8">Experience</h3>
            <div className="space-y-12">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2"><h4 className="text-lg font-bold text-zinc-900">{exp.role}</h4><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{exp.period}</span></div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4">{exp.company}</p>
                  <p className="text-[12px] leading-relaxed text-zinc-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          {data.references && data.references.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-8">References</h3>
              <div className="grid grid-cols-1 gap-8">
                {data.references.map((ref) => (
                  <div key={ref.id}>
                    <h4 className="text-sm font-bold text-zinc-900 mb-1">{ref.name}</h4>
                    <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-1">{ref.position} @ {ref.company}</div>
                    <div className="text-[11px] text-zinc-600 italic">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
