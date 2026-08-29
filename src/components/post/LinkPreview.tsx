import Image from 'next/image';

export function LinkPreview({ url }: { url: string }) {
  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = url;
  }

  // Generate a random-looking image based on the URL string
  const imageSeed = encodeURIComponent(hostname || 'link');

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 block border border-im-border/50 rounded-xl overflow-hidden hover:border-im-accent/50 transition-colors bg-im-surface/30 group">
      <div className="w-full h-48 bg-im-surface relative overflow-hidden">
        <Image 
          src={`https://picsum.photos/seed/${imageSeed}/800/400`} 
          alt="Link preview" 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4">
        <h4 className="font-bold text-sm text-gray-200 line-clamp-1">{hostname}</h4>
        <p className="text-xs text-gray-400 line-clamp-2 mt-1">Preview of the shared content from {hostname}. Click to read more about this topic.</p>
      </div>
    </a>
  );
}