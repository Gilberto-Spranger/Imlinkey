import { CreatePost } from '@/components/feed/CreatePost';
import { Sidebar } from '@/components/layout/Sidebar';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Settings, 
  Plus, 
  Image as ImageIcon,
  Link2,
  Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="flex w-full min-h-screen max-w-[1400px] mx-auto">
      <Sidebar />
      
      <main className="flex-1 flex flex-col w-full px-4 sm:px-8 py-6 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">Creator Dashboard</h1>
            <p className="text-white/50">Manage your content, ads, and analytics</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-im-accent text-black font-bold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Views', value: '12.4M', change: '+24%', icon: Eye, color: 'text-blue-400' },
            { label: 'Impressions', value: '45.1M', change: '+12%', icon: Users, color: 'text-purple-400' },
            { label: 'Total Clicks', value: '2.1M', change: '+8%', icon: MousePointerClick, color: 'text-im-accent' },
            { label: 'Avg CTR', value: '4.6%', change: '+1.2%', icon: TrendingUp, color: 'text-green-400' },
          ].map((stat, i) => (
            <div key={i} className="bento-panel flex flex-col relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded-md">{stat.change}</span>
              </div>
              <span className="text-white/50 text-sm font-medium mb-1">{stat.label}</span>
              <span className="font-display font-bold text-3xl">{stat.value}</span>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-im-accent/50 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Editor */}
          <div className="lg:col-span-2 flex flex-col">
            <h2 className="font-display font-bold text-xl mb-6 px-2">Advanced Post Editor</h2>
            <CreatePost />
          </div>

          {/* Performance Panel */}
          <div className="bento-panel flex flex-col">
            <h2 className="font-display font-bold text-xl mb-6">Real-Time Performance</h2>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center py-10">
              <BarChart3 className="w-16 h-16 text-white/10 mb-4" />
              <p className="text-white/40 text-sm">Publish a post to see real-time engagement metrics, bounce rates, and click distributions here.</p>
            </div>
            
            <div className="mt-auto border-t border-white/10 pt-6">
              <h3 className="text-sm font-bold text-white/50 mb-4 uppercase tracking-wider">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-left">
                  <Settings className="w-4 h-4 text-white/40" />
                  Manage Ad Inventory
                </button>
                <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-left">
                  <Users className="w-4 h-4 text-white/40" />
                  Audience Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
