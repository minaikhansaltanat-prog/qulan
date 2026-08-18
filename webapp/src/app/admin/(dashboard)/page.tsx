import { requireSession } from "@/lib/auth-guards";

const STAT_TILES = [
  { labelKk: "Жаңа өтінімдер", note: "Leads модулі — Фаза 4" },
  { labelKk: "Жарияланбаған пікірлер", note: "Пікірлер модулі — Фаза 3" },
  { labelKk: "Жарияланған турлар", note: "Турлар модулі — Фаза 3" },
  { labelKk: "Жақындағы топтық кетулер", note: "Күнтізбе модулі — Фаза 4" },
];

export default async function AdminDashboardPage() {
  const session = await requireSession();
  const firstName = session.user.name?.split(" ")[0] ?? session.user.email;

  return (
    <div>
      <h1 className="font-display text-[28px] leading-tight tracking-[-0.01em] text-ink">
        Сәлем, {firstName}
      </h1>
      <p className="mt-2 text-[15px] leading-[1.7] text-muted">
        Бұл — Quan Travel әкімшілік панелінің дашборды. Төмендегі бөлімдер келесі фазаларда
        нақты деректермен толтырылады.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_TILES.map((tile) => (
          <div
            key={tile.labelKk}
            className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(17,17,17,0.04)]"
          >
            <p className="text-[13px] font-medium text-muted">{tile.labelKk}</p>
            <p className="mt-2 font-display text-[30px] leading-none text-ink">—</p>
            <p className="mt-2 text-[12px] text-muted/80">{tile.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
