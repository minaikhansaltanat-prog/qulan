import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function CalendarPage() {
  await requireModuleAccess("calendar");
  return (
    <ModulePlaceholder
      title="Топтық турлар күнтізбесі"
      description="Кету күні, тур, бос орын саны және автоматты «Орындар таусылды» белгісі осында басқарылады."
      phase="Фаза 4 — Басты бет блок-редакторы + өтінімдер кабинеті"
    />
  );
}
