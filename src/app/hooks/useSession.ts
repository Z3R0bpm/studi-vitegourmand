import { useEffect, useState } from "react"

export const useSession = () => {
  const [session, setSession] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => {
        setSession(data.userId)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  return { session, loading }
}
