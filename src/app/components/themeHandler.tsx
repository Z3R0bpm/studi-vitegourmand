'use client'
import { useEffect, useState } from "react"

export function ThemeHandler() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    setMounted(true);
  }, []);

  return <>{mounted && null}</>;
}