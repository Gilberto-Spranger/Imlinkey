'use client';
import Link from 'next/link';
import { Home, Newspaper, Bell, ShoppingBag, PlusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useNotifications } from '@/contexts/NotificationContext';

export function BottomNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bento-panel border-t border-white/5 flex justify-around items-center p-3 pb-safe z-50 rounded-none bg-[#000000] backdrop-blur-xl">
      <Link href="/" className={`p-2 transition-colors ${pathname === '/' ? 'text-im-accent' : 'text-white/50 hover:text-white'}`}>
        <Home className="w-6 h-6" />
      </Link>
      <Link href="/posts" className={`p-2 transition-colors ${pathname === '/explore' ? 'text-im-accent' : 'text-white/50 hover:text-white'}`}>
        <Newspaper className="w-6 h-6" />
      </Link>
      <Link href="/posts/create_posts" className={`p-2 transition-colors ${pathname === '/explore' ? 'text-im-accent' : 'text-white/50 hover:text-white'}`}>
        <PlusCircle className="w-6 h-6" />
      </Link>
      <Link href="/posts/notification" className={`relative p-2 transition-colors ${pathname === '/notifications' ? 'text-im-accent' : 'text-white/50 hover:text-white'}`}>
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-im-accent rounded-full border-2 border-[#0A0A0C]"></span>
        )}
      </Link>
      <Link href="/store" className={`p-2 transition-colors ${pathname === '/messages' ? 'text-im-accent' : 'text-white/50 hover:text-white'}`}>
        <ShoppingBag className="w-6 h-6" />
      </Link>
    </nav>
  );
}
