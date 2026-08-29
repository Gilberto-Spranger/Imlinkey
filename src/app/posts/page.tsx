'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Rightbar } from '@/components/layout/Rightbar';
import { CreatePost } from '@/components/feed/CreatePost';
import { PostCard } from '@/components/feed/PostCard';
import mockPosts from '@/components/mockPosts';
import { api } from '@/utils/api';


export default function Home() {
  const [posts, setPosts] = useState<typeof mockPosts>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/');
        if (response.data && response.data.length > 0) {
          // You might need to map response.data to match the `mockPosts` format
          setPosts(response.data);
        } else {
          setPosts(mockPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts(mockPosts); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex w-full min-h-screen max-w-[1400px] mx-auto">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-xl shrink-0 items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex gap-8 font-medium text-sm">
            <button className="text-white relative h-full flex items-center">
              For you
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-im-accent rounded-t-full" />
            </button>
            <button className="text-white/50 hover:text-white transition-colors h-full flex items-center">
              Following
            </button>
            <button className="text-white/50 hover:text-white transition-colors h-full flex items-center">
              Communities
            </button>
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right">
              <p className="text-xs font-bold text-white">Alex Rivers</p>
              <p className="text-[10px] text-im-accent uppercase tracking-wider">Creator Pro</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20"></div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 bento-panel border-b border-white/5 px-4 py-3 flex items-center justify-between rounded-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-im-accent to-im-accent-alt flex items-center justify-center">
              <span className="font-display font-bold text-sm text-black">i</span>
            </div>
          </div>
          <span className="font-display font-bold text-lg">Home</span>
          <div className="w-8 h-8 rounded-full bg-white/10" />
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-full lg:max-w-none mx-auto w-full lg:w-auto">
          {/* Feed Content */}
          <div className="flex-1 max-w-[700px] mx-auto w-full pb-24 lg:pb-6">
            <CreatePost />
            
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="w-8 h-8 border-2 border-im-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>
          
          <div className="hidden xl:block">
            <Rightbar />
          </div>
        </div>
      </main>
    </div>
  );
}
