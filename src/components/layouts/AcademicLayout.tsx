import React from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from 'lucide-react';

export default function AcademicLayout({ data }: { data: CVData }) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 font-serif flex flex-col p-20">
      <header className="border-b-4 border-slate-900 pb-10 mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-4">{data.name}</h1>
        <h2 className="text-xl font-medium text-slate-600 italic mb-6">{data.job_title}</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-500 font-sans uppercase tracking-widest">
          <div className="flex items-center gap-2"><Mail className="w-3 h-3" /><span>{data.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-3 h-3" /><span>{data.phone}</span></div>
          <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /><span>{data.address}</span></div>
          {data.website && <div className="flex items-center gap-2"><Globe className="w-3 h-3" /><span>{data.website}</span></div>}
          {data.socials && data.socials.map((social, i) => (
            <div key={i} className="flex items-center gap-2">
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
      </header>
      <div className="flex flex-col gap-12">
        <section>
          <h3 className="text-sm font-black border-b-2 border-slate-900 mb-4 uppercase tracking-[0.3em] text-slate-900">Research Profile</h3>
          <p className="text-slate-700 leading-relaxed text-sm italic">{data.about}</p>
        </section>
        <section>
          <h3 className="text-sm font-black border-b-2 border-slate-900 mb-6 uppercase tracking-[0.3em] text-slate-900">Academic Background</h3>
          <div className="space-y-8">
            {data.educations.map((edu) => (
              <div key={edu.id} className="relative pl-6 border-l-2 border-slate-100">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-lg">{edu.degree}</h4>
                  <span className="text-xs font-black text-slate-400 font-sans uppercase tracking-widest">{edu.year}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 mb-2 font-sans italic">
                  <span>{edu.institution}</span>
                  {edu.location && <span>{edu.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-sm font-black border-b-2 border-slate-900 mb-6 uppercase tracking-[0.3em] text-slate-900">Professional Appointments</h3>
          <div className="space-y-8">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-slate-100">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-lg">{exp.role}</h4>
                  <span className="text-xs font-black text-slate-400 font-sans uppercase tracking-widest">{exp.period}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 mb-3 font-sans italic">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        {data.references && data.references.length > 0 && (
          <section>
            <h3 className="text-sm font-black border-b-2 border-slate-900 mb-6 uppercase tracking-[0.3em] text-slate-900">Academic References</h3>
            <div className="grid grid-cols-2 gap-12">
              {data.references.map((ref) => (
                <div key={ref.id}>
                  <h4 className="font-bold text-slate-900 text-base mb-1">{ref.name}</h4>
                  <div className="text-sm text-slate-600 italic mb-2">{ref.position} @ {ref.company}</div>
                  <div className="text-xs text-slate-500 font-sans uppercase tracking-widest">{ref.contact}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
