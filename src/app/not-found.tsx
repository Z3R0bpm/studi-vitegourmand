"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "./styles/unexpected.module.css"

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown === 0) {
        router.replace("/") // or router.push('/') for history push
      } else {
        setCountdown((prev) => prev - 1)
        console.log(countdown)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [router, countdown])
  return (
    <div className={styles.page}>
      <h1 className={styles.notFound}>404</h1>
      <p>
        On dirait que vous vous êtes perdu? Laissez moi vous ramener à notre
        page d'acceuil.
      </p>
      <p>Vous serez redirigé dans {countdown} secondes.</p>
      <p>
        Ou cliquez <a href="/">ici</a>
      </p>
    </div>
  )
}
