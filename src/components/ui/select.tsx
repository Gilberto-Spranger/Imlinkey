"use client";

import { useState, useRef, useEffect, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, event?: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  label?: string;
  error?: string;
  custom?: boolean;
  className?: string;
}

export function Select({ 
  value, 
  onChange, 
  options, 
  label, 
  error, 
  custom = true,
  className = '',
  ...props 
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!custom) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [custom]);

  // =================== NATIVE SELECT ===================
  if (!custom) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            {label}
          </label>
        )}
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value, e)}
          className={`
            w-full bg-background border border-border rounded-xl p-4
            text-foreground outline-none focus:ring-2 focus:ring-primary/20
            appearance-none ${error ? "border-red-500" : ""} ${className}
          `}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }

  // =================== CUSTOM SELECT ===================
  const selectedLabel = options.find(opt => opt.value === value)?.label || "Selecione...";

  return (
    <div className="space-y-2 relative">
      {label && (
        <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}

      <div ref={ref} className={`w-full relative ${className}`}>
        <button
          type="button"
          className={`
            flex w-full items-center justify-between px-4 py-3 rounded-xl border
            text-foreground bg-card cursor-pointer transition-all
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${error ? "border-red-500" : "border-border"}
          `}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className={value ? "text-foreground" : "text-slate-500 dark:text-slate-400"}>
            {selectedLabel}
          </span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-xl max-h-60 overflow-auto z-50 shadow-lg">
            {options.map(opt => (
              <li
                key={opt.value}
                className={`
                  px-4 py-3 cursor-pointer text-foreground hover:bg-primary/10 transition-colors
                  ${opt.value === value ? "bg-primary/20 font-semibold" : ""}
                `}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

export default Select;