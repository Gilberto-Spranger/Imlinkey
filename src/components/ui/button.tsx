import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "destructive"
    | "icon"
    | "dot"
    | "link"
    | "default"
    | "outline"
    | "ghost"
    | "glass";
  color?:
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "gray"
    | "black"
    | "white"
    | "purple"
    | "pink"
    | "indigo"
    | "teal"
    | "gold"
    | "sky";
  children?: ReactNode;
  online?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  size = "md",
  variant = "default",
  color = "blue",
  online = false,
  icon,
  isLoading = false,
  ...props
}: ButtonProps) {
  // Base refinada com feedback tátil (escala)
  const baseClasses =
    "relative inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none overflow-hidden select-none cursor-pointer";

  // Mapeamento de Cores Sólidas (UI Premium com sombras coloridas)
  const colorMap: Record<string, string> = {
    blue: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20",
    red: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20",
    green: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20",
    yellow: "bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20",
    gray: "bg-slate-700 hover:bg-slate-600 text-white shadow-slate-700/20",
    black: "bg-zinc-950 hover:bg-zinc-800 text-white border border-zinc-800",
    white: "bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 shadow-sm",
    purple: "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20",
    pink: "bg-pink-500 hover:bg-pink-400 text-white shadow-pink-500/20",
    indigo: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20",
    teal: "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/20",
    sky: "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20",
    gold: `bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-600 text-zinc-950 border-t border-yellow-200/50 shadow-[0_4px_15px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_25px_rgba(234,179,8,0.5)] hover:brightness-110`,
  };

  // Mapeamento para variantes Transparentes (Outline/Ghost)
  const textColors: Record<string, string> = {
    blue: "text-blue-500 border-blue-500/30 hover:bg-blue-500/10",
    red: "text-rose-500 border-rose-500/30 hover:bg-rose-500/10",
    green: "text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10",
    white: "text-white border-white/30 hover:bg-white/10",
    black: "text-zinc-900 border-zinc-900/30 hover:bg-zinc-900/5",
    sky: "text-sky-400 border-sky-400/30 hover:bg-sky-400/10",
    gray: "text-slate-400 border-slate-400/30 hover:bg-slate-400/10",
  };

  const variantClasses = {
    primary: `${colorMap[color]} shadow-lg`,
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    destructive: "bg-red-700 hover:bg-red-600 text-white",
    default: `${colorMap[color]}`,
    outline: `bg-transparent border-2 ${textColors[color] || textColors.blue}`,
    ghost: `bg-transparent ${textColors[color] || textColors.blue} border-transparent`,
    glass: `backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-xl`,
    icon: `p-2.5 rounded-full transition-transform hover:rotate-6 ${colorMap[color] || "bg-zinc-800 text-white"}`,
    dot: `w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.4)] ${online ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`,
    link: `w-full border border-zinc-800/50 rounded-2xl bg-zinc-900/40 backdrop-blur-sm text-white px-5 py-4 flex items-center gap-4 hover:border-sky-500/50 hover:bg-zinc-800/80 shadow-2xl group transition-all`,
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-2xl",
    xl: "px-10 py-5 text-lg rounded-[1.5rem] tracking-tight",
  };

  const getButtonClasses = () => {
    if (variant === "dot") return `${variantClasses.dot} ${className}`;
    const base = variant === "link" || variant === "icon" ? baseClasses : `${baseClasses} ${sizeClasses[size]}`;
    return `${base} ${variantClasses[variant]} ${className}`;
  };

  return (
    <button className={getButtonClasses()} disabled={isLoading} {...props}>
      {/* Spinner centralizado para Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-[inherit] z-10">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Conteúdo do Botão */}
      <div className={`flex items-center justify-center gap-2.5 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {variant === "link" && icon && (
          <span className="flex-shrink-0 w-6 h-6 text-sky-400 group-hover:scale-110 group-hover:text-sky-300 transition-all">
            {icon}
          </span>
        )}

        {variant !== "dot" && (
          <span className={variant === "link" ? "flex-1 text-left font-bold tracking-tight" : ""}>
            {children}
          </span>
        )}

        {variant === "link" && (
          <span className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
}