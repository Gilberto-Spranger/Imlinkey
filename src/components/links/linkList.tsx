// LinkList.tsx
import { Link } from '@/types';
import { LinkCard } from './linkCard';

interface LinkListProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

export const LinkList = ({ links, onEdit, onDelete }: LinkListProps) => {
  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No links found</p>
        <p className="text-gray-500 text-sm">Create your first link to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map(link => (
        <LinkCard
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};