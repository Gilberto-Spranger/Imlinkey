"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingPage, Picture, Button } from "@/components/ui";
import { api } from "@/utils";
import {
  MessageCircle,
  Settings,
  Check,
  Link as LinkIcon,
  ShoppingBag,
  Calendar,
  Ticket,
  ChartNoAxesCombined,
  CalendarCog,
  FileText,
  Sparkles,
  Users,
  Search,
  Copy
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAccountSettings } from "@/hooks/use-account-settings";
import { usePresence } from "@/hooks/use-presence";

export const dynamic = "force-dynamic";

interface Profile {
  username: string;
  avatar_url?: string;
  bio?: string;
  full_name?: string;
  id?: string;
}

// --------------------
// Profile Hook
// --------------------
function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const res = await api.get<Profile>("/profile/", {
          withCredentials: true
        });

        setProfile(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) router.replace("/auth");
        else console.error("Erro ao buscar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  return { profile, loading };
}

// --------------------
// Typing Animation
// --------------------
function useTypingAnimation(text: string, speed = 150) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (index < text.length) {
          setDisplayed((prev) => prev + text[index]);
          setIndex((i) => i + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (index > 0) {
          setIndex((i) => i - 1);
          setDisplayed(text.slice(0, index - 1));
        } else {
          setDeleting(false);
        }
      }
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [displayed, index, deleting, text, speed]);

  return displayed;
}

// --------------------
// Dashboard
// --------------------
function DashboardContent() {
  const { profile, loading } = useProfile();
  const { settings, loading: loadingSettings } = useAccountSettings();

  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useTheme(settings?.theme_preference || "dark");

  const typingText = useTypingAnimation(
    "Imlinkey um olhar para o futuro",
    120
  );

  // ✅ FIX AQUI
  const userId = profile?.id ?? "";

  const { connected } = usePresence({
    userId
  });

  if (loading || loadingSettings) return <LoadingPage />;

  if (!profile) {
    return (
      <div className="text-red-500 text-center mt-20 font-medium">
        Perfil não encontrado.
      </div>
    );
  }

  const handleCopy = async () => {
    if (!profile.username) return;

    await navigator.clipboard.writeText(
      `https://imlinkey.store/${profile.username}`
    );

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const country = settings?.country?.toLowerCase();

  const dashboardItems = [
    {
      href: "/links",
      label: "Meus Links",
      icon: <LinkIcon className="w-6 h-6 text-blue-400" />,
      desc: "Gerencie seus links"
    },
    {
      href: "/products",
      label: "Produtos",
      icon: <ShoppingBag className="w-6 h-6 text-yellow-400" />,
      desc: "Partilha seus produtos externos"
    },
    {
      href: "/eventManagement",
      label: "Gestão",
      icon: <CalendarCog className="w-6 h-6 text-red-400" />,
      desc: "Crie e Gerencie seus eventos"
    },
    {
      href: "/events",
      label: "Eventos",
      icon: <Calendar className="w-6 h-6 text-pink-400" />,
      desc: "Achar eventos e comprar tickets"
    },
    {
      href: "/my-tickets",
      label: "Ingressos",
      icon: <Ticket className="w-6 h-6 text-purple-400" />,
      desc: "Todos seus ingressos comprados"
    },
    {
      href: "/analytics",
      label: "Estatísticas",
      icon: <ChartNoAxesCombined className="w-6 h-6 text-green-300" />,
      desc: "Acesse análises gerais"
    },
    {
      href: "/cv",
      label: "Currículo",
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      desc: "Crie seu Currículum Vitae"
    },
    {
      href: "/affiliate",
      label: "Afiliados",
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      desc: "Ganhe com indicações"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-6 pb-20 relative overflow-hidden">

      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 z-10">

        <Link href="/chat">
          <Button
            color="blue"
            variant="icon"
            className="bg-background border border-border"
  >
            <MessageCircle className="w-5 h-5" />
           </Button>
        </Link>

        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/search")}
          className="flex-1 max-w-md cursor-pointer"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" />

            <input
              readOnly
              placeholder={typingText || "Buscar usuários, eventos..."}
              className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm text-foreground/50 cursor-pointer"
            />
          </div>
        </motion.div>

        <Link href="/settings">
          <Button
            color="blue"
            variant="icon"
            className="bg-background border border-border"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mt-10 z-10"
      >
        <Picture
          value={profile.avatar_url || "/user.png"}
          size={120}
          status={connected ? "online" : "offline"}
        />

        <h1 className="text-3xl font-extrabold mt-6">
          {profile.full_name}
        </h1>

        <a className="flex items-center gap-2 mt-2 px-4 py-1 bg-background border border-border rounded-full" href={`https://imlinkey.store/${profile.username}`}>
            <span className="text-blue-400 text-xs font-black">@</span>
            <span>{profile.username}</span>
        </a>

        <p className="text-foreground/60 mt-4 text-center px-6">
          {profile.bio || "Personalize sua bio nas configurações"}
        </p>

        <button
          onClick={handleCopy}
          className="flex items-center gap-3 mt-8 bg-foreground/5 px-8 py-3 rounded-full"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}

          {copied ? "Link Copiado!" : "Copiar meu Link"}
        </button>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full max-w-4xl z-10">
        {dashboardItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ y: -5, scale: 1.03 }}
              className="flex items-center p-5 border border-border rounded-3xl"
            >
              <div className="p-4 bg-foreground/5 rounded-2xl">
                {item.icon}
              </div>

              <div className="ml-5">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-xs text-foreground/50">{item.desc}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Premium */}
      <motion.div className="mt-16 w-full max-w-xs z-10">
        <Link href={`https://imlinkey.store/payments/${country}/billing`}>
          <Button className="w-full py-6 rounded-2xl">
            <Sparkles className="w-5 h-5" />
            ASSINAR PREMIUM
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <DashboardContent />
    </Suspense>
  );
}
