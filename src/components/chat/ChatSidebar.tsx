'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Users, Bot, Settings, Menu, X } from 'lucide-react';
import { ChatPreview } from '@/types/chat';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  selectedChatId: string;
  onSelectChat: (id: string) => void;
}

export default function ChatSidebar({ selectedChatId, onSelectChat }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chats');
        const data = await res.json();
        if (Array.isArray(data)) setChats(data);
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (actionName: string) => {
    setToastMessage(`Action: ${actionName}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(search.toLowerCase()) || 
    chat.username.toLowerCase().includes(search.toLowerCase())
  );

  const usersAndGroups = filteredChats.filter(c => c.type === 'user' || c.type === 'group');
  const bots = filteredChats.filter(c => c.type === 'bot' || c.type === 'ai');

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col z-20 flex-shrink-0 relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0B2545] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 flex items-center gap-2"
          >
            {toastMessage}
            <button onClick={() => setToastMessage('')}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="https://imlinkey.store/favicon.png" alt="Logo" width={32} height={32} className="rounded-lg shadow-sm" unoptimized />
          <span className="font-bold text-lg text-[#0B2545] tracking-tight">Imlinkey</span>
        </div>
        <button onClick={() => handleAction('Open Sidebar Menu')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Menu size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 border border-transparent focus-within:bg-white focus-within:border-[#0B2545] focus-within:ring-2 focus-within:ring-[#0B2545]/20 transition-all">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users or bots..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {usersAndGroups.length > 0 && (
          <div className="mb-4">
            <div className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={14} /> Users & Groups
            </div>
            {usersAndGroups.map(chat => (
              <ChatListItem key={chat.id} chat={chat} isSelected={selectedChatId === chat.id} onClick={() => onSelectChat(chat.id)} />
            ))}
          </div>
        )}

        {bots.length > 0 && (
          <div className="mb-4">
            <div className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Bot size={14} /> AI & Bots
            </div>
            {bots.map(chat => (
              <ChatListItem key={chat.id} chat={chat} isSelected={selectedChatId === chat.id} onClick={() => onSelectChat(chat.id)} />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button onClick={() => handleAction('Settings')} className="flex items-center gap-3 w-full p-2 text-sm font-medium text-gray-600 hover:text-[#0B2545] hover:bg-gray-50 rounded-lg transition-colors">
          <Settings size={18} /> Settings
        </button>
      </div>
    </div>
  );
}

function ChatListItem({ chat, isSelected, onClick }: { chat: ChatPreview, isSelected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/50 border-r-2 border-[#0B2545]' : 'hover:bg-gray-50'}`}
    >
      <div className="relative">
        <Image 
          src={chat.avatarUrl} 
          alt={chat.name} 
          width={44} 
          height={44} 
          className="rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
        {(chat.type === 'bot' || chat.type === 'ai') && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
             <div className="w-3.5 h-3.5 bg-purple-500 rounded-full flex items-center justify-center">
               <Bot size={8} className="text-white" />
             </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="font-semibold text-sm text-gray-900 truncate">{chat.name}</span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{chat.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 truncate mr-2">{chat.lastMessage}</span>
          {chat.unread > 0 && (
            <span className="w-4 h-4 bg-[#0B2545] text-white text-[10px] font-bold flex items-center justify-center rounded-full flex-shrink-0">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
