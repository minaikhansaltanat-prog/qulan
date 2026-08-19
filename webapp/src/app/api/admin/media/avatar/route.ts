import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { putObject, mediaProxyUrl } from "@/lib/s3";

const MAX_BYTES = 10 * 1024 * 1024;

// Client-photo uploads for reviews. Unlike /api/admin/media/photos, this
// doesn't create a GalleryItem — the resulting key is stored directly on
// the Review record instead of cluttering the general media library.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "reviews")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Тек сурет файлдары қабылданады" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл өлшемі 10 МБ-тан аспауы керек" }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  let webpBuffer: Buffer;
  try {
    webpBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 400, height: 400, fit: "cover" })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: "Сурет файлы бүлінген" }, { status: 400 });
  }

  const key = `avatars/${randomUUID()}.webp`;
  await putObject(key, webpBuffer, "image/webp");

  return NextResponse.json({ key, url: mediaProxyUrl(key) }, { status: 201 });
}
