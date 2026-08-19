"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

async function requireToursAccess() {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "tours")) {
    throw new Error("Тек авторизацияланған пайдаланушыға рұқсат етілген.");
  }
  return session;
}

const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
});

const tourSchema = z.object({
  title: z.string().min(2, "Атауы кемінде 2 таңба болуы керек"),
  slogan: z.string().optional(),
  destinations: z.array(z.enum(["ZHANGJIAJIE", "CHONGQING", "XIAN", "SHANGHAI", "GUANGZHOU", "HONGKONG", "CHENGDU"])).min(1, "Кемінде бір бағыт таңдаңыз"),
  durationDays: z.number().int().positive("Ұзақтығы 0-ден көп болуы керек"),
  audience: z.enum(["GROUP", "PRIVATE", "BOTH"]),
  priceTenge: z.number().int().nonnegative().nullable(),
  includes: z.array(z.string().min(1)),
  excludes: z.array(z.string().min(1)),
  itinerary: z.array(itineraryDaySchema),
  difficulty: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  slug: z.string().min(1, "Слаг міндетті"),
});

function parseTourFormData(formData: FormData) {
  const jsonField = (name: string) => {
    const raw = formData.get(name);
    try {
      return raw ? JSON.parse(String(raw)) : [];
    } catch {
      return [];
    }
  };

  const priceRaw = formData.get("priceTenge");

  return {
    title: String(formData.get("title") ?? ""),
    slogan: String(formData.get("slogan") ?? "") || undefined,
    destinations: jsonField("destinations"),
    durationDays: Number(formData.get("durationDays")),
    audience: String(formData.get("audience") ?? "GROUP"),
    priceTenge: priceRaw && String(priceRaw).length > 0 ? Number(priceRaw) : null,
    includes: jsonField("includes"),
    excludes: jsonField("excludes"),
    itinerary: jsonField("itinerary"),
    difficulty: String(formData.get("difficulty") ?? "") || undefined,
    status: String(formData.get("status") ?? "DRAFT"),
    seoTitle: String(formData.get("seoTitle") ?? "") || undefined,
    seoDescription: String(formData.get("seoDescription") ?? "") || undefined,
    slug: String(formData.get("slug") ?? "") || slugify(String(formData.get("title") ?? "")),
  };
}

export async function createTour(_prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireToursAccess();

  const parsed = tourSchema.safeParse(parseTourFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  const existing = await prisma.tour.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "Бұл слаг бос емес, басқасын таңдаңыз" };
  }

  const maxOrder = await prisma.tour.aggregate({ _max: { displayOrder: true } });

  const tour = await prisma.tour.create({
    data: {
      ...parsed.data,
      displayOrder: (maxOrder._max.displayOrder ?? 0) + 1,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "tour.create",
      entityType: "Tour",
      entityId: tour.id,
      metadata: { title: tour.title },
    },
  });

  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}

export async function updateTour(tourId: string, _prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireToursAccess();

  const parsed = tourSchema.safeParse(parseTourFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  const existing = await prisma.tour.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== tourId) {
    return { error: "Бұл слаг бос емес, басқасын таңдаңыз" };
  }

  await prisma.tour.update({ where: { id: tourId }, data: parsed.data });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "tour.update",
      entityType: "Tour",
      entityId: tourId,
      metadata: { title: parsed.data.title },
    },
  });

  revalidatePath("/admin/tours");
  redirect("/admin/tours");
}

export async function deleteTour(tourId: string) {
  const session = await requireToursAccess();

  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) return;

  await prisma.tour.delete({ where: { id: tourId } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "tour.delete",
      entityType: "Tour",
      entityId: tourId,
      metadata: { title: tour.title },
    },
  });

  revalidatePath("/admin/tours");
}

export async function moveTour(tourId: string, direction: "up" | "down") {
  await requireToursAccess();

  const tours = await prisma.tour.findMany({ orderBy: { displayOrder: "asc" } });
  const index = tours.findIndex((t) => t.id === tourId);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= tours.length) return;

  const a = tours[index];
  const b = tours[swapWith];

  await prisma.$transaction([
    prisma.tour.update({ where: { id: a.id }, data: { displayOrder: b.displayOrder } }),
    prisma.tour.update({ where: { id: b.id }, data: { displayOrder: a.displayOrder } }),
  ]);

  revalidatePath("/admin/tours");
}
