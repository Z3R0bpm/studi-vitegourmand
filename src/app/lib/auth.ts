//hashPassword, createSessions, etc
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import "server-only"
import { prisma } from "./prisma"
import { deleteSession, getSession } from "./session"

async function getUserByEmail(email: string) {
  const user = await prisma.users.findUnique({
    where: { email },
  })
  return user
}

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

async function login(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null
  }
  return user
}

async function signup(
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  phone?: string,
  address?: string,
  city?: string,
  country?: string,
) {
  if (await getUserByEmail(email))
    return { error: "Utilisateur déjà enregistré" }
  const hashedPassword = await hashPassword(password)
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      address,
      city,
      country,
      role_id: 0,
    },
  })
  return user
}

async function logout() {
  await deleteSession()
  redirect("/")
}

async function requireAuth() {
  const session = await getSession()
  if (!session?.userId) redirect("/login")
  const user = await prisma.users.findUnique({
    where: { id: session.userId },
  })
  if (!user) redirect("/login")
  return user
}

export { login, logout, requireAuth, signup }
