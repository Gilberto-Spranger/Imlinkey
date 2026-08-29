import { Search, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import { AdBanner } from '@/components/AdBanner';

export function Rightbar() {
  const trendingTopics = [
    { tag: '#Imlinkey2026', posts: '124k' },
    { tag: '#FutureTech', posts: '89k' },
    { tag: '#DesignSystem', posts: '45k' },
    { tag: '#AI', posts: '2M' },
  ];

  const suggestedUsers = [
    { name: 'Sarah Connor', handle: '@sarahc', role: 'UX Engineer' },
    { name: 'John Doe', handle: '@johnd', role: 'Creator' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[350px] h-screen sticky top-0 py-6 px-4 shrink-0 overflow-y-auto no-scrollbar">
      {/* Search Bar */}
      <div className="relative mb-6 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-white/40 group-focus-within:text-im-accent transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search trends, posts, people..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-im-accent/50 transition-all"
        />
      </div>
      
      {/* Ad Banner */}
      <AdBanner className="mb-4" />

      {/* Analytics Preview (from Bento design) */}
      <div className="bento-panel mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-im-accent mb-4">Real-time Engagement</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-60 italic">Views / Sec</span>
            <span className="text-sm font-mono">142</span>
          </div>
          <div className="h-12 flex items-end gap-1">
            <div className="flex-1 bg-im-accent/20 h-[30%] rounded-sm"></div>
            <div className="flex-1 bg-im-accent/30 h-[45%] rounded-sm"></div>
            <div className="flex-1 bg-im-accent/40 h-[70%] rounded-sm"></div>
            <div className="flex-1 bg-im-accent h-[100%] rounded-sm shadow-[0_0_10px_#00F0FF]"></div>
            <div className="flex-1 bg-im-accent/60 h-[85%] rounded-sm"></div>
            <div className="flex-1 bg-im-accent/40 h-[60%] rounded-sm"></div>
          </div>
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] opacity-50 uppercase tracking-wider">Avg Duration</p>
              <p className="text-lg font-bold">4:12</p>
            </div>
            <div>
              <p className="text-[10px] opacity-50 uppercase tracking-wider">Unique reach</p>
              <p className="text-lg font-bold text-amber-500">18.4k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Box */}
      <div className="bento-panel flex-1 flex flex-col mb-4 overflow-hidden min-h-[300px]">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Trending Threads</h3>
        <div className="space-y-6 overflow-hidden">
          {trendingTopics.map((topic, idx) => (
            <div key={topic.tag} className="flex gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex-shrink-0 group-hover:border-im-accent border border-transparent transition-all flex items-center justify-center">
                <span className="font-bold text-white/40 group-hover:text-im-accent transition-colors">{idx + 1}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold group-hover:text-im-accent transition-colors">{topic.tag.replace('#', '')}</span>
                <span className="text-xs opacity-50">{topic.posts} posts</span>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-auto w-full pt-4 text-xs font-bold uppercase tracking-tighter border-t border-white/5 hover:text-im-accent transition-colors text-center">
          View All Global Trends
        </button>
      </div>
      
      {/* Footer / Links */}
      <div className="pt-2 px-2 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-white/30 uppercase tracking-wider pb-6">
        <a href="#" className="hover:text-white/60">Terms</a>
        <a href="#" className="hover:text-white/60">Privacy</a>
        <a href="#" className="hover:text-white/60">Ads</a>
        <a href="#" className="hover:text-white/60">Cookies</a>
        <span>© 2026 Imlinkey</span>
      </div>
    </aside>
  );
}
