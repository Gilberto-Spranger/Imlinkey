// src/components/ui/infoItem.tsx
interface InfoItemProps {
  label: string;
  value?: string | number | null;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex py-1.5 border-b border-white/10">
      <span className="font-medium text-gray-300">{label}:</span>
      <span className="ml-2 text-white break-words">
        {value != null ? value : "-"}
      </span>
    </div>
  );
}