import { Section } from "./section";
import { ReactNode } from "react";

export function ProfileFormSection({
  title,
  children,
  fullWidth,
}: {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <Section title={title} fullWidth={fullWidth}>
      {/* z-50 e overflow-visible garantem que os dropdowns não sejam cortados.
          A cor do texto do título e do conteúdo agora segue o tema global.
      */}
      <div className="space-y-4 relative overflow-visible z-50 text-foreground">
        {children}
      </div>
    </Section>
  );
}