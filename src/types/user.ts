export interface User {
  id: string;
  user_id: string;

  avatar_url?: string | null;

  username: string;
  email: string;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  birth_date?: string | null;
  gender?: "Male" | "Female" | null;
  nationality?: string | null;
  national_id?: string | null;

  bio?: string | null;

  languages?: string[];
  skills?: string[];
  interests?: string[];

  website?: string | null;

  created_at: string;
  updated_at: string;
}