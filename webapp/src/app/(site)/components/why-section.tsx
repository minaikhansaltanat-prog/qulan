"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

const STATS = [
  { value: "87 600+", key: "why.s1" },
  { value: "7", key: "why.s2" },
  { value: "1", key: "why.s3" },
  { value: "24/7", key: "why.s4" },
];

export function WhySection() {
  const { t } = useI18n();

  return (
    <section id="why" className="py-20 md:py-28 bg-paper">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">
        <Reveal className="relative">
          <div className="rounded-[2rem] overflow-hidden shadow-lift aspect-[4/5]">
            <Image
              src="/Photo/web/whatsapp-image-2026-08-17-at-23-50-26.jpg"
              alt="Quan Travel гиді Қытайда"
              width={640}
              height={800}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="hidden md:block absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-card px-6 py-5 max-w-[220px]">
            <p className="font-serif text-3xl font-bold text-bred">87 600+</p>
            <p className="text-xs text-muted mt-1">{t("why.ig")}</p>
          </div>
        </Reveal>

        <div>
          <p className="kicker mb-3">{t("why.kicker")}</p>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("why.title")}</h2>
          <p className="text-muted mt-4 max-w-lg">{t("why.sub")}</p>

          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {STATS.map((s) => (
              <Reveal key={s.key}>
                <p className="font-serif font-bold text-4xl stat-num">{s.value}</p>
                <p className="text-sm text-muted mt-1.5">{t(s.key)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
