import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { ThemeHandler } from "./components/themeHandler"
import { ThemeToggle } from "./components/ThemeToggle"
import { CartProvider } from "./context/CartContext"
import "./styles/globals.css"

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
      <body className={`${GeistSans.className} ${GeistMono.className}`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem>
          <CartProvider>{children}</CartProvider>
          <ThemeToggle />
          <ThemeHandler />
        </ThemeProvider>
      </body>
    </html>
  )
}
