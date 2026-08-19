"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

const ITEMS = Array.from({ length: 8 }, (_, i) => i + 1).map((n) => ({
  qKey: `faq.q${n}`,
  aKey: `faq.a${n}`,
}));

export function FaqSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <Reveal className="max-w-2xl mb-12">
          <p className="kicker mb-3">{t("faq.kicker")}</p>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("faq.title")}</h2>
          <p className="text-muted mt-4">{t("faq.sub")}</p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-14 items-start">
          <Reveal>
            {ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.qKey} className={`faq-item border-t border-line ${i === ITEMS.length - 1 ? "border-b" : ""} ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span>{t(item.qKey)}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="faq-a">
                    <p>{t(item.aKey)}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>

          <Reveal as="aside" className="rounded-3xl overflow-hidden shadow-lift relative hidden lg:block h-full min-h-[520px]">
            <Image
              src="/Photo/web/whatsapp-image-2026-08-17-at-23-50-26-1.jpg"
              alt="Quan Travel гиді"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-serif text-2xl text-white leading-snug">{t("faq.aside_title")}</p>
              <p className="text-white/70 text-sm mt-3">{t("faq.aside_sub")}</p>
              <a
                href="https://wa.me/77479545771"
                target="_blank"
                rel="noopener"
                className="btn btn-primary rounded-full px-6 py-3.5 text-sm mt-6"
              >
                {t("faq.aside_btn")}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
