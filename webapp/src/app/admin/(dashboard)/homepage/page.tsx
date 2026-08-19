import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import {
  SIMPLE_BLOCKS,
  WHY_SCHEMA,
  WHY_DEFAULT,
  type SimpleBlockKey,
  type WhyContent,
} from "@/lib/homepage-blocks";
import { saveSimpleBlock } from "./actions";
import { SimpleBlockForm } from "./simple-block-form";
import { WhyBlockForm } from "./why-block-form";
import { FaqManager } from "./faq-manager";

const SIMPLE_FIELD_CONFIG: Record<SimpleBlockKey, { name: string; label: string; multiline?: boolean }[]> = {
  hero: [
    { name: "kicker", label: "Кішкентай айдар" },
    { name: "h1Line1", label: "Тақырып — 1-жол" },
    { name: "h1Line2", label: "Тақырып — 2-жол (акцент)" },
    { name: "h1Line3", label: "Тақырып — 3-жол" },
    { name: "subtitle", label: "Түсіндірме мәтін", multiline: true },
    { name: "ctaLabel", label: "CTA түйме мәтіні" },
    { name: "ctaHref", label: "CTA сілтемесі" },
  ],
  about: [
    { name: "kicker", label: "Кішкентай айдар" },
    { name: "title", label: "Тақырып" },
    { name: "paragraph1", label: "1-абзац", multiline: true },
    { name: "paragraph2", label: "2-абзац", multiline: true },
    { name: "quote", label: "Дәйексөз" },
  ],
  trust: [
    { name: "number", label: "Сан" },
    { name: "label", label: "Мәтін" },
  ],
  footer: [
    { name: "phone", label: "Телефон" },
    { name: "whatsapp", label: "WhatsApp сілтемесі" },
    { name: "instagram", label: "Instagram сілтемесі" },
    { name: "description", label: "Қысқаша сипаттама", multiline: true },
  ],
};

export default async function HomepagePage() {
  await requireModuleAccess("homepage");

  const [blocks, faqItems] = await Promise.all([
    prisma.homepageBlock.findMany(),
    prisma.faqItem.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  const blockByKey = new Map(blocks.map((b) => [b.key, b.content]));

  function simpleInitial(key: SimpleBlockKey): Record<string, string> {
    const stored = blockByKey.get(key);
    const parsed = SIMPLE_BLOCKS[key].schema.safeParse(stored);
    return parsed.success ? parsed.data : SIMPLE_BLOCKS[key].defaultValue;
  }

  const whyStored = blockByKey.get("why");
  const whyParsed = WHY_SCHEMA.safeParse(whyStored);
  const whyInitial: WhyContent = whyParsed.success ? whyParsed.data : WHY_DEFAULT;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">
        Басты бет блоктары
      </h1>
      <p className="mt-2 text-[15px] leading-[1.7] text-muted">
        Сайттың нақты бөлімдеріне сай блоктар. Әр форманы жеке сақтауға болады.
      </p>

      <section className="mt-8 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Басты бет (Hero)</h2>
        <div className="mt-4">
          <SimpleBlockForm action={saveSimpleBlock.bind(null, "hero")} fields={SIMPLE_FIELD_CONFIG.hero} initial={simpleInitial("hero")} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Неге бізді таңдайды? (УТП)</h2>
        <div className="mt-4">
          <WhyBlockForm initial={whyInitial} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Куанмен танысыңыз</h2>
        <div className="mt-4">
          <SimpleBlockForm action={saveSimpleBlock.bind(null, "about")} fields={SIMPLE_FIELD_CONFIG.about} initial={simpleInitial("about")} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Сенім-статистика</h2>
        <div className="mt-4">
          <SimpleBlockForm action={saveSimpleBlock.bind(null, "trust")} fields={SIMPLE_FIELD_CONFIG.trust} initial={simpleInitial("trust")} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Footer деректемелері</h2>
        <div className="mt-4">
          <SimpleBlockForm action={saveSimpleBlock.bind(null, "footer")} fields={SIMPLE_FIELD_CONFIG.footer} initial={simpleInitial("footer")} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Жиі қойылатын сұрақтар (FAQ)</h2>
        <div className="mt-4">
          <FaqManager items={faqItems} />
        </div>
      </section>
    </div>
  );
}
