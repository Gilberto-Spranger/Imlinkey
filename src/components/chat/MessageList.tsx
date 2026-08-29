'use client';
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const MessageList = ({ messages, onDelete, onEdit }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 relative custom-scrollbar space-y-6">
      <div className="relative z-10 flex flex-col justify-end min-h-full">
        <div className="flex justify-center mb-6">
          <span className="bg-white text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm border border-gray-100">
            Hoje
          </span>
        </div>

        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
};

export default React.memo(MessageList);
