'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  Bookmark, 
  MoreHorizontal, 
  Eye, 
  CheckCircle2,
  Trash2,
  Copy,
  VolumeX,
  ShieldAlert,
  ExternalLink,
  X,
  Music,
  Play,
  Pause
} from 'lucide-react';
import { VideoPlayer } from '@/components/post/VideoPlayer';
import { api } from '@/utils/api';

type TextStyleType = 'normal' | 'modern' | 'serif' | 'mono' | 'elegant';
type TextAlignType = 'left' | 'center' | 'right' | 'justify';

export interface PostProps {
  id: string;
  slug?: string;
  text_style?: TextStyleType;
  text_align?: TextAlignType;
  author?: {
    id?: string;
    name?: string;
    handle?: string;
    verified?: boolean;
    avatar?: string;
  };
  content?: string;
  timeAgo?: string;
  created_at?: string;
  stats?: {
    likes?: number | string;
    comments?: number | string;
    reposts?: number | string;
    views?: number | string;
  };
  media?: 
    | {
        type?: 'image' | 'video' | 'audio' | 'link';
        media_type?: string;
        url?: string;
        file?: string;
        thumbnail?: string;
      }
    | Array<{
        type?: 'image' | 'video' | 'audio' | 'link';
        media_type?: string;
        url?: string;
        file?: string;
        thumbnail?: string;
      }>;
  userInteractions?: {
    liked?: boolean;
    reposted?: boolean;
    bookmarked?: boolean;
    reactionId?: string;
    repostId?: string;
    bookmarkId?: string;
  };
}

interface CurrentUser {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
}

interface AdData {
  id: string;
  title: string;
  media_type: 'image' | 'video';
  media_url: string;
  target_url: string;
  duration_seconds: number;
}

export function PostCard({ post }: { post: PostProps }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Estados de Anúncio
  const [ad, setAd] = useState<AdData | null>(null);
  const [showAd, setShowAd] = useState(false);

  const postSlugOrId = post?.slug || post?.id || '';

  const authorName = post?.author?.name ?? 'Usuário';
  const authorHandle = post?.author?.handle ?? 'usuario';
  const authorAvatar = post?.author?.avatar || `https://picsum.photos/seed/${authorHandle}/100/100`;
  const isVerified = post?.author?.verified ?? false;
  const postContent = post?.content ?? '';
  const postTime = post?.timeAgo ?? (post?.created_at ? new Date(post.created_at).toLocaleDateString() : 'Agora');

  // Normalização de Mídia
  const rawMedia = Array.isArray(post?.media) ? post.media[0] : post?.media;
  const mediaUrl = rawMedia?.url || rawMedia?.file || null;
  const mediaType = rawMedia?.type || rawMedia?.media_type || 'image';
  const mediaThumbnail = rawMedia?.thumbnail || null;

  const parseStat = (val?: number | string): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(post?.userInteractions?.liked ?? false);
  const [isReposted, setIsReposted] = useState(post?.userInteractions?.reposted ?? false);
  const [isBookmarked, setIsBookmarked] = useState(post?.userInteractions?.bookmarked ?? false);

  const [reactionId, setReactionId] = useState<string | null>(post?.userInteractions?.reactionId ?? null);
  const [repostId, setRepostId] = useState<string | null>(post?.userInteractions?.repostId ?? null);
  const [bookmarkId, setBookmarkId] = useState<string | null>(post?.userInteractions?.bookmarkId ?? null);

  const [likesCount, setLikesCount] = useState<number>(parseStat(post?.stats?.likes));
  const [repostsCount, setRepostsCount] = useState<number>(parseStat(post?.stats?.reposts));
  const [viewsCount, setViewsCount] = useState<number>(parseStat(post?.stats?.views));
  const commentsCount = parseStat(post?.stats?.comments);

  useEffect(() => {
    api.get('/profile/')
      .then((res) => setCurrentUser(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/ads/random/')
      .then((res) => {
        if (res.data) {
          setAd(res.data);
          setShowAd(true);
        }
      })
      .catch(() => {});
  }, [post?.id]);

  useEffect(() => {
    if (!showAd || !ad) return;
    const duration = (ad.duration_seconds || 20) * 1000;
    const timer = setTimeout(() => setShowAd(false), duration);
    return () => clearTimeout(timer);
  }, [showAd, ad]);

  useEffect(() => {
    if (!post?.id || typeof window === 'undefined') return;

    let timer: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            api.post('/impressions/', { post: post.id, position: 1, device: 'web' }).catch(() => {});

            timer = setTimeout(async () => {
              try {
                await api.post('/views/', { post: post.id, duration: 1.0 });
                setViewsCount((prev) => prev + 1);
              } catch (e) {
                console.error('Erro ao registrar view:', e);
              }
            }, 1000);
          } else {
            clearTimeout(timer);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [post?.id]);

  const trackClick = (clickType: 'post' | 'profile' | 'like' | 'comment' | 'share' | 'media' | 'ad') => {
    if (!post?.id) return;
    api.post('/clicks/', { post: post.id, click_type: clickType }).catch(() => {});
  };

  const handleLike = async () => {
    if (!post?.id) return;
    trackClick('like');

    const previousState = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousState);
    setLikesCount(previousState ? previousCount - 1 : previousCount + 1);

    try {
      if (!previousState) {
        const res = await api.post('/reactions/', { post: post.id, type: 'like' });
        setReactionId(res.data?.id ?? null);
      } else if (reactionId) {
        await api.delete(`/reactions/${reactionId}/`);
        setReactionId(null);
      }
    } catch (e) {
      console.error('Erro no Like:', e);
      setIsLiked(previousState);
      setLikesCount(previousCount);
    }
  };

  const handleRepost = async () => {
    if (!post?.id) return;
    trackClick('share');

    const previousState = isReposted;
    const previousCount = repostsCount;

    setIsReposted(!previousState);
    setRepostsCount(previousState ? previousCount - 1 : previousCount + 1);

    try {
      if (!previousState) {
        const res = await api.post('/reposts/', { post: post.id });
        setRepostId(res.data?.id ?? null);
      } else if (repostId) {
        await api.delete(`/reposts/${repostId}/`);
        setRepostId(null);
      }
    } catch (e) {
      console.error('Erro no Repost:', e);
      setIsReposted(previousState);
      setRepostsCount(previousCount);
    }
  };

  const handleBookmark = async () => {
    if (!post?.id) return;

    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      if (!previousState) {
        const res = await api.post('/bookmarks/', { post: post.id });
        setBookmarkId(res.data?.id ?? null);
      } else if (bookmarkId) {
        await api.delete(`/bookmarks/${bookmarkId}/`);
        setBookmarkId(null);
      }
    } catch (e) {
      console.error('Erro no Bookmark:', e);
      setIsBookmarked(previousState);
    }
  };

  const handleDeletePost = async () => {
    if (!post?.id || !confirm('Tem certeza de que deseja apagar este post?')) return;

    try {
      await api.delete(`/posts/${post.id}/`);
      setIsDeleted(true);
    } catch (e) {
      console.error('Erro ao deletar post:', e);
      alert('Erro ao apagar o post.');
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/posts/${postSlugOrId}`;
    navigator.clipboard.writeText(link);
    setIsMenuOpen(false);
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  const getContentStyles = () => {
    const style = post?.text_style || 'normal';
    const align = post?.text_align || 'left';

    let fontClass = 'font-sans';
    if (style === 'modern') fontClass = 'font-sans tracking-wide';
    if (style === 'serif') fontClass = 'font-serif';
    if (style === 'mono') fontClass = 'font-mono text-sm';
    if (style === 'elegant') fontClass = 'font-serif italic';

    let alignClass = 'text-left';
    if (align === 'center') alignClass = 'text-center';
    if (align === 'right') alignClass = 'text-right';
    if (align === 'justify') alignClass = 'text-justify';

    return `${fontClass} ${alignClass}`;
  };

  if (isDeleted) return null;

  const isOwner = currentUser?.id === post?.author?.id || currentUser?.username === authorHandle;

  const actionBtnClass = (isActive: boolean) =>
    `flex items-center gap-2 p-2 rounded-xl transition-all duration-200 relative z-10 ${
      isActive
        ? 'bg-green-500/10 text-green-400'
        : 'text-white/60 hover:text-white bg-transparent hover:bg-white/5'
    }`;

  return (
    <article
      ref={cardRef}
      className="bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl max-w-xl mx-auto my-4 transition-all duration-300 hover:border-white/20 relative"
    >
      {/* Cabeçalho do Post */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/${authorHandle}`}
              onClick={() => trackClick('profile')}
              className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 block flex-shrink-0"
            >
              <Image
                src={authorAvatar}
                alt={authorName}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/${authorHandle}`}
                  onClick={() => trackClick('profile')}
                  className="font-bold text-[15px] hover:underline text-white leading-none"
                >
                  {authorName}
                </Link>
                {isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-green-400 fill-green-400/20" />
                )}
                <span className="text-white/40 text-xs">• {postTime}</span>
              </div>
              <span className="text-white/50 text-xs">@{authorHandle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider transition-all ${
                isFollowing
                  ? 'bg-white/5 text-white/50 hover:bg-white/10'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isFollowing ? 'A seguir' : 'Seguir'}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-[#121214] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-sm">
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 text-white/80 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar link
                </button>

                {isOwner ? (
                  <button
                    onClick={handleDeletePost}
                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir Publicação
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-white/80 flex items-center gap-2"
                    >
                      <VolumeX className="w-4 h-4" />
                      Silenciar @{authorHandle}
                    </button>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-red-400 flex items-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Denunciar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo do Post */}
        <Link
          href={`/posts/${postSlugOrId}`}
          onClick={() => trackClick('post')}
          className="block mb-4 group cursor-pointer"
        >
          <div 
            className={`text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap ${getContentStyles()}`}
            dangerouslySetInnerHTML={{ __html: postContent }}
          />
        </Link>

        {/* Mídias em Formato 300x300 (Vídeo, Áudio+Thumb e Imagem) */}
        {mediaUrl && (
          <div className="mb-4 flex justify-center">
            {mediaType === 'video' ? (
              <div className="w-[300px] h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-black relative flex-shrink-0">
                <VideoPlayer src={mediaUrl} poster={mediaThumbnail || undefined} />
              </div>
            ) : mediaType === 'audio' ? (
              /* Áudio formatado como Card de Vídeo em 300x300 com Thumbnail */
              <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/80 group">
                <audio
                  ref={audioRef}
                  src={mediaUrl}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />
                
                {mediaThumbnail ? (
                  <Image
                    src={mediaThumbnail}
                    alt="Capa do Áudio"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-900/40 via-black to-zinc-900 flex items-center justify-center">
                    <Music className="w-16 h-16 text-green-400/60" />
                  </div>
                )}

                {/* Overlayer e Player no formato vídeo */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-between p-4">
                  <div className="w-full flex items-center justify-between text-xs text-white/70 font-mono bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="flex items-center gap-1.5 text-green-400 font-bold">
                      <Music className="w-3.5 h-3.5" /> ÁUDIO
                    </span>
                  </div>

                  <button
                    onClick={toggleAudioPlay}
                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-8 h-8 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                  </button>

                  <div className="w-full text-center">
                    <span className="text-xs text-white/80 font-medium line-clamp-1 bg-black/60 px-3 py-1 rounded-lg">
                      {authorName}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer flex-shrink-0 bg-black/50"
                onClick={() => trackClick('media')}
              >
                <Image
                  src={mediaUrl}
                  alt="Mídia da publicação"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        )}

        {/* Sessão Patrocinada / Anúncio */}
        {showAd && ad && (
          <div className="mt-4 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-400/80 bg-yellow-400/10 px-2 py-0.5 rounded">
                Patrocinado
              </span>
              <button
                onClick={() => setShowAd(false)}
                className="text-white/40 hover:text-white p-0.5 rounded-md hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <a
              href={ad.target_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('ad')}
              className="block group"
            >
              {ad.media_type === 'video' ? (
                <div className="w-[300px] h-[300px] mx-auto rounded-lg overflow-hidden my-2 border border-white/10">
                  <VideoPlayer src={ad.media_url} />
                </div>
              ) : (
                <div className="relative w-[300px] h-[300px] mx-auto rounded-lg overflow-hidden my-2 border border-white/10">
                  <Image
                    src={ad.media_url}
                    alt={ad.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold text-white group-hover:underline">
                  {ad.title}
                </span>
                <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white" />
              </div>
            </a>
          </div>
        )}
      </div>

      {/* Barra Interativa BENTO */}
      <div className="h-16 bg-[#121214] border-t border-white/5 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-3">
          <button className={actionBtnClass(isLiked)} onClick={handleLike}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} strokeWidth={2} />
            <span className="text-sm font-bold tracking-tighter">{likesCount}</span>
          </button>

          <Link
            href={`/posts/${postSlugOrId}`}
            onClick={() => trackClick('comment')}
            className={actionBtnClass(false)}
          >
            <MessageCircle className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-bold tracking-tighter">{commentsCount}</span>
          </Link>

          <button className={actionBtnClass(isReposted)} onClick={handleRepost}>
            <Repeat2 className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-bold tracking-tighter">{repostsCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className={actionBtnClass(false)} title="Visualizações">
            <Eye className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm font-bold tracking-tighter">{viewsCount}</span>
          </button>

          <button className={actionBtnClass(isBookmarked)} onClick={handleBookmark}>
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} strokeWidth={2} />
          </button>

          <button
            className={actionBtnClass(false)}
            onClick={() => {
              trackClick('share');
              if (typeof window !== 'undefined' && navigator.share) {
                const shareUrl = `${window.location.origin}/posts/${postSlugOrId}`;
                navigator
                  .share({
                    title: `Publicação de ${authorName}`,
                    url: shareUrl,
                  })
                  .catch(() => {});
              }
            }}
          >
            <Share className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
}
