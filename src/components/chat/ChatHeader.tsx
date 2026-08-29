'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Phone, MoreVertical, Search, BellOff, Trash2, Ban, Download, Settings, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface ChatHeaderProps {
  name: string;
  username: string;
  avatarUrl: string;
}

export default function ChatHeader({ name, username, avatarUrl }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (actionName: string) => {
    setShowMenu(false);
    setToastMessage(`Action: ${actionName}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm z-20 relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#0B2545] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 flex items-center gap-2"
          >
            {toastMessage}
            <button onClick={() => setToastMessage('')}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleAction('View Profile')}>
         <Image 
           src={avatarUrl} 
           alt={name} 
           width={48} 
           height={48} 
           className="rounded-full object-cover border-2 border-white shadow-md"
           referrerPolicy="no-referrer"
         />
         <div className="flex flex-col">
           <h1 className="text-lg font-semibold leading-tight">{name}</h1>
           <p className="text-sm text-gray-500">{username} • <span className="text-green-500 font-medium text-xs uppercase tracking-wide">Online</span></p>
         </div>
      </div>
      
      <div className="flex items-center gap-6">
         <button onClick={() => handleAction('Voice Call')} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
           <Phone size={24} strokeWidth={2} />
         </button>
         
         <div className="relative" ref={menuRef}>
           <button 
             onClick={() => setShowMenu(!showMenu)}
             className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
           >
             <MoreVertical size={24} strokeWidth={2} />
           </button>
           
           <AnimatePresence>
             {showMenu && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 origin-top-right z-50"
               >
                 <MenuItem onClick={() => handleAction('Search Chat')} icon={<span className="w-2 h-2 bg-blue-400 rounded-full"></span>} label="Search Chat" />
                 <MenuItem onClick={() => handleAction('Mute Notifications')} icon={<span className="w-2 h-2 bg-orange-400 rounded-full"></span>} label="Mute Notifications" />
                 <MenuItem onClick={() => handleAction('Clear History')} icon={<span className="w-2 h-2 bg-purple-400 rounded-full"></span>} label="Clear History" />
                 <MenuItem onClick={() => handleAction('Export Data')} icon={<span className="w-2 h-2 bg-green-400 rounded-full"></span>} label="Export Data" />
                 <MenuItem onClick={() => handleAction('Block Contact')} icon={<span className="w-2 h-2 bg-red-400 rounded-full"></span>} label="Block Contact" />
                 <MenuItem onClick={() => handleAction('Chat Settings')} icon={<span className="w-2 h-2 bg-gray-400 rounded-full"></span>} label="Chat Settings" />
               </motion.div>
             )}
           </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left cursor-pointer transition-colors">
      {icon}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
