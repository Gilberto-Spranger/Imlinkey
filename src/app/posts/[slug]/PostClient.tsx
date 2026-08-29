// app/posts/[slug]/PostClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Rightbar } from '@/components/layout/Rightbar';
import { PostCard } from '@/components/feed/PostCard';
import { CommentThread } from '@/components/post/CommentThread';
import { api } from '@/utils/api';

interface PostClientProps {
  slugOrId: string;
}

export default function PostClient({ slugOrId }: PostClientProps) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Normalização do payload do Post
  const formatPostData = useCallback((data: any) => {
    if (!data) return null;
    return {
      id: String(data.id),
      slug: data.slug || slugOrId,
      title: data.title,
      content: data.content ?? '',
      text_style: data.text_style || 'normal',
      text_align: data.text_align || 'left',
      created_at: data.created_at,
      timeAgo: data.time_ago || data.timeAgo || 'Agora',
      author: {
        id: data.user_details?.id || data.author?.id,
        name: data.user_details?.full_name || data.user_details?.username || data.author?.name || 'Usuário',
        handle: data.user_details?.username || data.author?.handle || 'usuario',
        avatar: data.user_details?.avatar_url || data.author?.avatar,
        verified: data.user_details?.is_verified || data.author?.verified || false,
      },
      stats: {
        likes: data.likes_count ?? data.stats?.likes ?? 0,
        comments: data.comments_count ?? data.stats?.comments ?? 0,
        reposts: data.reposts_count ?? data.stats?.reposts ?? 0,
        views: data.views_count ?? data.stats?.views ?? 0,
      },
      media: data.media || [],
      userInteractions: {
        liked: data.user_has_liked ?? data.userInteractions?.liked ?? false,
        reposted: data.user_has_reposted ?? data.userInteractions?.reposted ?? false,
        bookmarked: data.user_has_bookmarked ?? data.userInteractions?.bookmarked ?? false,
        reactionId: data.user_reaction_id || data.userInteractions?.reactionId || null,
        repostId: data.user_repost_id || data.userInteractions?.repostId || null,
        bookmarkId: data.user_bookmark_id || data.userInteractions?.bookmarkId || null,
      },
    };
  }, [slugOrId]);

  const loadCommentsForPost = async (postId: string) => {
    try {
      const commentsRes = await api.get(`/comments/?post=${postId}`);
      const rawComments = commentsRes.data?.results || commentsRes.data || [];
      setComments(Array.isArray(rawComments) ? rawComments : []);
    } catch (cErr) {
      console.error("Erro ao carregar comentários:", cErr);
      setComments([]);
    }
  };

  const fetchData = useCallback(async () => {
    if (!slugOrId) return;
    setLoading(true);
    setError(false);

    try {
      let rawPostData = null;

      try {
        const res = await api.get(`/posts/${slugOrId}/`);
        if (res.data && res.data.id) {
          rawPostData = res.data;
        }
      } catch (err) {}

      if (!rawPostData) {
        try {
          const res = await api.get(`/posts/?slug=${encodeURIComponent(slugOrId)}`);
          const results = res.data?.results || res.data || [];
          if (Array.isArray(results) && results.length > 0) {
            rawPostData = results[0];
          }
        } catch (err) {
          console.error("Erro na busca por query slug:", err);
        }
      }

      if (rawPostData) {
        const formatted = formatPostData(rawPostData);
        setPost(formatted);
        await loadCommentsForPost(rawPostData.id);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error('Erro ao carregar o post:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slugOrId, formatPostData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReply = async () => {
    if (!replyText.trim() || isReplying || !post?.id) return;

    setIsReplying(true);
    try {
      await api.post('/comments/', {
        post: post.id,
        content: replyText.trim(),
      });

      setReplyText('');
      await loadCommentsForPost(post.id);

      setPost((prev: any) =>
        prev
          ? {
              ...prev,
              stats: {
                ...prev.stats,
                comments: (prev.stats?.comments || 0) + 1,
              },
            }
          : prev
      );
    } catch (e) {
      console.error('Erro ao responder:', e);
      alert('Ocorreu um erro ao enviar o comentário. Tente novamente.');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen max-w-[1400px] mx-auto bg-[#09090b] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen border-r border-white/10">
        <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl px-4 flex items-center gap-4 shrink-0">
          <Link
            href="/"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-none text-white">Publicação</span>
            {post?.author?.handle && (
              <span className="text-xs text-white/40 mt-0.5">@{post.author.handle}</span>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 max-w-full lg:max-w-none mx-auto w-full">
          <div className="flex-1 max-w-[700px] mx-auto w-full pb-24 lg:pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider">A carregar publicação...</span>
              </div>
            ) : post && !error ? (
              <>
                <PostCard post={post} />

                <div className="mt-6 bg-[#121214] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-lg text-white">
                      Comentários <span className="text-white/40 text-sm">({post.stats?.comments || comments.length})</span>
                    </h3>
                  </div>

                  <div className="flex gap-3 mb-8">
                    <div className="flex-1 relative">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escreva a sua resposta..."
                        rows={2}
                        className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleReply}
                          disabled={isReplying || !replyText.trim()}
                          className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                            replyText.trim() && !isReplying
                              ? 'bg-white text-black hover:bg-cyan-400 hover:text-black shadow-lg cursor-pointer'
                              : 'bg-white/10 text-white/30 cursor-not-allowed'
                          }`}
                        >
                          {isReplying ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>A enviar...</span>
                            </>
                          ) : (
                            <>
                              <span>Responder</span>
                              <Send className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {comments.length > 0 ? (
                      comments.map((comment: any, idx: number) => (
                        <CommentThread key={comment.id || idx} comment={comment} />
                      ))
                    ) : (
                      <div className="text-center py-10 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                        <p className="text-sm text-white/40">Seja o primeiro a comentar esta publicação.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 border border-white/10 rounded-2xl bg-[#121214]">
                <p className="text-base text-white/60 mb-4">Esta publicação não foi encontrada ou não está mais disponível.</p>
                <Link
                  href="/"
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs uppercase font-bold tracking-wider transition-colors inline-block"
                >
                  Voltar ao início
                </Link>
              </div>
            )}
          </div>

          <div className="hidden xl:block">
            <Rightbar />
          </div>
        </div>
      </main>
    </div>
  );
}
