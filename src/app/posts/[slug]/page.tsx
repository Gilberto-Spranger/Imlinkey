// app/posts/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';
import PostClient from './PostClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Endpoint base da API (Ajuste para a sua URL da API em produção/dev)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://imlinkey.store/api';

// Função auxiliar para buscar dados do post no servidor
async function fetchPostServerSide(slugOrId: string) {
  try {
    // 1. Tenta buscar por ID
    let res = await fetch(`${API_BASE_URL}/posts/${slugOrId}/`, {
      next: { revalidate: 60 }, // Cache revalidado a cada 60s
    });

    if (res.ok) {
      return await res.json();
    }

    // 2. Fallback por slug
    res = await fetch(`${API_BASE_URL}/posts/?slug=${encodeURIComponent(slugOrId)}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      const results = data?.results || data || [];
      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
    }
  } catch (error) {
    console.error('Erro ao buscar metadados no servidor:', error);
  }
  return null;
}

// Limpa tags HTML do texto do post para a meta description
function stripHtml(html: string) {
  return html ? html.replace(/<[^>]*>?/gm, '') : '';
}

// 1. GERADOR DE METADADOS DINÂMICOS (Executa no servidor)
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slugOrId = resolvedParams.slug;

  const post = await fetchPostServerSide(slugOrId);

  // Fallbacks caso o post não seja encontrado ou não tenha mídia
  const defaultTitle = "Publicação | Imlinkey";
  const defaultDesc = "Confira esta publicação na plataforma Imlinkey.";
  const defaultImage = "https://imlinkey.store/og-image.png";

  if (!post) {
    return {
      title: defaultTitle,
      description: defaultDesc,
    };
  }

  // Identificação do autor e conteúdo
  const authorName = post.user_details?.full_name || post.user_details?.username || post.author?.name || 'Imlinkey';
  const cleanContent = stripHtml(post.content || '');
  const description = cleanContent.length > 0 ? cleanContent.substring(0, 160) : defaultDesc;
  const title = post.title ? `${post.title} por ${authorName}` : `Publicação de ${authorName}`;

  // Extração inteligente da imagem da publicação
  let postImageUrl = defaultImage;

  const rawMedia = Array.isArray(post.media) ? post.media[0] : post.media;
  if (rawMedia) {
    // Se for imagem usa a URL da imagem
    if (rawMedia.url || rawMedia.file) {
      postImageUrl = rawMedia.url || rawMedia.file;
    }
    // Se for vídeo usa a thumbnail do vídeo
    if (rawMedia.thumbnail) {
      postImageUrl = rawMedia.thumbnail;
    }
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://imlinkey.store/posts/${slugOrId}`,
      siteName: "Imlinkey",
      type: "article",
      images: [
        {
          url: postImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [postImageUrl],
    },
  };
}

// 2. COMPONENTE DA PÁGINA (Server Component)
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <PostClient slugOrId={resolvedParams.slug} />;
}
