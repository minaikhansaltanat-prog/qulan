import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function ToursPage() {
  await requireModuleAccess("tours");
  return (
    <ModulePlaceholder
      title="Турлар"
      description="Сайттың «Ең танымал турлар» тізімі мен «7 бағыт — бір гидпен» (Чжанцзяцзе, Шанхай, Чунцин, Сиань, Гуанчжоу, Гонконг, Чэнду) блогы осы жерден толтырылады: тур қосу/өзгерту/жою, бағыттар, itinerary-конструктор, SEO-өрістер және басты беттегі көрсету реті."
      phase="Фаза 3 — Турлар + галерея + пікірлер"
      siteBlocks={["Ең танымал турлар", "7 бағыт — бір гидпен"]}
    />
  );
}
