import React from 'react';
import { 
  Globe, 
  Linkedin, 
  Github, 
  Twitter, 
  Instagram, 
  Facebook, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  BookOpen, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Languages, 
  Heart 
} from 'lucide-react';
import { CVData } from '@/types';

interface SwissLayoutProps {
  data: CVData;
}

export default function SwissLayout({ data }: SwissLayoutProps) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black font-sans p-12 md:p-16 flex flex-col gap-10 print:p-8">
      
      {/* CAVEÇALHO ESTILO SUÍÇO */}
      <header className="border-b-8 border-black pb-6">
        <div className="flex justify-between items-start gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none break-words">
              {data.name || 'Seu Nome'}
            </h1>
            <h2 className="text-2xl font-bold uppercase tracking-wide text-neutral-800">
              {data.job_title}
            </h2>
          </div>
          
          {data.image && (
            <img 
              src={data.image} 
              alt={data.name} 
              className="w-28 h-28 object-cover border-4 border-black shrink-0 grayscale"
            />
          )}
        </div>
      </header>

      {/* GRID PRINCIPAL (1:2) */}
      <div className="grid grid-cols-3 gap-10">
        
        {/* BARRA LATERAL (COLUNA ESQUERDA) */}
        <aside className="space-y-8">
          
          {/* CONTATO */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">
              Contato
            </h3>
            <div className="text-xs space-y-2 font-medium">
              {data.email && (
                <div className="flex items-center gap-2 break-all">
                  <Mail size={12} className="shrink-0" />
                  <span>{data.email}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} className="shrink-0" />
                  <span>{data.phone}</span>
                </div>
              )}
              {data.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="shrink-0" />
                  <span>{data.address}</span>
                </div>
              )}
              {data.website && (
                <div className="flex items-center gap-2 break-all">
                  <Globe size={12} className="shrink-0" />
                  <span>{data.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </div>
              )}
            </div>
          </section>

          {/* REDES SOCIAIS */}
          {data.socials && data.socials.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">
                Redes Sociais
              </h3>
              <div className="text-xs space-y-2 font-medium">
                {data.socials.map((social, i) => (
                  <div key={i} className="flex items-center gap-2 truncate">
                    {social.platform === 'linkedin' && <Linkedin size={12} className="shrink-0" />}
                    {social.platform === 'github' && <Github size={12} className="shrink-0" />}
                    {social.platform === 'twitter' && <Twitter size={12} className="shrink-0" />}
                    {social.platform === 'instagram' && <Instagram size={12} className="shrink-0" />}
                    {social.platform === 'facebook' && <Facebook size={12} className="shrink-0" />}
                    {social.platform === 'portfolio' && <Globe size={12} className="shrink-0" />}
                    <span className="truncate">{social.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* COMPETÊNCIAS / SKILLS */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">
                Competências
              </h3>
              <ul className="text-xs space-y-1.5 font-medium">
                {data.skills.map((s, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-neutral-200 pb-1">
                    <span>{s.name}</span>
                    {s.level && <span className="text-[10px] text-neutral-500 uppercase">{s.level}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* IDIOMAS */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">
                Idiomas
              </h3>
              <div className="text-xs space-y-1.5 font-medium">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-neutral-200 pb-1">
                    <span>{lang.name}</span>
                    <span className="text-[10px] uppercase text-neutral-600">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICAÇÕES */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">
                Certificações
              </h3>
              <div className="text-xs space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <p className="font-bold leading-snug">{cert.name}</p>
                    <p className="text-[10px] text-neutral-600">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* INTERESSES */}
          {data.interests && data.interests.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">
                Interesses
              </h3>
              <div className="flex flex-wrap gap-1 text-xs font-medium">
                {data.interests.map((interest, idx) => (
                  <span key={idx} className="bg-black text-white px-1.5 py-0.5 text-[10px] uppercase font-bold">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

        </aside>

        {/* CONTEÚDO PRINCIPAL (COLUNA DIREITA) */}
        <main className="col-span-2 space-y-8">
          
          {/* RESUMO PROFISSIONAL */}
          {data.about && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-3">
                Perfil Profissional
              </h3>
              <p className="text-xs leading-relaxed font-medium text-neutral-900 whitespace-pre-line">
                {data.about}
              </p>
            </section>
          )}

          {/* EXPERIÊNCIA PROFISSIONAL */}
          {data.experiences && data.experiences.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-4">
                Experiência Profissional
              </h3>
              <div className="space-y-6">
                {data.experiences.map((exp, idx) => (
                  <div key={exp.id || idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm uppercase">{exp.role}</h4>
                      <span className="text-[11px] font-bold tracking-tight">{exp.period}</span>
                    </div>
                    <p className="text-xs font-bold italic text-neutral-700">
                      {exp.company} {exp.location && `| ${exp.location}`}
                    </p>
                    {exp.description && (
                      <p className="text-xs leading-relaxed text-neutral-800 pt-1 whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCAÇÃO */}
          {data.educations && data.educations.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-4">
                Educação
              </h3>
              <div className="space-y-4">
                {data.educations.map((edu, idx) => (
                  <div key={edu.id || idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-xs uppercase">{edu.degree}</h4>
                      {edu.year && <span className="text-[11px] font-bold">{edu.year}</span>}
                    </div>
                    <p className="text-xs italic text-neutral-700">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CURSOS PROFISSIONAIS */}
          {data.professional_courses && data.professional_courses.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-4">
                Cursos Profissionais
              </h3>
              <div className="space-y-3">
                {data.professional_courses.map((course, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold">
                      <span>{course.course}</span>
                      {course.level && <span className="text-[10px] uppercase">{course.level}</span>}
                    </div>
                    <p className="text-[11px] text-neutral-600">
                      {course.institution} {course.location && `(${course.location})`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJETOS */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-4">
                Projetos
              </h3>
              <div className="space-y-3">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="text-xs space-y-1">
                    <h4 className="font-bold">{proj.title}</h4>
                    {proj.description && <p className="text-neutral-700">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* REFERÊNCIAS */}
          {data.references && data.references.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-4">
                Referências
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {data.references.map((ref, idx) => (
                  <div key={ref.id || idx} className="text-xs space-y-0.5">
                    <h4 className="font-bold">{ref.name}</h4>
                    <p className="italic text-neutral-600">{ref.position} @ {ref.company}</p>
                    {ref.contact && <p className="font-bold text-[11px] pt-1">{ref.contact}</p>}
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
