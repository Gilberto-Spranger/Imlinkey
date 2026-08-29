'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message, ChatPreview } from '@/types/chat';
import { api } from '@/utils';

interface ChatProps {
  chatId: string;
}

export default function Chat({ chatId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChat = async () => {
      setIsLoading(true);

      try {
        // Chat info
        const chatRes = await api.get(`/${chatId}/`);
        if (!chatRes.data?.error) {
          setChatInfo(chatRes.data);
        }

        // Messages (assumindo endpoint equivalente)
        const msgRes = await api.get(`/${chatId}/messages/`);
        setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();
  }, [chatId]);

  const handleSendMessage = useCallback(async (text: string) => {
    const tempId = Date.now().toString();

    const newMessage: Message = {
      id: tempId,
      text,
      sender: 'me',
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      const res = await api.post(`/${chatId}/send/`, {
        message: text,
      });

      const data = res.data;

      // replace temp message with server message
      setMessages(prev =>
        prev.map(m =>
          m.id === tempId ? { ...data, status: 'delivered' } : m
        )
      );

      // mark as read
      setTimeout(() => {
        setMessages(prev =>
          prev.map(m =>
            m.id === data.id ? { ...m, status: 'read' } : m
          )
        );
      }, 1500);

      // bot response
      if (chatInfo?.type === 'bot' || chatInfo?.type === 'user') {
        setTimeout(async () => {
          const aiRes = await api.post(`/generate/`, {
            prompt: text,
            chatId,
          });

          setMessages(prev => [...prev, aiRes.data]);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    }
  }, [chatId, chatInfo]);

  const handleGenerate = useCallback(async (type: string, prompt: string) => {
    const tempId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        text: `Generating ${type}...`,
        sender: 'me',
        status: 'sent',
        timestamp: new Date().toISOString(),
      },
    ]);

    try {
      const res = await api.post(`/generate/`, {
        type,
        prompt,
        chatId,
      });

      const data = res.data;

      setMessages(prev =>
        prev.map(m => (m.id === tempId ? data : m))
      );
    } catch (e) {
      console.error(e);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  }, [chatId]);

  const handleDeleteMessage = useCallback(async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));

    try {
      await api.delete(`/${chatId}/messages/${id}/`);
    } catch (e) {
      console.error(e);
    }
  }, [chatId]);

  const handleEditMessage = useCallback(async (id: string, newText: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id ? { ...m, text: newText, isEdited: true } : m
      )
    );

    try {
      await api.put(`/${chatId}/messages/${id}/`, {
        text: newText,
        isEdited: true,
      });
    } catch (e) {
      console.error(e);
    }
  }, [chatId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full mx-auto overflow-hidden">
      {chatInfo && (
        <ChatHeader
          name={chatInfo.name}
          username={chatInfo.username}
          avatarUrl={chatInfo.avatarUrl}
        />
      )}

      <MessageList
        messages={messages}
        onDelete={handleDeleteMessage}
        onEdit={handleEditMessage}
      />

      <ChatInput
        onSend={handleSendMessage}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
