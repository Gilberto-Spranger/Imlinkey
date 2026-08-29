import React from 'react';
import { CVData } from '@/types';
import {
  Mail, Phone, Globe, Linkedin, Github, Twitter,
  Instagram, Facebook, MapPin, Briefcase, GraduationCap,
  Award, Code, Quote, Heart, Languages, Star, User, UserCheck, BookOpen
} from 'lucide-react';

const SocialIcon = ({ platform, size = 12 }: { platform: string, size?: number }) => {
  switch (platform.toLowerCase()) {
    case 'linkedin': return <Linkedin size={size} />;
    case 'github': return <Github size={size} />;
    case 'twitter':
    case 'x': return <Twitter size={size} />;
    case 'instagram': return <Instagram size={size} />;
    case 'facebook': return <Facebook size={size} />;
    default: return <Globe size={size} />;
  }
};

export default function ModernLayout({ data }: { data: CVData }) {
  return (
    <div className="flex min-h-[297mm] w-[210mm] bg-white text-slate-800 font-sans shadow-2xl overflow-hidden mx-auto print:shadow-none">
      
      {/* SIDEBAR ESQUERDA */}
      <div className="w-[32%] bg-[#0f172a] text-white flex flex-col">
        {/* ÁREA DA IMAGEM */}
        <div className="w-full aspect-square bg-slate-800 overflow-hidden border-b-4 border-blue-500">
          {data.image ? (
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 text-7xl font-black">
              {data.name?.charAt(0) || '?'}
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col gap-y-6 overflow-hidden">
          {/* CONTATO */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3 border-b border-slate-700 pb-1 flex items-center gap-2">
              <User size={12} /> Contato
            </h3>
            <div className="space-y-2 text-[9px] text-slate-300">
              <div className="flex items-center gap-2"><Mail size={10} className="text-blue-400 shrink-0" /><span className="truncate">{data.email}</span></div>
              <div className="flex items-center gap-2"><Phone size={10} className="text-blue-400 shrink-0" /><span>{data.phone}</span></div>
              {data.address && <div className="flex items-center gap-2"><MapPin size={10} className="text-blue-400 shrink-0" /><span className="truncate">{data.address}</span></div>}
              {data.website && <div className="flex items-center gap-2"><Globe size={10} className="text-blue-400 shrink-0" /><span className="truncate">{data.website}</span></div>}
            </div>
          </section>

          {/* REDES SOCIAIS */}
          {data.socials?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3 border-b border-slate-700 pb-1 flex items-center gap-2">
                <Globe size={12} /> Social
              </h3>
              <div className="space-y-2 text-[9px] text-slate-300">
                {data.socials.map((social, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-blue-400 shrink-0"><SocialIcon platform={social.platform} size={10} /></span>
                    <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* COMPETÊNCIAS */}
          {data.skills?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3 border-b border-slate-700 pb-1 flex items-center gap-2">
                <Star size={12} /> Competências
              </h3>
              <div className="space-y-2.5">
                {data.skills.slice(0, 8).map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[8px] uppercase font-bold mb-0.5">
                      <span>{skill.name}</span>
                      <span className="text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* IDIOMAS */}
          {data.languages?.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2 border-b border-slate-700 pb-1 flex items-center gap-2">
                <Languages size={12} /> Idiomas
              </h3>
              <div className="space-y-1.5">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center text-[9px]">
                    <span className="font-bold text-slate-200">{lang.name}</span>
                    <span className="text-slate-400 italic text-[8px]">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* INTERESSES */}
          {data.interests?.length > 0 && (
            <section className="mt-auto">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2 border-b border-slate-700 pb-1 flex items-center gap-2">
                <Heart size={12} /> Interesses
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.interests.map((interest, i) => (
                  <span key={i} className="text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="w-[68%] p-8 flex flex-col overflow-hidden">
        <header className="mb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-slate-900 mb-1">{data.name}</h1>
          <div className="flex items-center gap-3">
            <div className="h-1 w-10 bg-blue-600" />
            <h2 className="text-base font-bold text-slate-500 uppercase tracking-[0.1em]">{data.job_title}</h2>
          </div>
        </header>

        <div className="flex flex-col gap-y-6 overflow-hidden">
          {/* PERFIL */}
          <section>
            <div className="flex items-center gap-2 mb-2 text-slate-900">
              <Quote size={14} className="text-blue-600" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Perfil Profissional</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-[10px] text-justify">{data.about}</p>
          </section>

          {/* EXPERIÊNCIA */}
          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-900">
              <Briefcase size={14} className="text-blue-600" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Experiência Profissional</h3>
            </div>
            <div className="space-y-4">
              {data.experiences.slice(0, 3).map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l border-slate-200">
                  <div className="absolute -left-[3.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-[11px] font-bold text-slate-900 uppercase leading-tight">{exp.role}</h4>
                    <span className="text-[8px] font-bold text-blue-600 whitespace-nowrap ml-2">{exp.period}</span>
                  </div>
                  <div className="text-slate-500 font-bold text-[9px] uppercase mb-1">{exp.company} {exp.location && `• ${exp.location}`}</div>
                  <p className="text-[9px] text-slate-600 leading-normal">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CURSOS E CERTIFICAÇÕES (GRID 2 COLUNAS) */}
          <div className="grid grid-cols-2 gap-6">
            <section>
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <BookOpen size={14} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Cursos</h3>
              </div>
              <div className="space-y-2.5">
                {data.professional_courses?.slice(0, 3).map((course) => (
                  <div key={course.id}>
                    <div className="text-[10px] font-bold text-slate-900 leading-tight">{course.course}</div>
                    <div className="text-[9px] text-slate-500">{course.institution}</div>
                    <div className="text-[8px] font-bold text-blue-600">{course.level}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <Award size={14} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Certificações</h3>
              </div>
              <div className="space-y-2">
                {data.certifications.slice(0, 4).map((cert) => (
                  <div key={cert.id}>
                    <div className="text-[9px] font-bold text-slate-800 leading-tight">{cert.name}</div>
                    <div className="text-[8px] text-slate-500">{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* EDUCAÇÃO & REFERÊNCIAS (GRID 2 COLUNAS) */}
          <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-5">
            <section>
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <GraduationCap size={14} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Educação</h3>
              </div>
              <div className="space-y-2.5">
                {data.educations.slice(0, 2).map((edu) => (
                  <div key={edu.id}>
                    <div className="text-[10px] font-bold text-slate-900 leading-tight">{edu.degree}</div>
                    <div className="text-[9px] text-slate-500">{edu.institution}</div>
                    <div className="text-[8px] font-bold text-blue-600">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <UserCheck size={14} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Referências</h3>
              </div>
              <div className="space-y-2">
                {data.references?.slice(0, 2).map((ref) => (
                  <div key={ref.id}>
                    <div className="text-[9px] font-bold text-slate-800 uppercase leading-tight">{ref.name}</div>
                    <div className="text-[8px] text-slate-500 leading-tight">{ref.position} @ {ref.company}</div>
                    <div className="text-[8px] text-blue-600 font-medium truncate">{ref.contact}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* PROJETOS (UI IGUAL EXPERIÊNCIA) */}
          {data.projects?.length > 0 && (
            <section className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 mb-3 text-slate-900">
                <Code size={14} className="text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Projetos</h3>
              </div>
              <div className="space-y-4">
                {data.projects.slice(0, 2).map((proj) => (
                  <div key={proj.id} className="relative pl-4 border-l border-slate-200">
                    <div className="absolute -left-[3.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-[11px] font-bold text-slate-900 uppercase leading-tight">{proj.title}</h4>
                      {/* Caso o projeto tenha link ou data, pode ser adicionado aqui como no período da experiência */}
                    </div>
                    <p className="text-[9px] text-slate-600 leading-normal text-justify">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
