"use client";

import { useCallback, useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("theme-dark"));
  }, []);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("theme-dark");
    document.documentElement.classList.toggle("theme-dark");
    setDark(next);
    try {
      localStorage.setItem("stasho-preview-theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (e.g. private mode) — theme just won't persist.
    }
  }, []);

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-edge px-3 py-1.5 text-sm
                 hover:border-edge-hover transition-colors"
      style={{ transitionDuration: "var(--duration-fast)" }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
