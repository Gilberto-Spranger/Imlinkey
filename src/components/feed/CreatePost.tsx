'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ImageIcon, 
  Video, 
  Music, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Type, 
  X 
} from 'lucide-react';
import Image from 'next/image';
import { api } from '@/utils/api';

interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

type DjangoMediaType = 'image' | 'video' | 'audio';
type TextStyleType = 'normal' | 'modern' | 'serif' | 'mono' | 'elegant';
type TextAlignType = 'left' | 'center' | 'right' | 'justify';

interface AttachedFile {
  file: File;
  thumbnailFile?: File | null;
  previewUrl: string;
  thumbnailPreviewUrl?: string | null;
  djangoMediaType: DjangoMediaType;
  name: string;
}

export function CreatePost({ onPostCreated }: { onPostCreated?: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [textStyle, setTextStyle] = useState<TextStyleType>('normal');
  const [textAlign, setTextAlign] = useState<TextAlignType>('left');
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [attachment, setAttachment] = useState<AttachedFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLinkPreviewClosed, setIsLinkPreviewClosed] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const detectedUrls = content.match(urlRegex);
  const detectedUrl = detectedUrls ? detectedUrls[0] : null;
  const showLinkPreview = Boolean(detectedUrl) && !isLinkPreviewClosed;

  useEffect(() => {
    api.get('/profile/')
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error('Erro ao carregar perfil:', err));
  }, []);

  const handleAlignChange = (align: TextAlignType) => {
    setTextAlign(align);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML || '');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, mediaType: DjangoMediaType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAttachment({
      file,
      previewUrl,
      djangoMediaType: mediaType,
      name: file.name,
      thumbnailFile: null,
      thumbnailPreviewUrl: null,
    });
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !attachment) return;

    const thumbnailPreviewUrl = URL.createObjectURL(file);
    setAttachment({
      ...attachment,
      thumbnailFile: file,
      thumbnailPreviewUrl,
    });
  };

  const handleRemoveAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    if (attachment?.thumbnailPreviewUrl) URL.revokeObjectURL(attachment.thumbnailPreviewUrl);
    
    setAttachment(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
    if (thumbInputRef.current) thumbInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    const hasText = title.trim().length > 0 || content.trim().length > 0;
    if ((!hasText && !attachment) || isSubmitting) return;

    setIsSubmitting(true);

    try {
      let postType = 'text';
      if (attachment && (showLinkPreview || content)) {
        postType = 'mixed';
      } else if (attachment) {
        postType = 'media';
      } else if (showLinkPreview) {
        postType = 'link';
      }

      // 1. Criar a publicação no backend
      const postRes = await api.post('/posts/', {
        title: title.trim() || null,
        content: content.trim(),
        text_style: textStyle,
        text_align: textAlign,
        post_type: postType,
      });

      const postId = postRes.data.id;

      // 2. Upload de Mídia e Thumbnail
      if (attachment && postId) {
        const formData = new FormData();
        formData.append('post', postId);
        formData.append('file', attachment.file);
        formData.append('media_type', attachment.djangoMediaType);
        formData.append('order', '0');

        if (attachment.thumbnailFile) {
          formData.append('thumbnail', attachment.thumbnailFile);
        }

        await api.post('/post-media/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // 3. Link Preview
      if (showLinkPreview && detectedUrl && postId) {
        await api.post('/post-links/', {
          post: postId,
          url: detectedUrl,
          title: title.trim() || 'Link compartilhado',
          description: '',
          domain: new URL(detectedUrl).hostname,
        }).catch(() => {});
      }

      // Limpeza de campos após a publicação
      setTitle('');
      setContent('');
      setTextStyle('normal');
      setTextAlign('left');
      if (editorRef.current) editorRef.current.innerHTML = '';
      handleRemoveAttachment();
      setIsLinkPreviewClosed(false);

      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert('Falha ao publicar. Verifique a conexão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEditorStyles = () => {
    let fontClass = 'font-sans';
    if (textStyle === 'modern') fontClass = 'font-sans tracking-wide';
    if (textStyle === 'serif') fontClass = 'font-serif';
    if (textStyle === 'mono') fontClass = 'font-mono text-sm';
    if (textStyle === 'elegant') fontClass = 'font-serif italic';

    let alignClass = 'text-left';
    if (textAlign === 'center') alignClass = 'text-center';
    if (textAlign === 'right') alignClass = 'text-right';
    if (textAlign === 'justify') alignClass = 'text-justify';

    return `${fontClass} ${alignClass}`;
  };

  const avatarUrl = currentUser?.avatar_url || `https://picsum.photos/seed/${currentUser?.username || 'user'}/100/100`;

  return (
    <div className="bg-[#09090b] border border-white/10 rounded-2xl mb-6 p-5 sm:p-6 relative overflow-visible">
      <div className="flex gap-4 relative z-10">
        <div className="w-11 h-11 rounded-full border border-white/10 flex-shrink-0 relative overflow-hidden bg-white/5">
          <Image
            src={avatarUrl}
            alt={currentUser?.full_name || 'Avatar'}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col">
          {/* Título da Publicação */}
          <input
            type="text"
            placeholder="Título da publicação"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full bg-transparent border-b border-white/10 pb-2 mb-3 text-lg font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 transition-colors ${getEditorStyles()}`}
          />

          {/* Barra de Ferramentas */}
          <div className="flex flex-wrap items-center gap-1 mb-2 pb-2 border-b border-white/5 text-white/50">
            <button 
              type="button" 
              onClick={() => handleAlignChange('left')} 
              className={`p-1.5 rounded transition-colors ${textAlign === 'left' ? 'bg-white/20 text-white' : 'hover:bg-white/10 hover:text-white'}`} 
              title="Esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => handleAlignChange('center')} 
              className={`p-1.5 rounded transition-colors ${textAlign === 'center' ? 'bg-white/20 text-white' : 'hover:bg-white/10 hover:text-white'}`} 
              title="Centro"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => handleAlignChange('right')} 
              className={`p-1.5 rounded transition-colors ${textAlign === 'right' ? 'bg-white/20 text-white' : 'hover:bg-white/10 hover:text-white'}`} 
              title="Direita"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={() => handleAlignChange('justify')} 
              className={`p-1.5 rounded transition-colors ${textAlign === 'justify' ? 'bg-white/20 text-white' : 'hover:bg-white/10 hover:text-white'}`} 
              title="Justificado"
            >
              <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-white/10 mx-1" />

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <Type className="w-3.5 h-3.5 text-white/40 ml-1" />
              {(['normal', 'modern', 'serif', 'mono', 'elegant'] as TextStyleType[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTextStyle(style)}
                  className={`px-2 py-0.5 text-xs rounded capitalize transition-colors ${textStyle === style ? 'bg-white/20 text-white font-bold' : 'text-white/40 hover:text-white'}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Área Principal de Texto */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            data-placeholder="Escreva o conteúdo do post..."
            className={`w-full bg-transparent border-none text-[15px] leading-relaxed text-white focus:outline-none min-h-[90px] empty:before:content-[attr(data-placeholder)] empty:before:text-white/40 mb-2 cursor-text ${getEditorStyles()}`}
          />

          {/* Visualização de Anexos e Thumbnail (Imagem, Vídeo e Áudio) */}
          {attachment && (
            <div className="mb-4 relative rounded-xl overflow-hidden border border-white/10 bg-[#121214] p-3">
              {/* Imagem */}
              {attachment.djangoMediaType === 'image' && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image src={attachment.previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}

              {/* Vídeo */}
              {attachment.djangoMediaType === 'video' && (
                <div className="space-y-3">
                  <video src={attachment.previewUrl} controls className="w-full max-h-64 rounded-lg object-cover" />
                </div>
              )}

              {/* Áudio */}
              {attachment.djangoMediaType === 'audio' && (
                <div className="p-4 bg-white/5 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    {attachment.thumbnailPreviewUrl ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                        <Image src={attachment.thumbnailPreviewUrl} alt="Capa do Áudio" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6 text-green-400" />
                      </div>
                    )}
                    <audio src={attachment.previewUrl} controls className="w-full" />
                  </div>
                </div>
              )}

              {/* Campo unificado de seleção de Thumbnail para Vídeos e Áudios */}
              {(attachment.djangoMediaType === 'video' || attachment.djangoMediaType === 'audio') && (
                <div className="flex items-center gap-3 pt-3 border-t border-white/10 mt-3">
                  <label 
                    htmlFor="post-thumb-upload" 
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    {attachment.thumbnailFile ? 'Alterar Capa (Thumbnail)' : 'Adicionar Capa (Thumbnail)'}
                  </label>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                    id="post-thumb-upload"
                  />
                  {attachment.thumbnailPreviewUrl && (
                    <span className="text-xs text-green-400 font-medium">Capa selecionada ✓</span>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleRemoveAttachment}
                className="absolute top-4 right-4 p-1.5 bg-black/80 hover:bg-black text-white rounded-full transition-colors z-20 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Seletores de Ficheiros */}
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
            <div className="flex items-center gap-1">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'image')}
                className="hidden"
                id="post-image-upload"
              />

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileSelect(e, 'video')}
                className="hidden"
                id="post-video-upload"
              />

              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileSelect(e, 'audio')}
                className="hidden"
                id="post-audio-upload"
              />

              <label
                htmlFor="post-image-upload"
                className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-white/60 hover:text-white"
                title="Adicionar Imagem"
              >
                <ImageIcon className="w-5 h-5" />
              </label>

              <label
                htmlFor="post-video-upload"
                className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-white/60 hover:text-white"
                title="Adicionar Vídeo"
              >
                <Video className="w-5 h-5" />
              </label>

              <label
                htmlFor="post-audio-upload"
                className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-white/60 hover:text-white"
                title="Adicionar Áudio"
              >
                <Music className="w-5 h-5" />
              </label>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (title.trim().length === 0 && content.trim().length === 0 && !attachment)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                (title.trim().length > 0 || content.trim().length > 0 || attachment) && !isSubmitting
                  ? 'bg-white text-black hover:bg-white/90 active:scale-95'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
