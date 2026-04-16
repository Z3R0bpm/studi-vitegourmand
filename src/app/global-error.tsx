"use client"
import { Geist, Geist_Mono } from "next/font/google"
import styles from "./styles/unexpected.module.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function GlobalError() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${styles.page}`}>
      <h1 className={styles.notFound}>ERREUR</h1>
      <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
    </div>
  )
}
