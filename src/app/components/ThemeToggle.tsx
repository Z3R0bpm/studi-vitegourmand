"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  //updateTheme() { better animations on theme switch
  // theme animation
  // setTheme(theme === 'dark' ? 'light' : 'dark')
  // }

  return (
    <button
      className="themeToggle"
      id="theme-toggle"
      aria-label="Toggle light/dark mode"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {isDark ? "☀️" : "🌙"}
    </button>
  )
}
