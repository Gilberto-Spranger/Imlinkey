// ✅ src/components/section.tsx
export function Section({
  title,
  children,
  fullWidth,
}: {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`bg-white/5 rounded-3xl border border-white/10 p-6 backdrop-blur-md ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="font-bold text-xl mb-5 text-white border-b border-white/5 pb-3">{title}</h3>
      {children}
    </div>
  );
}