import { prisma } from "@/app/lib/prisma"
import { getSession } from "@/app/lib/session"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json(
      { userId: null, roleId: null },
      { headers: { "Cache-Control": "no-store" } },
    )
  }

  const user = await prisma.users.findUnique({
    where: { id: session.userId },
    select: { role_id: true },
  })

  return NextResponse.json(
    {
      userId: session.userId,
      roleId: user?.role_id ?? null,
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
