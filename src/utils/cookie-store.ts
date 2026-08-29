import { CVData } from "@/types";

const STORAGE_KEY = "cv_data_premium";

export const saveCVToStorage = (data: CVData) => {
  if (typeof window === "undefined") return;

  try {
    const safeData: CVData = {
      ...data,
      job_title: data.job_title || "",
      image: typeof data.image === "string" ? data.image : undefined,

      experiences: Array.isArray(data.experiences) ? data.experiences : [],
      educations: Array.isArray(data.educations) ? data.educations : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      languages: Array.isArray(data.languages) ? data.languages : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      professional_courses: Array.isArray(data.professional_courses)
        ? data.professional_courses
        : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      references: Array.isArray(data.references) ? data.references : [],
      interests: Array.isArray(data.interests) ? data.interests : [],
      socials: Array.isArray(data.socials) ? data.socials : [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
  } catch (e) {
    console.error("Error saving CV:", e);

    try {
      const fallback = {
        ...data,
        image: undefined,
        professional_courses: [],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    } catch (err) {
      console.error("Fallback save failed:", err);
    }
  }
};

export const loadCVFromStorage = (): CVData | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    const cv: CVData = {
      id: parsed.id || "",
      name: parsed.name || "",
      job_title: parsed.job_title || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      address: parsed.address || "",
      about: parsed.about || "",
      image: typeof parsed.image === "string" ? parsed.image : undefined,
      website: parsed.website || "",
      layout: parsed.layout || "modern",

      experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
      educations: Array.isArray(parsed.educations) ? parsed.educations : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
      professional_courses: Array.isArray(parsed.professional_courses) ? parsed.professional_courses : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      references: Array.isArray(parsed.references) ? parsed.references : [],
      interests: Array.isArray(parsed.interests) ? parsed.interests : [],
      socials: Array.isArray(parsed.socials) ? parsed.socials : [],
      html: parsed.html,
    };

    return cv;
  } catch (e) {
    console.error("Error loading CV:", e);
    return null;
  }
};

export const saveCVToCookie = saveCVToStorage;
export const loadCVFromCookie = loadCVFromStorage;
