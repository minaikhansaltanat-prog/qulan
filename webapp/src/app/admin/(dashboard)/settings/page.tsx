import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function SettingsPage() {
  await requireModuleAccess("settings");
  return (
    <ModulePlaceholder
      title="Жалпы баптаулар"
      description="SEO негізі, аналитика кодтары (GA4, Yandex Metrika, Meta Pixel), байланыс деректемелері. Railway environment variables қауіпсіздік үшін тек Railway дашбордында өзгертіледі, бұл жерде емес."
      phase="Тек Owner — кейінгі фаза"
    />
  );
}
