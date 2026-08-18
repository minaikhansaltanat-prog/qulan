import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function BlogPage() {
  await requireModuleAccess("blog");
  return (
    <ModulePlaceholder
      title="Блог / Журнал"
      description="Тақырып, мұқаба, rich-text мәтін, санат, SEO-өрістер және жариялау күні осында толтырылады."
      phase="Кейінгі фаза"
    />
  );
}
