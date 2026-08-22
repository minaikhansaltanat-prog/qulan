"use client";

import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

// New trip photos lead the mosaic (big + secondary slots); the previous
// four photos now follow in the medium tiles and the closing wide banner.
const PHOTOS: { img: string; alt: string; key: string; tile: string; pos?: string }[] = [
  { img: "/Photo/web/new-zhangjiajie-lake-reflection.jpg", alt: "Айнадай көл беті", key: "story.c5", tile: "big" },
  { img: "/Photo/web/new-misty-pillars-aerial.jpg", alt: "Тас мұнаралар", key: "story.c6", tile: "regular" },
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-15-1.jpg", alt: "Дәстүрлі шай рәсімі", key: "story.c1", tile: "regular", pos: "50% 20%" },
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-28-1.jpg", alt: "Түнгі базар", key: "story.c2", tile: "regular" },
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-27-1.jpg", alt: "Қала ырғағы", key: "story.c3", tile: "regular" },
  { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-26-2.jpg", alt: "Ежелгі көше", key: "story.c4", tile: "wide" },
];

const TILE_CLASSES: Record<string, string> = {
  big: "md:row-span-2 h-[420px] md:h-full",
  regular: "h-52",
  wide: "md:col-span-3 h-64",
};

export function StorySection() {
  const { t } = useI18n();

  return (
    <section className="py-20 md:py-28 bg-bgreen noise text-white overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <Reveal className="mb-12 max-w-xl">
          <p className="kicker mb-3">
            <span className="text-bgold">◆</span> <span className="text-white/70">{t("story.kicker")}</span>
          </p>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight uppercase">{t("story.title")}</h2>
          <p className="text-white/70 mt-4">{t("story.sub")}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {PHOTOS.map((p) => (
            <div key={p.key} className={`rounded-3xl overflow-hidden img-zoom relative ${TILE_CLASSES[p.tile]}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.alt}
                className={`w-full h-full object-cover ${p.tile === "wide" ? "object-[50%_22%] md:object-[50%_37%]" : ""}`}
                style={p.pos ? { objectPosition: p.pos } : undefined}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"></div>
              <p className={`absolute text-white font-serif ${p.tile !== "regular" ? "bottom-5 left-5 text-xl" : "bottom-4 left-4 text-lg"}`}>
                {t(p.key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
