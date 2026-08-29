'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationType = 'like' | 'comment' | 'mention' | 'repost' | 'bookmark';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: { name: string; handle: string; avatar: string };
  postPreview?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => [
    {
      id: '1',
      type: 'like',
      actor: { name: 'Sarah Connor', handle: '@sarahc', avatar: 'https://picsum.photos/seed/sarah/100/100' },
      postPreview: 'Just launched my new portfolio...',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      type: 'mention',
      actor: { name: 'Alex Rivers', handle: '@arivers', avatar: 'https://picsum.photos/seed/alex/100/100' },
      postPreview: 'Hey @user, what do you think about this?',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
  ]);

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      isRead: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  useEffect(() => {
    // Simulate incoming notifications occasionally
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types: NotificationType[] = ['like', 'comment', 'repost', 'bookmark', 'mention'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        addNotification({
          type: randomType,
          actor: { 
            name: 'New User ' + Math.floor(Math.random() * 100), 
            handle: '@user' + Math.floor(Math.random() * 100), 
            avatar: `https://picsum.photos/seed/${Math.random()}/100/100` 
          },
          postPreview: 'A new interaction occurred!',
        });
      }
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
