"use client";

import { useState, type ReactElement } from "react";
import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";
import { useCarouselNav, CarouselButtons } from "./carousel";

type Tab = "video" | "text" | "audio" | "2gis";

const TABS: { value: Tab; key: string }[] = [
  { value: "video", key: "reviews.tab_video" },
  { value: "text", key: "reviews.tab_text" },
  { value: "audio", key: "reviews.tab_audio" },
  { value: "2gis", key: "reviews.tab_2gis" },
];

const ICONS: Record<"video" | "text" | "audio", ReactElement> = {
  video: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M17 9.5l4-2.5v10l-4-2.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  text: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5h14M5 12h14M5 19h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  audio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
};

function PlaceholderCard({ icon, label, soonLabel }: { icon: ReactElement; label: string; soonLabel: string }) {
  return (
    <div className="w-[260px] sm:w-[300px] shrink-0 card p-6 shadow-card relative">
      <span className="absolute top-4 right-4 bg-bgold/10 text-bgold text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
        {soonLabel}
      </span>
      <div className="w-11 h-11 rounded-xl bg-paper flex items-center justify-center text-bgreen mb-4">{icon}</div>
      <p className="font-serif text-lg leading-snug">{label}</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-line"></div>
        <div className="h-2 w-24 bg-line rounded-full"></div>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("video");
  const { ref, goPrev, goNext } = useCarouselNav();

  return (
    <section id="reviews" className="py-20 md:py-28 bg-paper">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <Reveal className="mb-10">
          <p className="kicker mb-3">{t("reviews.kicker")}</p>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("reviews.title")}</h2>
        </Reveal>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tItem, i) => (
            <div key={tItem.value} className="contents">
              {i > 0 && <span className="text-line px-1">/</span>}
              <button
                type="button"
                onClick={() => setTab(tItem.value)}
                className={`tab-btn px-1 py-2 text-[15px] ${tab === tItem.value ? "active" : ""}`}
              >
                {t(tItem.key)}
              </button>
            </div>
          ))}
        </div>

        <div>
          {tab !== "2gis" ? (
            <div className="relative">
              <div ref={ref} className="carousel gap-5 pb-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PlaceholderCard
                    key={i}
                    icon={ICONS[tab]}
                    label={t(`reviews.soon_${tab}`)}
                    soonLabel={t("reviews.soon_badge")}
                  />
                ))}
              </div>
              <CarouselButtons goPrev={goPrev} goNext={goNext} className="hidden md:flex justify-end mt-5" />
            </div>
          ) : (
            <div className="max-w-md">
              <div className="card p-7 shadow-card">
                <div className="w-12 h-12 rounded-xl bg-[#12CF61]/10 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z" stroke="#12CF61" strokeWidth="1.8" />
                    <circle cx="12" cy="9" r="2.5" stroke="#12CF61" strokeWidth="1.8" />
                  </svg>
                </div>
                <p className="font-serif font-semibold text-xl">{t("reviews.gis_title")}</p>
                <p className="text-sm text-muted mt-2">{t("reviews.gis_desc")}</p>
                {/* TODO: replace with the real 2GIS office link when provided */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener"
                  className="mt-5 inline-flex items-center gap-2 bg-[#12CF61] text-white font-bold text-sm px-5 py-3 rounded-xl hover:brightness-95 transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z" stroke="white" strokeWidth="2" />
                    <circle cx="12" cy="9" r="2.2" fill="white" />
                  </svg>
                  <span>{t("reviews.gis_btn")}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
