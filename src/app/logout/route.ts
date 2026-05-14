import { deleteSession } from "@/app/lib/session"
import { redirect } from "next/navigation"
import "server-only"

export async function GET() {
  await deleteSession()
  redirect("/")
}
