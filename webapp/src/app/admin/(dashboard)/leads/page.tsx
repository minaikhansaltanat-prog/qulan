import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "./status-select";

export default async function LeadsPage() {
  await requireModuleAccess("leads");
  const leads = await prisma.lead.findMany({
    include: { sourceTour: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">Өтінімдер</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-muted">
            Сайттың форма-өтінімдері осында жиналады. Admin рөлі тек көру мен статус өзгертуге қол жеткізеді.
          </p>
        </div>
        <a
          href="/api/admin/leads/export"
          className="h-11 shrink-0 rounded-lg border border-line bg-white px-5 text-[14px] font-semibold text-ink transition-colors
                     hover:bg-paper-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                     inline-flex items-center"
        >
          CSV экспорттау
        </a>
      </div>

      {leads.length === 0 ? (
        <p className="mt-10 text-[14px] text-muted">
          Әзірге өтінім жоқ. Негізгі сайт осы админ панельмен байланғаннан кейін мұнда автоматты түрде толады.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Аты</th>
                <th className="px-5 py-3 font-medium">Телефон</th>
                <th className="px-5 py-3 font-medium">Хабарлама</th>
                <th className="px-5 py-3 font-medium">Тур</th>
                <th className="px-5 py-3 font-medium">Күні</th>
                <th className="px-5 py-3 font-medium">Мәртебе</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{lead.name}</td>
                  <td className="px-5 py-3 text-muted">{lead.phone}</td>
                  <td className="px-5 py-3 max-w-xs truncate text-muted">{lead.message ?? "—"}</td>
                  <td className="px-5 py-3 text-muted">{lead.sourceTour?.title ?? "—"}</td>
                  <td className="px-5 py-3 text-muted">
                    {new Intl.DateTimeFormat("kk-KZ", { dateStyle: "medium" }).format(lead.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusSelect leadId={lead.id} status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
