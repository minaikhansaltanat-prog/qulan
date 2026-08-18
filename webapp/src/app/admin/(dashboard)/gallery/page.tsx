import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function GalleryPage() {
  await requireModuleAccess("gallery");
  return (
    <ModulePlaceholder
      title="Фото/видео галерея"
      description="Сайтта екі бөлек карусель бар: «Фотогалерея» және «Видеогалерея». Әр турға/бағытқа галерея тіркеу, bulk upload, мұқаба-фото тағайындау, alt-мәтін өрістері — R2/S3 медиа-қоймасы қосылған соң іске асады."
      phase="Фаза 3 — Турлар + галерея + пікірлер"
      siteBlocks={["Фотогалерея", "Видеогалерея"]}
    />
  );
}
