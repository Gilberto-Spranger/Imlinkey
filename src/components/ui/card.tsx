import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

// Componente Card principal unificado
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`
      bg-gray-900 border border-gray-700 rounded-xl p-6 
      shadow-lg
      ${className}
    `}>
      {children}
    </div>
  );
}

// Componente CardContent mantido da primeira implementação
export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

// Versão alternativa do Card (caso queira manter ambas as assinaturas)
export const CardAlternative = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

// Exportação padrão para compatibilidade
export default Card;