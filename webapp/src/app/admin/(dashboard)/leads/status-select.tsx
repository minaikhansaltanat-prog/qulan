"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "./actions";
import { LEAD_STATUS_LABELS } from "@/lib/lead-labels";
import type { LeadStatus } from "@/generated/prisma/enums";

export function StatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateLeadStatus(leadId, e.target.value as LeadStatus))}
      className="h-9 rounded-lg border border-line bg-white px-2.5 text-[13px] outline-none
                 focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
    >
      {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
        <option key={s} value={s}>
          {LEAD_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
