"use client";

import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

const PHOTOS = [
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-15-1.jpg", alt: "Дәстүрлі шай рәсімі", key: "story.c1", big: true },
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-28-1.jpg", alt: "Түнгі базар", key: "story.c2" },
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-27-1.jpg", alt: "Қала ырғағы", key: "story.c3" },
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-26-2.jpg", alt: "Ежелгі көше", key: "story.c4", wide: true },
];

export function StorySection() {
  const { t } = useI18n();

  return (
    <section className="py-20 md:py-28 bg-bgreen noise text-white overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <Reveal className="mb-12 max-w-xl">
          <p className="kicker mb-3">
            <span className="text-bgold">◆</span> <span className="text-white/70">{t("story.kicker")}</span>
          </p>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("story.title")}</h2>
          <p className="text-white/70 mt-4">{t("story.sub")}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {PHOTOS.map((p) => (
            <div
              key={p.key}
              className={`rounded-3xl overflow-hidden img-zoom relative ${
                p.big
                  ? "md:row-span-2 h-[420px] md:h-full"
                  : p.wide
                    ? "md:col-span-2 h-64"
                    : "h-52"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.alt}
                className={`w-full h-full object-cover ${p.wide ? "object-[50%_22%] md:object-[50%_37%]" : ""}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"></div>
              <p className={`absolute text-white font-serif ${p.big || p.wide ? "bottom-5 left-5 text-xl" : "bottom-4 left-4 text-lg"}`}>
                {t(p.key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
