'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, Image as ImageIcon, Video, FileText, Mic, Wand2, Music, Clapperboard, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatInput({ onSend, onGenerate }: { onSend: (text: string) => void, onGenerate?: (type: string, prompt: string) => void }) {
  const [text, setText] = useState('');
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPlusMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
      inputRef.current?.focus();
    }
  };

  const callGenerate = (type: string) => {
    if (onGenerate) {
      onGenerate(type, text);
      setText('');
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-8 py-6 z-30">
      <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 border border-gray-100 shadow-inner relative max-w-5xl mx-auto">
        <AnimatePresence>
          {showPlusMenu && (
            <motion.div 
              ref={menuRef}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="absolute bottom-full left-0 mb-4 flex flex-col gap-1 bg-white border border-gray-100 p-2 rounded-xl shadow-2xl w-48 z-50 origin-bottom-left"
            >
               <MenuItem onClick={() => { setShowPlusMenu(false); callGenerate('Photo'); }} icon={<div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold"><ImageIcon size={18} /></div>} label="Photo" hoverColor="hover:bg-blue-50" />
               <MenuItem onClick={() => { setShowPlusMenu(false); callGenerate('Video'); }} icon={<div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center font-bold"><Video size={18} /></div>} label="Video" hoverColor="hover:bg-green-50" />
               <MenuItem onClick={() => { setShowPlusMenu(false); callGenerate('Audio'); }} icon={<div className="w-8 h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center font-bold"><Mic size={18} /></div>} label="Audio" hoverColor="hover:bg-orange-50" />
               <MenuItem onClick={() => { setShowPlusMenu(false); callGenerate('Docs'); }} icon={<div className="w-8 h-8 bg-purple-100 text-purple-600 rounded flex items-center justify-center font-bold"><FileText size={18} /></div>} label="Docs" hoverColor="hover:bg-purple-50" />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className={`w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow transition-all ${showPlusMenu ? 'text-[#0B2545] ring-2 ring-[#0B2545]/20' : 'text-[#0B2545]'}`}
        >
          <Plus size={24} className={showPlusMenu ? 'rotate-45 transition-transform' : 'transition-transform'} />
        </button>
        
        <input 
          ref={inputRef}
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Write a message..."
          className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-gray-700 outline-none"
        />

        <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-4">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mr-2">Generate:</span>
          <button onClick={() => callGenerate('Video')} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors">Video</button>
          <button onClick={() => callGenerate('Docs')} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">Docs</button>
          <button onClick={() => callGenerate('Music')} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors">Music</button>
          <button onClick={() => callGenerate('Audio')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"><Mic size={20} /></button>
        </div>
        
        <button 
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-xl bg-[#0B2545] flex items-center justify-center text-white shadow-lg shadow-[#0B2545]/20 hover:bg-[#133A6B] transition-all disabled:opacity-50 disabled:scale-95"
        >
          <Send size={20} className="ml-1" />
        </button>
      </div>

      <div className="mt-3 flex justify-center">
        <p className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">LATENCY: 12ms | CACHE: WARM | SECURITY: E2EE</p>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, hoverColor, onClick }: { icon: React.ReactNode, label: string, hoverColor: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${hoverColor}`}>
      {icon}
      <span className="text-gray-700">{label}</span>
    </button>
  );
}
