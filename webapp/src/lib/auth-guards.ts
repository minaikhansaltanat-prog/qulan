import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessModule, type AdminModule } from "@/lib/rbac";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session;
}

export async function requireModuleAccess(module: AdminModule) {
  const session = await requireSession();
  if (!canAccessModule(session.user.role, module)) {
    redirect(`/admin?denied=${module}`);
  }
  return session;
}
