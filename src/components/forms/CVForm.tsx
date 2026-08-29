"use client";

import React, { useState, useRef, useEffect } from "react";
import { CVData, Experience, Education, Skill, Language, ProfessionalCourse, Certification, Project, Social, Reference } from "@/types";
import { Plus, Trash2, Layout, Image as ImageIcon, X, Upload, Globe, Linkedin, Github, Twitter, Instagram, Facebook, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CVFormProps {
  initialData: CVData;
  onSubmit: (data: CVData & { image_file?: File }) => void;
}

export default function CVForm({ initialData, onSubmit }: CVFormProps) {
  const [data, setData] = useState<CVData>(initialData);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const updateField = <K extends keyof CVData>(field: K, value: CVData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = <T extends object>(
    array: T[],
    index: number,
    key: keyof T,
    value: any
  ): T[] => {
    const updated = [...array];
    updated[index] = { ...updated[index], [key]: value };
    return updated;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("image", reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: "",
      role: "",
      period: "",
      description: "",
    };
    updateField("experiences", [...data.experiences, newExperience]);
  };

  const removeExperience = (id: string) => {
    updateField("experiences", data.experiences.filter((exp) => exp.id !== id));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      year: "",
    };
    updateField("educations", [...data.educations, newEducation]);
  };

  const removeEducation = (id: string) => {
    updateField("educations", data.educations.filter((edu) => edu.id !== id));
  };

  const addLanguage = () => {
    const newLanguage: Language = { name: "", level: "Intermediário" };
    updateField("languages", [...data.languages, newLanguage]);
  };

  const removeLanguage = (index: number) => {
    updateField("languages", data.languages.filter((_, i) => i !== index));
  };

  const addProfessionalCourse = () => {
    const newCourse: ProfessionalCourse = {id: crypto.randomUUID(), course: "", level: "", institution: "", location: "",};
    updateField("professional_courses", [...data.professional_courses, newCourse,]);
  };

  const removeProfessionalCourse = (id: string) => {
    updateField("professional_courses", data.professional_courses.filter((c) => c.id !== id));
  };

  const addCertification = () => {
    const newCert: Certification = { id: crypto.randomUUID(), name: "", issuer: "", date: "" };
    updateField("certifications", [...data.certifications, newCert]);
  };

  const removeCertification = (id: string) => {
    updateField("certifications", data.certifications.filter((c) => c.id !== id));
  };

  const addProject = () => {
    const newProj: Project = { id: crypto.randomUUID(), title: "", description: "", link: "" };
    updateField("projects", [...data.projects, newProj]);
  };

  const removeProject = (id: string) => {
    updateField("projects", data.projects.filter((p) => p.id !== id));
  };

  const addSocial = () => {
    const newSocial: Social = { platform: "linkedin", url: "" };
    updateField("socials", [...data.socials, newSocial]);
  };

  const removeSocial = (index: number) => {
    updateField("socials", data.socials.filter((_, i) => i !== index));
  };

  const addReference = () => {
    const newRef: Reference = { id: crypto.randomUUID(), name: "", position: "", company: "", contact: "" };
    updateField("references", [...data.references, newRef]);
  };

  const removeReference = (id: string) => {
    updateField("references", data.references.filter((r) => r.id !== id));
  };

  const handleInterestsChange = (value: string) => {
    updateField("interests", value.split(",").map(i => i.trim()).filter(Boolean));
  };

  const handleSkillChange = (value: string) => {
    const newSkills: Skill[] = value
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name, level: 80 }));
    updateField("skills", newSkills);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...data, image_file: imageFile });
      }}
      className="space-y-16 pb-32"
    >
      <Section title="Identidade Visual" number="01">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-40 h-40 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
              {data.image ? (
                <>
                  <img src={data.image} alt="Profile" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      updateField("image", undefined);
                      setImageFile(undefined);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon size={32} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Foto Profissional</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 w-full py-2 px-4 bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-bold uppercase tracking-widest rounded-lg border border-border transition-all flex items-center justify-center gap-2"
            >
              <Upload size={14} /> {data.image ? "Alterar Foto" : "Upload Foto"}
            </button>
          </div>

          <div className="flex-1 w-full">
            <Grid>
              <Input label="Nome Completo" value={data.name} onChange={(v) => updateField("name", v)} />
              <Input label="Título Profissional" value={data.job_title} onChange={(v) => updateField("job_title", v)} />
              <Input label="E-mail Corporativo" value={data.email} onChange={(v) => updateField("email", v)} />
              <Input label="Telefone / WhatsApp" value={data.phone} onChange={(v) => updateField("phone", v)} />
              <Input label="Website / LinkedIn" value={data.website || ""} onChange={(v) => updateField("website", v)} />
              <Input label="Localização (Cidade, UF)" full value={data.address} onChange={(v) => updateField("address", v)} />
            </Grid>
          </div>
        </div>
      </Section>

      <Section title="Perfil Executivo" number="02">
        <Textarea 
          label="Resumo Profissional" 
          full 
          placeholder="Destaque suas principais conquistas e objetivos..."
          value={data.about} 
          onChange={(v) => updateField("about", v)} 
        />
      </Section>

      <Section title="Trajetória Profissional" number="03" action={<AddButton onClick={addExperience} />}>
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {data.experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card onDelete={() => removeExperience(exp.id)}>
                  <Grid>
                    <Input label="Empresa" value={exp.company} onChange={(v) =>
                      updateField("experiences", updateArrayItem(data.experiences, index, "company", v))
                    } />
                    <Input label="Cargo" value={exp.role} onChange={(v) =>
                      updateField("experiences", updateArrayItem(data.experiences, index, "role", v))
                    } />
                    <Input label="Período (Ex: 2020 - Presente)" value={exp.period} onChange={(v) =>
                      updateField("experiences", updateArrayItem(data.experiences, index, "period", v))
                    } />
                    <Input label="Localização" value={exp.location || ""} onChange={(v) =>
                      updateField("experiences", updateArrayItem(data.experiences, index, "location", v))
                    } />
                    <Textarea label="Principais Responsabilidades e Resultados" full value={exp.description} onChange={(v) =>
                      updateField("experiences", updateArrayItem(data.experiences, index, "description", v))
                    } />
                  </Grid>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {data.experiences.length === 0 && (
            <EmptyState message="Nenhuma experiência adicionada ainda." />
          )}
        </div>
      </Section>

      <Section title="Formação Acadêmica" number="04" action={<AddButton onClick={addEducation} />}>
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {data.educations.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card onDelete={() => removeEducation(edu.id)}>
                  <Grid>
                    <Input label="Instituição" value={edu.institution} onChange={(v) =>
                      updateField("educations", updateArrayItem(data.educations, index, "institution", v))
                    } />
                    <Input label="Curso / Grau" value={edu.degree} onChange={(v) =>
                      updateField("educations", updateArrayItem(data.educations, index, "degree", v))
                    } />
                    <Input label="Ano de Conclusão" value={edu.year} onChange={(v) =>
                      updateField("educations", updateArrayItem(data.educations, index, "year", v))
                    } />
                    <Input label="Localização" value={edu.location || ""} onChange={(v) =>
                      updateField("educations", updateArrayItem(data.educations, index, "location", v))
                    } />
                  </Grid>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {data.educations.length === 0 && (
            <EmptyState message="Nenhuma formação acadêmica adicionada." />
          )}
        </div>
      </Section>

      <Section title="Idiomas" number="05" action={<AddButton onClick={addLanguage} />}>
        <div className="space-y-4">
          {data.languages.map((lang, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Input label="Idioma" value={lang.name} onChange={(v) => 
                  updateField("languages", updateArrayItem(data.languages, index, "name", v))
                } />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2 block">Nível</label>
                <select 
                  className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all shadow-sm"
                  value={lang.level}
                  onChange={(e) => updateField("languages", updateArrayItem(data.languages, index, "level", e.target.value))}
                >
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Fluente">Fluente</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </div>
              <button type="button" onClick={() => removeLanguage(index)} className="p-4 text-muted-foreground hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cursos Profissionais" number="06" action={<AddButton onClick={addProfessionalCourse} />} >
       <div className="space-y-6">
         {data.professional_courses.map((course, index) => (
       <Card
        key={course.id}
        onDelete={() => removeProfessionalCourse(course.id)}>
       <Grid>
         <Input
            label="Curso"
            value={course.course}
            onChange={(v) =>
              updateField(
                "professional_courses",
                updateArrayItem(data.professional_courses, index, "course", v)
              )
            }
          />

         <Input
            label="Nível"
            value={course.level}
            onChange={(v) =>
              updateField(
                "professional_courses",
                updateArrayItem(data.professional_courses, index, "level", v)
              )
            }
          />

          <Input
            label="Centro de Formação"
            value={course.institution}
            onChange={(v) =>
              updateField(
                "professional_courses",
                updateArrayItem(
                  data.professional_courses,
                  index,
                  "institution",
                  v
                )
              )
            }
          />

          <Input
            label="Localização"
            value={course.location}
            onChange={(v) =>
              updateField(
                "professional_courses",
                updateArrayItem(
                  data.professional_courses,
                  index,
                  "location",
                  v
                ))} 
            />
            </Grid>
          </Card>
          ))}
        </div>
      </Section>
      
      <Section title="Certificações & Prêmios" number="07" action={<AddButton onClick={addCertification} />}>
        <div className="space-y-6">
          {data.certifications.map((cert, index) => (
            <Card key={cert.id} onDelete={() => removeCertification(cert.id)}>
              <Grid>
                <Input label="Nome da Certificação" value={cert.name} onChange={(v) => 
                  updateField("certifications", updateArrayItem(data.certifications, index, "name", v))
                } />
                <Input label="Instituição Emissora" value={cert.issuer} onChange={(v) => 
                  updateField("certifications", updateArrayItem(data.certifications, index, "issuer", v))
                } />
                <Input label="Data / Ano" value={cert.date} onChange={(v) => 
                  updateField("certifications", updateArrayItem(data.certifications, index, "date", v))
                } />
              </Grid>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Projetos Relevantes" number="08" action={<AddButton onClick={addProject} />}>
        <div className="space-y-6">
          {data.projects.map((proj, index) => (
            <Card key={proj.id} onDelete={() => removeProject(proj.id)}>
              <Grid>
                <Input label="Título do Projeto" value={proj.title} onChange={(v) => 
                  updateField("projects", updateArrayItem(data.projects, index, "title", v))
                } />
                <Input label="Link (Opcional)" value={proj.link || ""} onChange={(v) => 
                  updateField("projects", updateArrayItem(data.projects, index, "link", v))
                } />
                <Textarea label="Descrição do Projeto" full value={proj.description} onChange={(v) => 
                  updateField("projects", updateArrayItem(data.projects, index, "description", v))
                } />
              </Grid>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Redes Sociais" number="09" action={<AddButton onClick={addSocial} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.socials.map((social, index) => (
            <div key={index} className="flex gap-4 items-end bg-muted/30 p-4 rounded-xl border border-border">
              <div className="flex-1">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2 block">Plataforma</label>
                <select 
                  className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all shadow-sm"
                  value={social.platform}
                  onChange={(e) => updateField("socials", updateArrayItem(data.socials, index, "platform", e.target.value))}
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="portfolio">Portfólio / Website</option>
                </select>
              </div>
              <div className="flex-[2]">
                <Input label="URL do Perfil" value={social.url} onChange={(v) => 
                  updateField("socials", updateArrayItem(data.socials, index, "url", v))
                } />
              </div>
              <button type="button" onClick={() => removeSocial(index)} className="p-4 text-muted-foreground hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Referências" number="10" action={<AddButton onClick={addReference} />}>
        <div className="space-y-6">
          {data.references.map((ref, index) => (
            <Card key={ref.id} onDelete={() => removeReference(ref.id)}>
              <Grid>
                <Input label="Nome do Referente" value={ref.name} onChange={(v) => 
                  updateField("references", updateArrayItem(data.references, index, "name", v))
                } />
                <Input label="Cargo" value={ref.position} onChange={(v) => 
                  updateField("references", updateArrayItem(data.references, index, "position", v))
                } />
                <Input label="Empresa" value={ref.company} onChange={(v) => 
                  updateField("references", updateArrayItem(data.references, index, "company", v))
                } />
                <Input label="Contato (E-mail ou Telefone)" value={ref.contact} onChange={(v) => 
                  updateField("references", updateArrayItem(data.references, index, "contact", v))
                } />
              </Grid>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Competências Técnicas" number="11">
        <div className="space-y-2">
          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Habilidades (Separadas por vírgula)</label>
          <input
            className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-sm"
            placeholder="Ex: Gestão de Projetos, React, Análise de Dados, Inglês Fluente..."
            value={data.skills.map((s) => s.name).join(", ")}
            onChange={(e) => handleSkillChange(e.target.value)}
          />
        </div>
      </Section>

      <Section title="Interesses & Hobbies" number="12">
        <div className="space-y-2">
          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Interesses (Separados por vírgula)</label>
          <input
            className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-sm"
            placeholder="Ex: Fotografia, Viagens, Voluntariado..."
            value={data.interests.join(", ")}
            onChange={(e) => handleInterestsChange(e.target.value)}
          />
        </div>
      </Section>

      <Section title="Design & Layout" number="13">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {([
            "modern", "minimal", "creative", "corporate", 
            "executive", "tech", "academic", "elegant", 
            "bold", "compact", "timeline", "grid", 
            "sidebar-right", "classic", "modern-v2", "startup", 
            "vibrant", "dark", "glass", "swiss"
          ] as const).map((layout) => (
            <button
              key={layout}
              type="button"
              onClick={() => updateField("layout", layout)}
              className={`p-6 border-2 rounded-2xl relative transition-all flex flex-col items-center gap-3 group ${
                data.layout === layout 
                  ? "border-primary bg-primary/5 text-foreground shadow-sm" 
                  : "border-border bg-muted/50 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                data.layout === layout ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <Layout size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{layout}</span>
              {data.layout === layout && (
                <motion.div layoutId="active-layout" className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </Section>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          className="bg-primary text-primary-foreground px-12 py-5 rounded-full flex items-center gap-3 hover:bg-primary/90 shadow-xl transition-all font-bold text-sm uppercase tracking-[0.2em]"
        >
          <Layout size={20} /> Finalizar Currículo
        </motion.button>
      </div>
    </form>
  );
}

function Section({ title, number, children, action }: { title: string; number: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="relative">
      <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black text-muted-foreground/30 font-mono tracking-tighter">{number}</span>
          <h3 className="text-xl font-black uppercase tracking-tight text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function Input({ label, value, onChange, full, placeholder }: { label: string; value: string; onChange: (v: string) => void; full?: boolean; placeholder?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{label}</label>
      <input
        className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-sm"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, full, placeholder }: { label: string; value: string; onChange: (v: string) => void; full?: boolean; placeholder?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{label}</label>
      <textarea
        className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground h-32 focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-sm resize-none"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Card({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="p-8 bg-muted/30 border border-border rounded-2xl relative group hover:border-muted-foreground/30 transition-all shadow-sm">
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={18} />
      </button>
      {children}
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-primary/20"
    >
      <Plus size={14} /> Adicionar
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-2">
      <p className="text-sm font-medium italic">{message}</p>
    </div>
  );
}
