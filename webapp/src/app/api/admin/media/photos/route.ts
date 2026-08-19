import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { putObject, mediaProxyUrl } from "@/lib/s3";

const MAX_PHOTO_BYTES = 20 * 1024 * 1024; // 20 MB, per spec section 5

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "gallery")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const altText = form.get("altText");
  const tourId = form.get("tourId");

  if (!(file instanceof File) || typeof altText !== "string" || altText.trim().length === 0) {
    return NextResponse.json({ error: "file және altText міндетті" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Тек сурет файлдары қабылданады" }, { status: 400 });
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return NextResponse.json({ error: "Файл өлшемі 20 МБ-тан аспауы керек" }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let webpBuffer: Buffer;
  try {
    webpBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: "Сурет файлы бүлінген немесе қолдау көрсетілмейді" }, { status: 400 });
  }

  const key = `gallery/${randomUUID()}.webp`;
  await putObject(key, webpBuffer, "image/webp");

  const item = await prisma.galleryItem.create({
    data: {
      type: "PHOTO",
      source: "UPLOAD",
      key,
      altText: altText.trim(),
      tourId: typeof tourId === "string" && tourId.length > 0 ? tourId : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "gallery.photo.upload",
      entityType: "GalleryItem",
      entityId: item.id,
      metadata: { key, sizeBytes: webpBuffer.length },
    },
  });

  return NextResponse.json({ ...item, url: mediaProxyUrl(key) }, { status: 201 });
}
