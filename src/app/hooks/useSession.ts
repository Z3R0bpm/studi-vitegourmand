import { useEffect, useState } from "react"

export const useSession = () => {
  const [session, setSession] = useState<number | null>(null)
  const [roleId, setRoleId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => {
        setSession(data.userId)
        setRoleId(data.roleId ?? null)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  return { session, roleId, loading }
}
