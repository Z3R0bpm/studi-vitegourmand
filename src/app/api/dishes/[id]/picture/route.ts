import { detectPictureMime } from "@/app/lib/dishPicture"
import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const dishId = Number(id)
  if (!dishId) {
    return new NextResponse(null, { status: 400 })
  }

  const dish = await prisma.dishes.findUnique({
    where: { id: dishId },
    select: { picture: true },
  })

  if (!dish?.picture || dish.picture.length === 0) {
    return new NextResponse(null, { status: 404 })
  }

  const buffer = Buffer.from(dish.picture)
  const contentType = detectPictureMime(buffer)

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
