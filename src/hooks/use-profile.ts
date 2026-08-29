// hooks/use-profile.ts
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils";
import type { User } from "@/types";
import { AxiosError } from "axios";

// Helper para pegar o cookie (mesmo da sua dashboard)
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = getCookie("access_token");
      
      // Se não há token, redireciona logo
      if (!token) {
        router.replace("/auth");
        return;
      }

      const { data } = await api.get<User>("profile/", {
        headers: {
          Authorization: `Bearer ${token}`, // Garante o envio do token
        },
        withCredentials: true,
      });

      setProfile(data);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 401) {
        router.replace("/auth");
      } else {
        console.error("Erro ao carregar perfil:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, setProfile, loading, fetchProfile };
}