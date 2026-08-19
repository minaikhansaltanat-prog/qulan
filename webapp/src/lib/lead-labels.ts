import type { LeadStatus } from "@/generated/prisma/enums";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Жаңа",
  CONTACTED: "Байланысқа шықты",
  CONVERTED: "Келісімге келді",
  CLOSED: "Жабық",
};

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "bg-bred/10 text-bred-dark",
  CONTACTED: "bg-bgold/15 text-bgold",
  CONVERTED: "bg-bgreen/10 text-bgreen",
  CLOSED: "bg-muted/15 text-muted",
};
