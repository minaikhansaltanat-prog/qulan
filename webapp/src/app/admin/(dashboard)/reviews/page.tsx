import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function ReviewsPage() {
  await requireModuleAccess("reviews");
  return (
    <ModulePlaceholder
      title="Пікірлер"
      description={
        'Сайттағы «Бізбен саяхаттағандар не дейді?» бөлімі 4 табтан тұрады: Видео, Жазбаша, Аудио және 2GIS. ' +
        "Осы бөлімде әр табқа жеке пікір қосу (клиент аты, фото/аудио/видео файл, мәтін, рейтинг, қатысқан тур), " +
        "модерация (жариялау/жасыру), «Ұсынылған» белгісі және бағыт/тур бойынша сүзу болады."
      }
      phase="Фаза 3 — Турлар + галерея + пікірлер"
      siteBlocks={["Видео пікірлер", "Жазбаша пікірлер", "Аудио пікірлер", "2GIS сілтемесі"]}
    />
  );
}
