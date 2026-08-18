import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function AnalyticsPage() {
  await requireModuleAccess("analytics");
  return (
    <ModulePlaceholder
      title="Аналитика / статистика"
      description="Дашборд статистикасы мен есептер осында көрсетіледі. Admin рөлі тек көру құқығына ие."
      phase="Кейінгі фаза"
    />
  );
}
