"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireOwner() {
  const session = await auth();
  if (!session?.user || session.user.role !== "OWNER") {
    throw new Error("Тек Owner рөліндегі пайдаланушыға рұқсат етілген.");
  }
  return session;
}

const createAdminSchema = z.object({
  name: z.string().min(2, "Аты кемінде 2 таңба болуы керек"),
  email: z.string().email("Email дұрыс емес"),
  password: z.string().min(8, "Құпия сөз кемінде 8 таңба болуы керек"),
});

export async function createAdminUser(_prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireOwner();

  const parsed = createAdminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Деректер дұрыс емес" };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Бұл email-мен пайдаланушы бар болып тұр" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const created = await prisma.user.create({
    data: { name: parsed.data.name, email, passwordHash, role: "ADMIN" },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "user.create",
      entityType: "User",
      entityId: created.id,
      metadata: { email: created.email },
    },
  });

  revalidatePath("/admin/users");
  return { error: undefined };
}

export async function toggleUserStatus(userId: string) {
  const session = await requireOwner();

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || target.role === "OWNER") return;

  const nextStatus = target.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
  await prisma.user.update({ where: { id: userId }, data: { status: nextStatus } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: nextStatus === "BLOCKED" ? "user.block" : "user.unblock",
      entityType: "User",
      entityId: userId,
    },
  });

  revalidatePath("/admin/users");
}

export async function deleteAdminUser(userId: string) {
  const session = await requireOwner();

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || target.role === "OWNER") return;

  await prisma.user.delete({ where: { id: userId } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "user.delete",
      entityType: "User",
      entityId: userId,
      metadata: { email: target.email },
    },
  });

  revalidatePath("/admin/users");
}
