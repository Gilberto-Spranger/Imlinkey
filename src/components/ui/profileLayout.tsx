import { ReactNode } from "react";

export function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-10 bg-background flex flex-col items-center text-foreground transition-colors duration-300">
      {children}
    </main>
  );
}