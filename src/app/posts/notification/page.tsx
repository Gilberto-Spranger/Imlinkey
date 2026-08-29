import { Sidebar } from '@/components/layout/Sidebar';
import { Rightbar } from '@/components/layout/Rightbar';
import { NotificationsList } from '@/components/notifications/NotificationsList';

export default function NotificationsPage() {
  return (
    <div className="flex w-full min-h-screen max-w-[1400px] mx-auto">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
          <h1 className="font-display font-bold text-xl text-white">Notifications</h1>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-full lg:max-w-none mx-auto w-full lg:w-auto">
          {/* Main Content Area */}
          <div className="flex-1 max-w-[700px] mx-auto w-full pb-24 lg:pb-6">
            <NotificationsList />
          </div>

          {/* Rightbar */}
          <div className="hidden xl:block">
            <Rightbar />
          </div>
        </div>
      </main>
    </div>
  );
}
