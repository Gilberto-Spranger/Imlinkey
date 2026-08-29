import { Link } from '@/types';
import { Card } from '@/components/ui';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { apiClient } from '@/utils';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

export const LinkCard = ({ link, onEdit, onDelete }: LinkCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  const handleClick = async () => {
    try {
      await apiClient.incrementClick(link.id); // chama o backend
    } catch (err) {
      console.error('Failed to increment click:', err);
    }
    window.open(link.link_url, '_blank', 'noopener,noreferrer');
  };

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation(); // não abre o link ao clicar nos 3 pontos
    setShowActions((prev) => !prev);
  };

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="hover:border-gray-600 transition-all duration-200 relative">
        <div className="flex items-center space-x-4">
          <Image
            src={link.icon || '/default-image.png'}
            alt={link.title}
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/default-image.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{link.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                {link.platform}
              </span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {link.category}
              </span>
              <span className="text-xs text-gray-500">{link.click_count} clicks</span>
            </div>
          </div>

          {/* Ícone de 3 pontos */}
          <div className="ml-4 relative" ref={actionsRef}>
            <button
              onClick={toggleActions}
              className="text-gray-400 hover:text-white p-1"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-6 flex flex-col bg-gray-800 border border-gray-600 rounded shadow-lg z-10">
                <button
                  className="flex items-center justify-center px-3 py-2 hover:bg-gray-700 text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(link);
                    setShowActions(false);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  className="flex items-center justify-center px-3 py-2 hover:bg-gray-700 text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(link.id);
                    setShowActions(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};