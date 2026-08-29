'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Check, CheckCheck, Trash2, Edit2, Share2, X } from 'lucide-react';
import { Message } from '@/types/chat';
import { motion, AnimatePresence } from 'motion/react';

interface MessageBubbleProps {
  message: Message;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const MessageBubble = ({ message, onDelete, onEdit }: MessageBubbleProps) => {
  const isMe = message.sender === 'me';
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.text);
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  
  const handleStart = () => {
    setIsPressing(true);
    pressTimer.current = setTimeout(() => {
      setShowOptions(true);
      setIsPressing(false);
    }, 3000); // 3 seconds long press
  };

  const handleEnd = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Status icon logic
  const renderStatus = () => {
    // Show status for all messages as requested "Tanto a SMS do sender quanto a do receiver devem ter os as mesmas funções e opções"
    if (message.status === 'sent') return <Check size={14} className="opacity-70" />;
    if (message.status === 'delivered') return <CheckCheck size={14} className="opacity-70" />;
    if (message.status === 'read') return <CheckCheck size={14} className="text-green-300" />;
    return null;
  };

  return (
    <div className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'} relative`}>
      <div className="relative group">
        <motion.div 
          animate={{ scale: isPressing ? 0.96 : 1 }}
          transition={{ duration: 0.2 }}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          className={`max-w-[75vw] md:max-w-md p-4 rounded-2xl cursor-pointer select-none transition-shadow
            ${isPressing ? 'ring-2 ring-[#0B2545] ring-offset-2' : ''}
            ${isMe ? 'bg-[#0B2545] text-white rounded-tr-none shadow-lg' : message.sender === 'ai' ? 'bg-indigo-600 text-white rounded-tl-none shadow-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'}`}
        >
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <textarea 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={`w-full ${isMe ? 'bg-[#133A6B]' : 'bg-gray-100 text-gray-800'} text-white rounded p-2 outline-none resize-none text-sm placeholder:text-gray-300`}
                rows={2}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-1">
                 <button onClick={() => setIsEditing(false)} className={`text-xs p-1.5 ${isMe ? 'hover:bg-[#133A6B]' : 'hover:bg-gray-200'} rounded-full transition-colors`}><X size={14} /></button>
                 <button onClick={() => { onEdit(message.id, editValue); setIsEditing(false); }} className={`text-xs ${isMe ? 'bg-white text-[#0B2545] hover:bg-gray-50' : 'bg-[#0B2545] text-white hover:bg-[#133A6B]'} px-3 py-1.5 rounded-full font-semibold transition-colors`}>Save</button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.text}</div>
          )}
          
          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe || message.sender === 'ai' ? 'opacity-70' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {message.isEdited && <span className="ml-1 opacity-80">(edited)</span>}
            {renderStatus()}
          </div>
        </motion.div>

        {/* Options Overlay */}
        <AnimatePresence>
          {showOptions && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className={`absolute -top-14 ${isMe ? 'right-0' : 'left-0'} flex gap-1 bg-[#1A1C1E] text-white rounded-lg p-1 shadow-xl text-xs z-50`}
            >
               <button onClick={() => setShowOptions(false)} className="px-3 py-1 hover:bg-gray-700 rounded transition-colors"><X size={14} /></button>
               <div className="w-px bg-gray-700"></div>
               <button onClick={() => { setIsEditing(true); setShowOptions(false); }} className="px-3 py-1 hover:bg-gray-700 rounded transition-colors">Edit</button>
               <div className="w-px bg-gray-700"></div>
               <button onClick={() => { navigator.clipboard.writeText(message.text); alert('Message copied to clipboard!'); setShowOptions(false); }} className="px-3 py-1 hover:bg-gray-700 rounded transition-colors">Share</button>
               <div className="w-px bg-gray-700"></div>
               <button onClick={() => { onDelete(message.id); setShowOptions(false); }} className="px-3 py-1 hover:bg-gray-700 rounded transition-colors text-red-400">Delete</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Click outside to close options (simple overlay) */}
      {showOptions && (
        <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
      )}
    </div>
  );
};

export default React.memo(MessageBubble);
