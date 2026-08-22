"use client";

import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

const TOURS = [
  {
    cities: "zhangjiajie chongqing",
    types: "group private",
    img: "/Photo/web/sergio-kian-np-zf7h7c2c-unsplash.jpg",
    alt: "Чжанцзяцзе Аватар таулары",
    badge: true,
    titleKey: "tours.t1.title",
    descKey: "tours.t1.desc",
    price: "480 000 ₸",
    priceLabelKey: "tours.price_from",
    waText: "Сәлеметсіз бе! Чжанцзяцзе %2B Чунцин турына қызығушылық танытамын.",
  },
  {
    cities: "zhangjiajie",
    types: "group private",
    img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-15.jpg",
    alt: "Тяньмэнь тауы, Аспан қақпасы",
    titleKey: "tours.t2.title",
    descKey: "tours.t2.desc",
    waText: "Сәлеметсіз бе! Тяньмэнь тауы турына қызығушылық танытамын.",
  },
  {
    cities: "zhangjiajie",
    types: "group private",
    img: "/Photo/web/sergio-kian-tpyud2-lupc-unsplash.jpg",
    alt: "Чжанцзяцзе шыны көпірі",
    titleKey: "tours.t3.title",
    descKey: "tours.t3.desc",
    waText: "Сәлеметсіз бе! Шыны көпір турына қызығушылық танытамын.",
  },
  {
    cities: "shanghai",
    types: "group private",
    img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-28-2.jpg",
    alt: "Шанхай, Бунд жағалауы",
    titleKey: "tours.t4.title",
    descKey: "tours.t4.desc",
    waText: "Сәлеметсіз бе! Шанхай турына қызығушылық танытамын.",
  },
];

export function ToursSection() {
  const { t } = useI18n();

  return (
    <section id="tours" className="py-20 md:py-28 bg-paper">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="kicker mb-3">{t("tours.kicker")}</p>
            <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight uppercase">{t("tours.title")}</h2>
            <p className="text-muted mt-3 max-w-xl">{t("tours.sub")}</p>
          </div>
          <a href="#contact" className="!hidden md:!inline-flex btn btn-ghost font-bold text-[15px] border-b-2 border-bred pb-0.5">
            {t("tours.all")}
          </a>
        </Reveal>

        <div id="tourGrid" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOURS.map((tour) => (
            <article
              key={tour.titleKey}
              className="card overflow-hidden flex flex-col shadow-card"
              data-city={tour.cities}
              data-type={tour.types}
            >
              <div className="img-zoom relative aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tour.img} alt={tour.alt} className="w-full h-full object-cover" loading="lazy" />
                {tour.badge && (
                  <span className="absolute top-4 left-4 bg-bgold text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {t("tours.badge_flagship")}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col grow">
                <h3 className="font-serif font-semibold text-lg leading-snug">{t(tour.titleKey)}</h3>
                <p className="text-sm text-muted mt-2 grow line-clamp-2">{t(tour.descKey)}</p>
                <p className="text-xs text-muted mt-3">{t("tours.duration_custom")}</p>
                <div className="flex items-end justify-between mt-2 pt-3 border-t border-line">
                  <div>
                    <p className="text-[11px] text-muted uppercase tracking-wide">
                      {t(tour.priceLabelKey ?? "tours.price_ask")}
                    </p>
                    {tour.price ? (
                      <p className="font-serif font-bold text-2xl text-bred">{tour.price}</p>
                    ) : (
                      <p className="font-serif font-bold text-lg">{t("tours.price_request")}</p>
                    )}
                  </div>
                  <a
                    href={`https://wa.me/77072841148?text=${encodeURIComponent(tour.waText)}`}
                    target="_blank"
                    rel="noopener"
                    className="car-btn"
                    aria-label="Сұрау жіберу"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <a href="#contact" className="inline-flex md:!hidden mt-8 btn btn-ghost font-bold text-[15px] border-b-2 border-bred pb-0.5">
          {t("tours.all")}
        </a>
      </div>
    </section>
  );
}
