import type { Role } from "@/generated/prisma/enums";

export type AdminModule =
  | "dashboard"
  | "tours"
  | "gallery"
  | "reviews"
  | "homepage"
  | "calendar"
  | "blog"
  | "leads"
  | "analytics"
  | "users"
  | "auditLog"
  | "settings";

// Section 2 of the tech spec: rights matrix. Owner has every module; Admin
// has everything except account/infra administration (users, settings) and
// full audit-log visibility (Admin only sees their own actions).
const OWNER_ONLY_MODULES: ReadonlySet<AdminModule> = new Set([
  "users",
  "settings",
]);

export function canAccessModule(role: Role, module: AdminModule): boolean {
  if (role === "OWNER") return true;
  return !OWNER_ONLY_MODULES.has(module);
}

// Leads and analytics are visible to Admin but read-scoped per the spec
// ("тек көру+өңдеу" / "тек көру"). Full CRUD is Owner-only.
export function canWriteModule(role: Role, module: AdminModule): boolean {
  if (role === "OWNER") return true;
  if (module === "analytics") return false;
  return canAccessModule(role, module);
}

export const ADMIN_NAV: { module: AdminModule; href: string; labelKk: string }[] = [
  { module: "dashboard", href: "/admin", labelKk: "Дашборд" },
  { module: "tours", href: "/admin/tours", labelKk: "Турлар" },
  { module: "gallery", href: "/admin/gallery", labelKk: "Галерея" },
  { module: "reviews", href: "/admin/reviews", labelKk: "Пікірлер" },
  { module: "homepage", href: "/admin/homepage", labelKk: "Басты бет" },
  { module: "calendar", href: "/admin/calendar", labelKk: "Топтық турлар күнтізбесі" },
  { module: "blog", href: "/admin/blog", labelKk: "Блог" },
  { module: "leads", href: "/admin/leads", labelKk: "Өтінімдер" },
  { module: "analytics", href: "/admin/analytics", labelKk: "Аналитика" },
  { module: "auditLog", href: "/admin/audit-log", labelKk: "Әрекеттер журналы" },
  { module: "users", href: "/admin/users", labelKk: "Пайдаланушылар мен рөлдер" },
  { module: "settings", href: "/admin/settings", labelKk: "Баптаулар" },
];
