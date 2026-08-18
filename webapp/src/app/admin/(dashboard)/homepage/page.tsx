import { requireModuleAccess } from "@/lib/auth-guards";
import { ModulePlaceholder } from "../module-placeholder";

export default async function HomepagePage() {
  await requireModuleAccess("homepage");
  return (
    <ModulePlaceholder
      title="Басты бет блоктары"
      description="Сайттың нақты бөлімдері бойынша: Hero айдары мен CTA түймелер, тур іздеу виджеті, «Неге бізді таңдайды?» УТП-карточкалары, «Қытайды басқа қырынан таны» мәдени фото-блогы, бейне-шоу, «Куанмен танысыңыз» блогы мен дәйексөзі, «Жиі қойылатын сұрақтар» және footer деректемелері осы бөлімде өзгертіледі."
      phase="Фаза 4 — Басты бет блок-редакторы + өтінімдер кабинеті"
      siteBlocks={[
        "Басты бет (Hero)",
        "Тур іздеу виджеті",
        "Неге бізді таңдайды? (УТП)",
        "Қытайды басқа қырынан таны",
        "Бейне-шоу",
        "Куанмен танысыңыз",
        "Жиі қойылатын сұрақтар",
        "Footer",
      ]}
    />
  );
}
