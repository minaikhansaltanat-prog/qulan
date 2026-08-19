import { z } from "zod";

export const HERO_SCHEMA = z.object({
  kicker: z.string(),
  h1Line1: z.string(),
  h1Line2: z.string(),
  h1Line3: z.string(),
  subtitle: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export const ABOUT_SCHEMA = z.object({
  kicker: z.string(),
  title: z.string(),
  paragraph1: z.string(),
  paragraph2: z.string(),
  quote: z.string(),
});

export const TRUST_SCHEMA = z.object({
  number: z.string(),
  label: z.string(),
});

export const FOOTER_SCHEMA = z.object({
  phone: z.string(),
  whatsapp: z.string(),
  instagram: z.string(),
  description: z.string(),
});

export const WHY_CARD_SCHEMA = z.object({ title: z.string(), description: z.string() });
export const WHY_SCHEMA = z.object({
  kicker: z.string(),
  title: z.string(),
  subtitle: z.string(),
  cards: z.array(WHY_CARD_SCHEMA),
});

export type HeroContent = z.infer<typeof HERO_SCHEMA>;
export type AboutContent = z.infer<typeof ABOUT_SCHEMA>;
export type TrustContent = z.infer<typeof TRUST_SCHEMA>;
export type FooterContent = z.infer<typeof FOOTER_SCHEMA>;
export type WhyContent = z.infer<typeof WHY_SCHEMA>;

export const HERO_DEFAULT: HeroContent = {
  kicker: "ҚЫТАЙҒА САЯХАТ",
  h1Line1: "ҚЫТАЙДЫ",
  h1Line2: "БІРГЕ АШУҒА",
  h1Line3: "ДАЙЫНСЫҢ БА?",
  subtitle:
    "Quan Travel — Қазақстаннан Қытайдың кез келген қаласына қазақ тілінде сөйлейтін жеке гид-аудармашымен сенімді саяхат.",
  ctaLabel: "Турларды көру",
  ctaHref: "#tours",
};

export const ABOUT_DEFAULT: AboutContent = {
  kicker: "Негізін қалаушы",
  title: "Куанмен танысыңыз",
  paragraph1:
    "Мен — Куанмын, Қытай тілінде сөйлейтін аудармашы-гидмін. Instagram-дағы @quan_travel_ парақшасы арқылы Қазақстаннан Қытайға саяхаттаған 87 600-ден астам жазылушыдан тұратын қоғамдастықты біріктірдім.",
  paragraph2:
    "Әр сапарда сізбен жеке өзім — делдалсыз, аудармашысыз шатасусыз. Аудармашы, гид, логистика және бағдарлама — бір қолда, бір адамда.",
  quote: "«Әр қазақ — менің жалғызым»",
};

export const TRUST_DEFAULT: TrustContent = { number: "87 600+", label: "Instagram жазылушысы · Meta Verified" };

export const FOOTER_DEFAULT: FooterContent = {
  phone: "+7 747 954 57 71",
  whatsapp: "https://wa.me/77479545771",
  instagram: "https://www.instagram.com/quan_travel_/",
  description: "Quan Travel — Қазақстаннан Қытайға сенімді саяхат.",
};

export const WHY_DEFAULT: WhyContent = {
  kicker: "Артықшылықтар",
  title: "Неге бізді таңдайды?",
  subtitle: "Сапалы қызмет пен жеке көзқарас — саяхатыңыздың әр қадамын бірге сүйемелдейміз.",
  cards: [],
};

export const SIMPLE_BLOCKS = {
  hero: { label: "Басты бет (Hero)", schema: HERO_SCHEMA, defaultValue: HERO_DEFAULT },
  about: { label: "Куанмен танысыңыз", schema: ABOUT_SCHEMA, defaultValue: ABOUT_DEFAULT },
  trust: { label: "Сенім-статистика", schema: TRUST_SCHEMA, defaultValue: TRUST_DEFAULT },
  footer: { label: "Footer деректемелері", schema: FOOTER_SCHEMA, defaultValue: FOOTER_DEFAULT },
} as const;

export type SimpleBlockKey = keyof typeof SIMPLE_BLOCKS;
