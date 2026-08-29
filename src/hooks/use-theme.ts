"use client";

import { useEffect } from "react";

export type ThemePreference = "light" | "dark" | "system";

export function useTheme(theme: ThemePreference | null) {
  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    const applyTheme = (themeValue: "light" | "dark") => {
      if (themeValue === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);
}