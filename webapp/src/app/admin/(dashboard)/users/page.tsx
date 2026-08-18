import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { CreateAdminForm } from "./create-admin-form";
import { UserRowActions } from "./user-row-actions";

export default async function UsersPage() {
  await requireModuleAccess("users");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">
        Пайдаланушылар мен рөлдер
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-muted">
        Жаңа администратор қосу, бұғаттау және жою тек Owner рөліне қолжетімді.
      </p>

      <div className="mt-8 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Жаңа администратор қосу</h2>
        <div className="mt-4">
          <CreateAdminForm />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Аты-жөні</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Рөл</th>
              <th className="px-5 py-3 font-medium">Мәртебе</th>
              <th className="px-5 py-3 font-medium">Әрекеттер</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-ink">{user.name}</td>
                <td className="px-5 py-3 text-muted">{user.email}</td>
                <td className="px-5 py-3 text-ink">
                  {user.role === "OWNER" ? "Иесі" : "Администратор"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${
                      user.status === "ACTIVE"
                        ? "bg-bgreen/10 text-bgreen"
                        : "bg-bred/10 text-bred-dark"
                    }`}
                  >
                    {user.status === "ACTIVE" ? "Белсенді" : "Бұғатталған"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {user.role === "OWNER" ? (
                    <span className="text-[13px] text-muted/70">—</span>
                  ) : (
                    <UserRowActions userId={user.id} status={user.status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
