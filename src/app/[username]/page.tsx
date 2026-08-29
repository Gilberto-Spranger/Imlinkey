"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button, LoadingPage } from "@/components/ui";
import { api, ApiErrorResponse, apiClient, formatClickCount } from "@/utils";
import { 
  ExternalLink, 
  ShoppingBag, 
  Ticket as TicketIcon, 
  MousePointer2,
  Globe,
  ArrowUpRight
} from "lucide-react";
import { Link as LinkType } from "@/types";

interface UserProfile {
  username: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  language?: string;
  website?: string;
  occupation?: string;
}

interface Product {
  id: string;
  title?: string;
  price?: number | string;
  images?: string[];
  description?: string;
  url?: string;
}

interface EventType {
  id: string;
  title?: string;
  banner_url?: string;
  description?: string;
  url?: string;
}

interface Ticket {
  id: string;
  title?: string;
  banner_url?: string;
  description?: string;
  url?: string;
}

function BackgroundMedia({ src }: { src: string | null }) {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
      {src ? (
        <>
          <Image
            src={src}
            alt="Background"
            fill
            priority
            quality={100}
            className="object-cover object-center transition-opacity duration-700 opacity-60"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[12px]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted" />
      )}
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/15 rounded-full blur-[140px]"></div>
      </div>
    </div>
  );
}

function UserProfileContent() {
  const params = useParams();
  const username = params?.username as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBg, setCurrentBg] = useState<string | null>(null);

  const fetchBgImage = useCallback(async () => {
    if (!username) return;
    try {
      const res = await api.get<{ bg_image?: string }>(`bg_image_public/?username=${username}`);
      if (res.data?.bg_image) {
        setCurrentBg(res.data.bg_image);
      }
    } catch (err) {
      console.error("Erro ao carregar background:", err);
    }
  }, [username]);

  const fetchProfileData = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{
        profile: UserProfile;
        links: LinkType[];
        products: Product[];
        events: EventType[];
        tickets: Ticket[];
      }>(`profiles/${username}`);

      if (res.data) {
        setUser(res.data.profile);
        setLinks(res.data.links || []);
        setProducts(res.data.products || []);
        setEvents(res.data.events || []);
        setTickets(res.data.tickets || []);
      }
    } catch (err) {
      const apiErr = (err as any)?.response?.data as ApiErrorResponse;
      setError(apiErr?.detail || "Perfil não encontrado");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!mounted) return;
      fetchBgImage();
      fetchProfileData();
    };
    init();
    return () => {
      mounted = false;
    };
  }, [fetchBgImage, fetchProfileData]);

  const handleLinkClick = async (linkId: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      setLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, click_count: l.click_count + 1 } : l))
      );
      await apiClient.incrementClick(linkId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingPage />;
  if (error || !user) return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">{error || "Perfil não encontrado"}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full text-foreground font-sans antialiased selection:bg-primary/30">
      <BackgroundMedia src={currentBg} />

      <main className="mx-auto flex w-full max-w-2xl flex-col px-6 py-16 sm:px-12">
        
        {/* PROFILE HEADER */}
        <header className="mb-14 flex w-full flex-col items-center text-center relative z-10">
          <div className="relative mb-6 p-1.5 rounded-full bg-gradient-to-b from-muted to-transparent group cursor-default">
            <div className="h-36 w-36 md:h-40 md:w-40 rounded-full border border-border overflow-hidden bg-card shadow-xl relative backdrop-blur-xl group-hover:border-primary/50 transition-colors duration-500">
              <Image
                src={user.avatar_url || "/default-avatar.png"}
                alt={user.username}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.05)] group-hover:shadow-[inset_0_0_30px_rgba(var(--primary),0.2)] transition-shadow duration-500 pointer-events-none"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-foreground">
            {user.username}
          </h1>

          {user.occupation && (
            <div className="mb-5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary backdrop-blur-md shadow-sm">
              {user.occupation}
            </div>
          )}

          <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-[320px] font-medium">
            {user.bio || "Conecte-se comigo através dos links abaixo."}
          </p>

          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 px-5 py-2 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            >
              <Globe size={14} className="animate-pulse" />
              <span className="text-xs font-bold tracking-wide">{user.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </header>

        {/* SECTION: LINKS */}
        <div className="w-full space-y-4 mb-16">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.link_url)}
              className="group relative flex w-full items-center justify-between p-4 rounded-2xl bg-card border border-border hover:bg-muted hover:border-primary/50 hover:shadow-md transition-all duration-500 cursor-pointer text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border overflow-hidden relative shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                  {link.icon ? (
                    <Image src={link.icon} alt="" fill className="object-cover p-2.5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <ExternalLink size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
                    {link.title}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5 group-hover:text-primary/80 transition-colors">
                    {link.platform}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                 <div className="flex items-center gap-1.5 bg-background px-3 py-1 rounded-full border border-border group-hover:border-primary/30 transition-colors">
                    <MousePointer2 size={10} className="text-primary/50 group-hover:text-primary transition-colors" />
                    <span className="font-mono text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{formatClickCount(link.click_count || 0)}</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground text-muted-foreground transition-all duration-500 transform group-hover:rotate-45">
                   <ArrowUpRight size={16} />
                 </div>
              </div>
            </button>
          ))}

          {links.length === 0 && (
             <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-8 text-center text-xs font-medium text-muted-foreground">
               Nenhum link disponível.
             </div>
          )}
        </div>

        {/* SECTION: STORE */}
        {products.length > 0 && (
          <section className="w-full mb-16 flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-4">
              Digital Store <div className="flex-1 h-px bg-border"></div>
            </h3>
            <div className="no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-card border border-border rounded-3xl p-4 flex flex-col w-[280px] shrink-0 snap-center hover:bg-muted hover:border-primary/30 transition-all duration-500 shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none"></div>
                  
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-muted shrink-0 border border-border/50">
                    <Image
                      src={product.images?.[0] || "/placeholder-prod.png"}
                      alt={product.title || "Product"}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                    />
                  </div>
                  <div className="flex flex-col flex-1 relative z-10">
                    <h4 className="font-bold text-base mb-1 line-clamp-1 text-foreground group-hover:text-primary transition-colors">{product.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-8">{product.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Price</span>
                        <span className="text-primary font-mono font-bold text-sm">
                          {product.price ? `${product.price}` : "Consultar"}
                        </span>
                      </div>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" className="px-5 py-2.5 bg-muted text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 h-auto border-border shadow-none">
                          Unlock
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: EVENTS & TICKETS */}
        {(events.length > 0 || tickets.length > 0) && (
          <section className="w-full">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-4">
              Agenda <div className="flex-1 h-px bg-border"></div>
            </h3>
            <div className="grid gap-3">
              {[...events, ...tickets].map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-3xl border border-border bg-card flex items-center justify-between hover:bg-muted hover:border-primary/30 transition-all duration-500 group relative overflow-hidden shadow-sm"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex flex-col items-center justify-center border border-border shrink-0 relative overflow-hidden group-hover:border-primary/30 transition-colors">
                       <Image src={item.banner_url || "/placeholder-event.png"} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h5>
                      <p className="text-[11px] text-muted-foreground font-medium mt-1">{item.description || "Clique para mais informações"}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground text-muted-foreground transition-all duration-500 relative z-10 shrink-0">
                    <ArrowUpRight size={18} className="transform group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-auto pt-16 text-center">
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground/50 italic">
            Powered by Imlinkey
          </span>
        </footer>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <UserProfileContent />
    </Suspense>
  );
}
