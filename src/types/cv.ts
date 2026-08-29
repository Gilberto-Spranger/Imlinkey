export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  location?: string;
}

export interface Skill {
  name: string;
  level: number; // 0 - 100
}

export interface Language {
  name: string;
  level: 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente' | 'Nativo';
}

export interface ProfessionalCourse {
  id: string;
  course: string;
  level: string;
  institution: string;
  location: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface Social {
  platform: string; // linkedin, github, etc
  url: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  contact: string;
}

export interface CVData {
  id: string;
  name: string;
  job_title: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  image?: string;
  website?: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  professional_courses: ProfessionalCourse[];
  certifications: Certification[];
  projects: Project[];
  references: Reference[];
  interests: string[];
  socials: Social[];
  html?: string;
  layout: 
    | 'modern' | 'minimal' | 'corporate' | 'creative' 
    | 'executive' | 'tech' | 'academic' | 'elegant' 
    | 'bold' | 'compact' | 'timeline' | 'grid' 
    | 'sidebar-right' | 'classic' | 'modern-v2' | 'startup' 
    | 'vibrant' | 'dark' | 'glass' | 'swiss';
}
