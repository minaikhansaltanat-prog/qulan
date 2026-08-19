import Link from "next/link";
import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { DESTINATION_LABELS, TOUR_STATUS_LABELS } from "@/lib/tour-labels";
import { TourRowActions } from "./tour-row-actions";

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-bgreen/10 text-bgreen",
  DRAFT: "bg-bgold/15 text-bgold",
  ARCHIVED: "bg-muted/15 text-muted",
};

export default async function ToursPage() {
  await requireModuleAccess("tours");
  const tours = await prisma.tour.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">Турлар</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-muted">
            Сайттың «Ең танымал турлар» және «7 бағыт — бір гидпен» блоктары осы тізіммен толтырылады.
          </p>
        </div>
        <Link
          href="/admin/tours/new"
          className="h-11 shrink-0 rounded-lg bg-bred px-5 text-[14px] font-semibold text-paper transition-colors
                     hover:bg-bred-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                     inline-flex items-center"
        >
          + Жаңа тур
        </Link>
      </div>

      {tours.length === 0 ? (
        <p className="mt-10 text-[14px] text-muted">Әзірге тур жоқ.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Атауы</th>
                <th className="px-5 py-3 font-medium">Бағыттар</th>
                <th className="px-5 py-3 font-medium">Баға</th>
                <th className="px-5 py-3 font-medium">Мәртебе</th>
                <th className="px-5 py-3 font-medium">Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour, i) => (
                <tr key={tour.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">
                    <Link href={`/admin/tours/${tour.id}/edit`} className="font-medium text-ink hover:text-bred">
                      {tour.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {tour.destinations.map((d) => DESTINATION_LABELS[d]).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3 text-ink">
                    {tour.priceTenge ? `${tour.priceTenge.toLocaleString("ru-RU")} ₸` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${STATUS_STYLES[tour.status]}`}
                    >
                      {TOUR_STATUS_LABELS[tour.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <TourRowActions id={tour.id} isFirst={i === 0} isLast={i === tours.length - 1} />
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
