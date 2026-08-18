import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function LeadsPage() {
  await requireModuleAccess("leads");
  return (
    <ModulePlaceholder
      title="Өтінімдер (Лидтер)"
      description="Барлық форма-өтінімдер, статус белгілеу, WhatsApp/Telegram автохабарлама баптауы, CSV экспорт. Admin рөлі тек көру мен өңдеуге қол жеткізеді."
      phase="Фаза 4 — Басты бет блок-редакторы + өтінімдер кабинеті"
    />
  );
}
