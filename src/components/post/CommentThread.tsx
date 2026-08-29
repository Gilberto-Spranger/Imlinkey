'use client';

import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

interface AuthorProps {
  name?: string;
  handle?: string;
  avatar?: string;
}

interface CommentProps {
  id: string | number;
  author?: AuthorProps;
  user_details?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  content?: string;
  timeAgo?: string;
  created_at?: string;
  likesCount?: number;
  likes_count?: number;
  replies?: CommentProps[];
}

export function CommentThread({ comment: initialComment, level = 0 }: { comment: CommentProps; level?: number }) {
  const [comment, setComment] = useState(initialComment);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // Extração Ultra Segura dos dados do Autor (Fallback automático para evitar undefined)
  const authorName = 
    comment?.author?.name || 
    comment?.user_details?.full_name || 
    comment?.user_details?.username || 
    'Usuário';

  const authorHandle = 
    comment?.author?.handle || 
    (comment?.user_details?.username ? `@${comment.user_details.username}` : '@usuario');

  const rawAvatar = 
    comment?.author?.avatar || 
    comment?.user_details?.avatar_url;

  const authorAvatar = rawAvatar && rawAvatar.trim() !== '' 
    ? rawAvatar 
    : `https://picsum.photos/seed/${authorHandle}/100/100`;

  const displayTime = comment?.timeAgo || comment?.created_at?.substring(0, 10) || 'Agora';
  const initialLikes = comment?.likesCount ?? comment?.likes_count ?? 0;

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;

    const newReply: CommentProps = {
      id: Math.random().toString(36).substring(2, 9),
      author: {
        name: 'Você',
        handle: '@voce',
        avatar: 'https://picsum.photos/seed/you/100/100'
      },
      content: replyContent,
      timeAgo: 'Agora',
      likesCount: 0,
      replies: []
    };

    setComment(prev => ({
      ...prev,
      replies: [...(prev?.replies || []), newReply]
    }));
    setReplyContent('');
    setIsReplying(false);
    setIsExpanded(true);
  };

  return (
    <div className={`flex gap-3 relative ${level > 0 ? 'mt-4' : 'mt-6'}`}>
      {/* Thread Line */}
      {level > 0 && (
        <div 
          className="absolute -left-7 top-10 bottom-[-16px] w-[2px] bg-white/[0.05] hover:bg-white/20 transition-colors cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)} 
        />
      )}

      {/* Avatar Protegido */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden relative z-10 shrink-0">
          <Image 
            src={authorAvatar} 
            alt={authorName} 
            fill 
            className="object-cover" 
            unoptimized={authorAvatar.startsWith('http')}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Conteúdo do Comentário */}
        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="font-bold hover:underline cursor-pointer text-white">{authorName}</span>
              <span className="text-white/40 text-xs">{authorHandle}</span>
              <span className="text-white/40 text-xs">· {displayTime}</span>
            </div>
            <button className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[15px] text-white/90 whitespace-pre-wrap">{comment?.content || ''}</p>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4 mt-2 ml-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              isLiked ? 'text-pink-500' : 'text-white/50 hover:text-pink-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {initialLikes + (isLiked ? 1 : 0)}
          </button>
          <button 
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-cyan-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Responder
          </button>
        </div>

        {/* Caixinha de Resposta */}
        {isReplying && (
          <div className="mt-4 ml-2 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden relative z-10 shrink-0">
              <Image 
                src="https://picsum.photos/seed/you/100/100" 
                alt="Eu" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="flex-1 flex gap-2">
              <input 
                type="text" 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                placeholder="Escreva uma resposta..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 transition-all"
              />
              <button 
                onClick={handleReplySubmit}
                className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-cyan-400 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* Respostas Aninhadas (Recursivo) */}
        {isExpanded && comment?.replies && comment.replies.length > 0 && (
          <div className="ml-2">
            {comment.replies.map((reply, idx) => (
              <CommentThread key={reply?.id || idx} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
