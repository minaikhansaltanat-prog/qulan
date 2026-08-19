"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { getPresignedUploadUrl, deleteObject } from "@/lib/s3";

const MAX_MEDIA_BYTES = 200 * 1024 * 1024;

async function requireReviewsAccess() {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "reviews")) {
    throw new Error("Тек авторизацияланған пайдаланушыға рұқсат етілген.");
  }
  return session;
}

export async function requestReviewMediaUploadUrl(input: {
  fileName: string;
  contentType: string;
  fileSize: number;
}) {
  await requireReviewsAccess();
  const isVideoOrAudio = input.contentType.startsWith("video/") || input.contentType.startsWith("audio/");
  if (!isVideoOrAudio || input.fileSize > MAX_MEDIA_BYTES || input.fileSize <= 0) {
    return { error: "Файл видео/аудио форматында және 200 МБ-тан аз болуы керек." };
  }

  const ext = input.fileName.split(".").pop()?.toLowerCase() || "bin";
  const key = `reviews/${randomUUID()}.${ext}`;
  const uploadUrl = await getPresignedUploadUrl(key, input.contentType);
  return { key, uploadUrl };
}

const reviewSchema = z.object({
  clientName: z.string().min(2, "Клиент аты міндетті"),
  clientPhotoKey: z.string().nullable(),
  type: z.enum(["VIDEO", "TEXT", "AUDIO"]),
  textContent: z.string().nullable(),
  mediaKey: z.string().nullable(),
  rating: z.number().int().min(1).max(5),
  tourId: z.string().nullable(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

function parseReviewFormData(formData: FormData) {
  return {
    clientName: String(formData.get("clientName") ?? ""),
    clientPhotoKey: (formData.get("clientPhotoKey") as string) || null,
    type: String(formData.get("type") ?? "TEXT"),
    textContent: (formData.get("textContent") as string) || null,
    mediaKey: (formData.get("mediaKey") as string) || null,
    rating: Number(formData.get("rating")) || 5,
    tourId: (formData.get("tourId") as string) || null,
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };
}

export async function createReview(_prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireReviewsAccess();

  const parsed = reviewSchema.safeParse(parseReviewFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }
  if (parsed.data.type === "TEXT" && !parsed.data.textContent) {
    return { error: "Жазбаша пікір үшін мәтін міндетті" };
  }
  if ((parsed.data.type === "VIDEO" || parsed.data.type === "AUDIO") && !parsed.data.mediaKey) {
    return { error: "Видео/аудио файл жүктелмеген" };
  }

  const review = await prisma.review.create({ data: parsed.data });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "review.create",
      entityType: "Review",
      entityId: review.id,
      metadata: { clientName: review.clientName },
    },
  });

  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function updateReview(reviewId: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireReviewsAccess();

  const parsed = reviewSchema.safeParse(parseReviewFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  await prisma.review.update({ where: { id: reviewId }, data: parsed.data });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "review.update",
      entityType: "Review",
      entityId: reviewId,
    },
  });

  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(reviewId: string) {
  const session = await requireReviewsAccess();

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return;

  if (review.mediaKey) await deleteObject(review.mediaKey);
  if (review.clientPhotoKey) await deleteObject(review.clientPhotoKey);
  await prisma.review.delete({ where: { id: reviewId } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "review.delete",
      entityType: "Review",
      entityId: reviewId,
      metadata: { clientName: review.clientName },
    },
  });

  revalidatePath("/admin/reviews");
}

export async function togglePublish(reviewId: string) {
  const session = await requireReviewsAccess();
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return;

  await prisma.review.update({ where: { id: reviewId }, data: { isPublished: !review.isPublished } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: review.isPublished ? "review.unpublish" : "review.publish",
      entityType: "Review",
      entityId: reviewId,
    },
  });

  revalidatePath("/admin/reviews");
}

export async function toggleFeatured(reviewId: string) {
  const session = await requireReviewsAccess();
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return;

  await prisma.review.update({ where: { id: reviewId }, data: { isFeatured: !review.isFeatured } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "review.toggle-featured",
      entityType: "Review",
      entityId: reviewId,
    },
  });

  revalidatePath("/admin/reviews");
}
