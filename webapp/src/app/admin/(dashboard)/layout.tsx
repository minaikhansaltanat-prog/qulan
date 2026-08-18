import { requireSession } from "@/lib/auth-guards";
import { canAccessModule, ADMIN_NAV } from "@/lib/rbac";
import { AdminShell } from "./admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const nav = ADMIN_NAV.filter((item) => canAccessModule(session.user.role, item.module));

  return (
    <AdminShell nav={nav} user={session.user}>
      {children}
    </AdminShell>
  );
}
