'use client';
import { Compass, Home, Mail, User, Bookmark, PlusCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Feed', href: '/' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: Mail, label: 'Messages', href: '/messages', count: 1 },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  const communityItems = [
    { label: 'Technology', href: '/c/tech' },
    { label: 'Design', href: '/c/design' },
    { label: 'Future', href: '/c/future' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 py-6 px-4 border-r border-white/5 shrink-0 relative z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 mb-8 group">
        <div className="w-8 h-8 rounded-lg bg-im-surface flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-transform group-hover:scale-105 overflow-hidden">
          <Image src="/favicon.png" alt="Logo" width={32} height={32} className="object-cover" />
        </div>
        <span className="font-display font-black text-xl tracking-tighter uppercase group-hover:text-im-accent transition-colors">Imlinkey</span>
      </Link>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href!}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              pathname === item.href || (pathname?.startsWith('/post') && item.href === '/') || (pathname?.startsWith('/admin') && item.href === '/')
                ? 'bg-white/5 border border-white/10 text-im-accent'
                : 'hover:bg-white/5 opacity-60 hover:opacity-100 text-white'
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium text-[16px]">{item.label}</span>
            </div>
            {item.count && (
              <span className="relative z-10 bg-im-accent/20 text-im-accent text-[10px] font-bold px-2 py-0.5 rounded">
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Post Button */}
      <button className="w-full py-4 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        <PlusCircle className="w-5 h-5" />
        Create Post
      </button>

      {/* Communities */}
      <div className="mt-10 px-4">
        <h3 className="text-[10px] font-bold text-im-accent uppercase tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp className="w-3 h-3" />
          Your Communities
        </h3>
        <div className="flex flex-col gap-2">
          {communityItems.map((c) => (
            <Link key={c.label} href={c.href} className="text-sm opacity-60 hover:opacity-100 transition-colors flex items-center gap-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              {c.label}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Admin Quick Look */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-im-accent/10 to-im-accent-alt/10 border border-im-accent/20">
        <p className="text-[10px] uppercase tracking-widest text-im-accent font-bold mb-2">Admin Dashboard</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold">+24.8%</p>
            <p className="text-[10px] opacity-50">Weekly CTR</p>
          </div>
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-im-accent/30 rounded-full"></div>
            <div className="w-1 h-5 bg-im-accent/50 rounded-full"></div>
            <div className="w-1 h-4 bg-im-accent/80 rounded-full"></div>
            <div className="w-1 h-7 bg-im-accent rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
