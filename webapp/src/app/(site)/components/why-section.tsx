"use client";

import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

const STATS = [
  {
    value: "87 600+",
    key: "why.s1",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M16 8.5a2.5 2.5 0 100-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M18 14.7c2 .5 3 1.9 3 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "7",
    key: "why.s2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 15.9l-5.2 2.9 1-5.9-4.3-4.2 5.9-.8L12 2.5z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "1",
    key: "why.s3",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6.5L9 17.5l-5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity=".4" />
      </svg>
    ),
  },
  {
    value: "24/7",
    key: "why.s4",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
];

export function WhySection() {
  const { t } = useI18n();

  return (
    <section id="why" className="py-16 md:py-20 px-5 md:px-8">
      <Reveal
        className="max-w-[1360px] mx-auto rounded-[1.75rem] px-6 py-12 md:px-14 md:py-14 text-center"
        style={{ background: "linear-gradient(135deg, #1c0a08 0%, #3a1310 55%, #1f3a2e 130%)" }}
      >
        <h2 className="font-serif font-semibold text-2xl md:text-3xl tracking-tight text-white">
          {t("why.title")} <span className="text-bgold-light">—</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-10 md:divide-x md:divide-white/10">
          {STATS.map((s) => (
            <div key={s.key} className="flex flex-col items-center px-2">
              <span className="text-bgold-light">{s.icon}</span>
              <p className="font-serif font-bold text-3xl md:text-4xl text-white mt-3 stat-num">{s.value}</p>
              <p className="text-[13px] md:text-sm text-white/60 mt-1.5">{t(s.key)}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
