import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export default async function AuditLogPage() {
  const session = await requireModuleAccess("auditLog");
  const isOwner = session.user.role === "OWNER";

  const logs = await prisma.auditLog.findMany({
    where: isOwner ? {} : { actorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">
        Әрекеттер журналы
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-muted">
        {isOwner
          ? "Барлық пайдаланушылардың жазу-әрекеттері (create/update/delete) осында тіркеледі."
          : "Тек өз әрекеттеріңіз көрсетіледі."}
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Уақыты</th>
              <th className="px-5 py-3 font-medium">Кім</th>
              <th className="px-5 py-3 font-medium">Әрекет</th>
              <th className="px-5 py-3 font-medium">Нысан</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  Әзірге жазба жоқ.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-muted">
                  {new Intl.DateTimeFormat("kk-KZ", { dateStyle: "medium", timeStyle: "short" }).format(
                    log.createdAt
                  )}
                </td>
                <td className="px-5 py-3 text-ink">{log.actorEmail}</td>
                <td className="px-5 py-3 text-ink">{log.action}</td>
                <td className="px-5 py-3 text-muted">
                  {log.entityType}
                  {log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
