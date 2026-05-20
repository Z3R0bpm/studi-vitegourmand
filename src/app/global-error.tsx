"use client"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import styles from "./styles/unexpected.module.css"

export default function GlobalError() {
  return (
    <div
      className={`${GeistSans.className} ${GeistMono.className} ${styles.page}`}>
      <h1 className={styles.notFound}>ERREUR</h1>
      <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
    </div>
  )
}
