import Link from "next/link";
import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import type { ReviewType } from "@/generated/prisma/enums";
import { ReviewRowActions } from "./review-row-actions";

const TYPE_LABELS: Record<ReviewType, string> = { VIDEO: "Видео", TEXT: "Жазбаша", AUDIO: "Аудио" };
const TABS: { value: ReviewType | "ALL"; label: string }[] = [
  { value: "ALL", label: "Барлығы" },
  { value: "VIDEO", label: "Видео" },
  { value: "TEXT", label: "Жазбаша" },
  { value: "AUDIO", label: "Аудио" },
];

export default async function ReviewsPage(props: PageProps<"/admin/reviews">) {
  await requireModuleAccess("reviews");
  const searchParams = await props.searchParams;
  const activeTab = (typeof searchParams.type === "string" ? searchParams.type : "ALL") as ReviewType | "ALL";

  const reviews = await prisma.review.findMany({
    where: activeTab === "ALL" ? {} : { type: activeTab },
    include: { tour: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">Пікірлер</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-muted">
            «Бізбен саяхаттағандар не дейді?» блогы. 2GIS сілтемесі — Баптаулар бөлімінде (сыртқы интеграция).
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="h-11 shrink-0 rounded-lg bg-bred px-5 text-[14px] font-semibold text-paper transition-colors
                     hover:bg-bred-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                     inline-flex items-center"
        >
          + Жаңа пікір
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "ALL" ? "/admin/reviews" : `/admin/reviews?type=${tab.value}`}
            className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
              activeTab === tab.value
                ? "border-bred bg-bred text-paper"
                : "border-line text-muted hover:bg-paper-dim"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-10 text-[14px] text-muted">Әзірге пікір жоқ.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-line text-[12px] uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Клиент</th>
                <th className="px-5 py-3 font-medium">Түрі</th>
                <th className="px-5 py-3 font-medium">Рейтинг</th>
                <th className="px-5 py-3 font-medium">Тур</th>
                <th className="px-5 py-3 font-medium">Мәртебе</th>
                <th className="px-5 py-3 font-medium">Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">
                    <Link href={`/admin/reviews/${review.id}/edit`} className="font-medium text-ink hover:text-bred">
                      {review.clientName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted">{TYPE_LABELS[review.type]}</td>
                  <td className="px-5 py-3 text-bgold">{"★".repeat(review.rating)}</td>
                  <td className="px-5 py-3 text-muted">{review.tour?.title ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${
                        review.isPublished ? "bg-bgreen/10 text-bgreen" : "bg-muted/15 text-muted"
                      }`}
                    >
                      {review.isPublished ? "Жарияланды" : "Жасырын"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <ReviewRowActions id={review.id} isPublished={review.isPublished} isFeatured={review.isFeatured} />
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
