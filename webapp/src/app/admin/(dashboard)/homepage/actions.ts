"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SIMPLE_BLOCKS, WHY_SCHEMA, type SimpleBlockKey } from "@/lib/homepage-blocks";

async function requireHomepageAccess() {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "homepage")) {
    throw new Error("Тек авторизацияланған пайдаланушыға рұқсат етілген.");
  }
  return session;
}

async function logBlockSave(session: Awaited<ReturnType<typeof requireHomepageAccess>>, key: string) {
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "homepage.block.save",
      entityType: "HomepageBlock",
      entityId: key,
    },
  });
}

export async function saveSimpleBlock(
  key: SimpleBlockKey,
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const session = await requireHomepageAccess();
  const config = SIMPLE_BLOCKS[key];

  const raw: Record<string, string> = {};
  for (const field of Object.keys(config.schema.shape)) {
    raw[field] = String(formData.get(field) ?? "");
  }

  const parsed = config.schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  await prisma.homepageBlock.upsert({
    where: { key },
    create: { key, content: parsed.data },
    update: { content: parsed.data },
  });

  await logBlockSave(session, key);
  revalidatePath("/admin/homepage");
  return { success: true };
}

export async function saveWhyBlock(_prevState: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const session = await requireHomepageAccess();

  let cards: unknown;
  try {
    cards = JSON.parse(String(formData.get("cards") ?? "[]"));
  } catch {
    cards = [];
  }

  const parsed = WHY_SCHEMA.safeParse({
    kicker: String(formData.get("kicker") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    cards,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  await prisma.homepageBlock.upsert({
    where: { key: "why" },
    create: { key: "why", content: parsed.data },
    update: { content: parsed.data },
  });

  await logBlockSave(session, "why");
  revalidatePath("/admin/homepage");
  return { success: true };
}

const faqSchema = z.object({
  question: z.string().min(2, "Сұрақ міндетті"),
  answer: z.string().min(2, "Жауап міндетті"),
});

export async function createFaq(_prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireHomepageAccess();
  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  const maxOrder = await prisma.faqItem.aggregate({ _max: { displayOrder: true } });
  const faq = await prisma.faqItem.create({
    data: { ...parsed.data, displayOrder: (maxOrder._max.displayOrder ?? 0) + 1 },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "faq.create",
      entityType: "FaqItem",
      entityId: faq.id,
    },
  });

  revalidatePath("/admin/homepage");
  return { error: undefined };
}

export async function deleteFaq(id: string) {
  const session = await requireHomepageAccess();
  await prisma.faqItem.delete({ where: { id } }).catch(() => null);

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "faq.delete",
      entityType: "FaqItem",
      entityId: id,
    },
  });

  revalidatePath("/admin/homepage");
}

export async function toggleFaqPublish(id: string) {
  const session = await requireHomepageAccess();
  const faq = await prisma.faqItem.findUnique({ where: { id } });
  if (!faq) return;

  await prisma.faqItem.update({ where: { id }, data: { isPublished: !faq.isPublished } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: faq.isPublished ? "faq.unpublish" : "faq.publish",
      entityType: "FaqItem",
      entityId: id,
    },
  });

  revalidatePath("/admin/homepage");
}
