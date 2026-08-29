'use client';
import { useEffect, useState } from 'react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { Bell, Heart, MessageCircle, Repeat2, Bookmark, UserPlus, Check, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/utils/api';

const iconMap = {
  like: <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />,
  comment: <MessageCircle className="w-5 h-5 text-blue-400" fill="currentColor" />,
  repost: <Repeat2 className="w-5 h-5 text-green-400" />,
  bookmark: <Bookmark className="w-5 h-5 text-amber-400" fill="currentColor" />,
  mention: <UserPlus className="w-5 h-5 text-im-accent" />,
};

const textMap = {
  like: 'liked your post',
  comment: 'commented on your post',
  repost: 'reposted your post',
  bookmark: 'saved your post',
  mention: 'mentioned you in a post',
};

export function NotificationsList({ onClose }: { onClose?: () => void }) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [serverNotifs, setServerNotifs] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const response = await api.get('/notifications/');
        if (response.data && response.data.length > 0) {
          setServerNotifs(response.data);
        }
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      }
    };
    fetchNotifs();
  }, []);

  const displayNotifications = serverNotifs.length > 0 ? serverNotifs : notifications;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Recent Activity</h2>
        <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
          {onClose && (
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={markAllAsRead} 
            className="text-white/40 hover:text-white transition-colors flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Mark all read
          </button>
          <button 
            onClick={clearAll} 
            className="text-red-400/50 hover:text-red-400 transition-colors flex items-center gap-1 ml-4"
          >
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
        </div>
      </div>

      <AnimatePresence>
        {displayNotifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bento-panel flex flex-col items-center justify-center py-20 text-center"
          >
            <Bell className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white/40 text-sm">You&apos;re all caught up!</p>
          </motion.div>
        ) : (
          displayNotifications.map((notif: any) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`bento-card p-4 transition-all ${notif.isRead ? 'opacity-60 hover:opacity-100' : 'border-im-accent/30 bg-im-accent/5'}`}
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {iconMap[notif.type as keyof typeof iconMap]}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden relative border border-white/10">
                      <Image src={notif.actor?.avatar || 'https://picsum.photos/seed/notif/100'} alt={notif.actor?.name || 'User'} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="font-bold text-sm">{notif.actor?.name || 'Someone'}</span>
                    <span className="text-white/60 text-sm">{textMap[notif.type as keyof typeof textMap]}</span>
                  </div>
                  
                  {notif.postPreview && (
                    <p className="text-white/40 text-sm italic mt-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      &quot;{notif.postPreview}&quot;
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.isRead && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-im-accent transition-colors tooltip-trigger"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400 transition-colors tooltip-trigger"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
