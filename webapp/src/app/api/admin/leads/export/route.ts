import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccessModule } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { LEAD_STATUS_LABELS } from "@/lib/lead-labels";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = await auth();
  if (!session?.user || !canAccessModule(session.user.role, "leads")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const leads = await prisma.lead.findMany({
    include: { sourceTour: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = ["Аты", "Телефон", "Хабарлама", "Тур", "Мәртебе", "Күні"];
  const rows = leads.map((lead) =>
    [
      lead.name,
      lead.phone,
      lead.message ?? "",
      lead.sourceTour?.title ?? "",
      LEAD_STATUS_LABELS[lead.status],
      lead.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = "﻿" + [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
