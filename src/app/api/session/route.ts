import { getSession } from "@/app/lib/session"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()
  return NextResponse.json(
    { userId: session?.userId || null },
    { headers: { "Cache-Control": "no-store" } },
  )
}
