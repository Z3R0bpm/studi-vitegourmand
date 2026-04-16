import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeHandler } from "./components/themeHandler"
import { ThemeToggle } from "./components/ThemeToggle"
import "./styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Vite & Gourmand",
  description: "Votre service de traiteurs aux petits oignons !",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem>
          {children}
          <ThemeToggle />
          <ThemeHandler />
        </ThemeProvider>
      </body>
    </html>
  )
}
