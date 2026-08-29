import React from 'react';
import Image from 'next/image';

export function AdBanner({ className = '' }: { className?: string }) {
  const images = [
    'https://picsum.photos/seed/ad1/800/200',
    'https://picsum.photos/seed/ad2/800/200',
    'https://picsum.photos/seed/ad3/800/200',
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <div className={`w-full bg-im-surface/50 border border-im-border/50 rounded-xl overflow-hidden flex flex-col group cursor-pointer ${className}`}>
      <div className="flex items-center justify-between px-3 py-1 bg-im-surface border-b border-im-border/50">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sponsored</span>
        <span className="text-[10px] text-gray-500">Ad</span>
      </div>
      <div className="w-full h-32 relative overflow-hidden bg-im-bg">
        <Image src={randomImage} alt="Advertisement" fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
          <p className="text-sm font-bold text-white shadow-sm">Discover Premium Products</p>
        </div>
      </div>
    </div>
  );
}