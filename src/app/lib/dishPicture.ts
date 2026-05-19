import "server-only"

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

export function detectPictureMime(buffer: Buffer): string {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return "image/jpeg"
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png"
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp"
  }
  return "application/octet-stream"
}

export async function parseDishPictureFromForm(
  formData: FormData,
): Promise<
  { ok: true; picture: Buffer | null | undefined } | { ok: false; error: string }
> {
  if (formData.get("removePicture") === "on") {
    return { ok: true, picture: null }
  }

  const file = formData.get("picture")
  if (!file || !(file instanceof File) || file.size === 0) {
    return { ok: true, picture: undefined }
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Format accepté : JPEG, PNG ou WebP",
    }
  }

  if (file.size > MAX_SIZE) {
    return {
      ok: false,
      error: "L'image ne doit pas dépasser 2 Mo",
    }
  }

  const arrayBuffer = await file.arrayBuffer()
  return { ok: true, picture: Buffer.from(arrayBuffer) }
}
