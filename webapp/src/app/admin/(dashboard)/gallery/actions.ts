"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getPresignedUploadUrl, deleteObject } from "@/lib/s3";

const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB, per spec section 5

async function requireGalleryAccess() {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "gallery")) {
    throw new Error("Тек авторизацияланған пайдаланушыға рұқсат етілген.");
  }
  return session;
}

const requestUploadSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().startsWith("video/"),
  fileSize: z.number().positive().max(MAX_VIDEO_BYTES),
});

export async function requestVideoUploadUrl(input: {
  fileName: string;
  contentType: string;
  fileSize: number;
}) {
  await requireGalleryAccess();
  const parsed = requestUploadSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Видео 200 МБ-тан аспауы керек және video/* форматында болуы керек." };
  }

  const ext = parsed.data.fileName.split(".").pop()?.toLowerCase() || "mp4";
  const key = `gallery/${randomUUID()}.${ext}`;
  const uploadUrl = await getPresignedUploadUrl(key, parsed.data.contentType);
  return { key, uploadUrl };
}

const confirmSchema = z.object({
  key: z.string().min(1),
  altText: z.string().min(1, "Alt-мәтін міндетті"),
  tourId: z.string().nullable().optional(),
});

export async function confirmVideoUpload(input: { key: string; altText: string; tourId?: string | null }) {
  const session = await requireGalleryAccess();
  const parsed = confirmSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  const item = await prisma.galleryItem.create({
    data: {
      type: "VIDEO",
      source: "UPLOAD",
      key: parsed.data.key,
      altText: parsed.data.altText,
      tourId: parsed.data.tourId || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "gallery.video.upload",
      entityType: "GalleryItem",
      entityId: item.id,
      metadata: { key: parsed.data.key },
    },
  });

  revalidatePath("/admin/gallery");
  return { error: undefined, item };
}

const externalVideoSchema = z.object({
  url: z.string().url("Сілтеме дұрыс емес"),
  altText: z.string().min(1, "Alt-мәтін міндетті"),
  tourId: z.string().nullable().optional(),
});

export async function addExternalVideo(_prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireGalleryAccess();
  const parsed = externalVideoSchema.safeParse({
    url: formData.get("url"),
    altText: formData.get("altText"),
    tourId: formData.get("tourId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  const host = new URL(parsed.data.url).hostname;
  const allowed = ["youtube.com", "youtu.be", "instagram.com", "vimeo.com"];
  if (!allowed.some((h) => host === h || host.endsWith(`.${h}`))) {
    return { error: "Тек YouTube, Vimeo немесе Instagram сілтемелері қабылданады" };
  }

  const item = await prisma.galleryItem.create({
    data: {
      type: "VIDEO",
      source: "EXTERNAL",
      externalUrl: parsed.data.url,
      altText: parsed.data.altText,
      tourId: parsed.data.tourId || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "gallery.video.link",
      entityType: "GalleryItem",
      entityId: item.id,
      metadata: { url: parsed.data.url },
    },
  });

  revalidatePath("/admin/gallery");
  return { error: undefined };
}

export async function assignGalleryItemTour(itemId: string, tourId: string) {
  const session = await requireGalleryAccess();

  await prisma.galleryItem.update({
    where: { id: itemId },
    data: { tourId: tourId || null },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "gallery.assign-tour",
      entityType: "GalleryItem",
      entityId: itemId,
      metadata: { tourId: tourId || null },
    },
  });

  revalidatePath("/admin/gallery");
}

export async function deleteGalleryItem(id: string) {
  const session = await requireGalleryAccess();

  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return;

  if (item.source === "UPLOAD" && item.key) {
    await deleteObject(item.key);
  }
  await prisma.galleryItem.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "gallery.delete",
      entityType: "GalleryItem",
      entityId: id,
    },
  });

  revalidatePath("/admin/gallery");
}
