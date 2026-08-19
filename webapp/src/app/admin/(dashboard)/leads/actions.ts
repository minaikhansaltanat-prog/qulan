"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@/generated/prisma/enums";

async function requireLeadsAccess() {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "leads")) {
    throw new Error("Тек авторизацияланған пайдаланушыға рұқсат етілген.");
  }
  return session;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const session = await requireLeadsAccess();

  await prisma.lead.update({ where: { id: leadId }, data: { status } });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      actorEmail: session.user.email ?? "",
      actorRole: session.user.role,
      action: "lead.status-update",
      entityType: "Lead",
      entityId: leadId,
      metadata: { status },
    },
  });

  revalidatePath("/admin/leads");
}
