import jwt, { Secret } from "jsonwebtoken"
import { cookies } from "next/headers"
import "server-only"

const secret: Secret = process.env.SESSION_SECRET!

async function createSession(userId: number) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  const session = jwt.sign({ userId }, secret, { expiresIn: "7d" })
  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires,
  })
}

async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) {
    return null
  }
  try {
    const decoded = jwt.verify(session, secret) as { userId: number }
    return decoded
  } catch (error) {
    return null
  }
}

async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export { createSession, deleteSession, getSession }
