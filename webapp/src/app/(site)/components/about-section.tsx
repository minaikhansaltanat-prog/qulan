"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div className="order-2 lg:order-1">
          <p className="kicker mb-3">{t("about.kicker")}</p>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("about.title")}</h2>
          <p className="mt-6 text-[17px] leading-[1.8] text-ink/85">{t("about.p1")}</p>
          <p className="mt-4 text-[17px] leading-[1.8] text-ink/85">{t("about.p2")}</p>
          <blockquote className="mt-8 pl-6 border-l-4 border-bgold font-serif italic text-xl text-bgreen">
            {t("about.quote")}
          </blockquote>
          <a
            href="https://www.instagram.com/quan_travel_/"
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 font-bold text-[15px] hover:text-bred transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
            <span>{t("about.ig")}</span>
          </a>
        </div>
        <div className="order-1 lg:order-2 relative">
          <div className="rounded-[2rem] overflow-hidden shadow-lift aspect-[3/4] max-w-md mx-auto">
            <Image
              src="/Photo/web/new-kuan-zhangjiajie-portrait.jpg"
              alt="Куан, Чжанцзяцзе тау шыңдарында"
              width={480}
              height={640}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="hidden md:flex absolute top-6 -left-6 bg-bred text-white rounded-2xl shadow-lift px-5 py-4 items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M22.5 6.5l-9.7 11.5a2 2 0 01-3 .06L2.5 11"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold text-sm">{t("about.badge")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
