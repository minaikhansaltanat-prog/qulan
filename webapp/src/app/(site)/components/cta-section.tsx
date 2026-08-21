"use client";

import { useI18n } from "@/lib/i18n-context";

export function CtaSection() {
  const { t } = useI18n();

  // No `id="contact"` here on purpose — the live site's own `#contact`
  // links (nav, destination cards, "Барлық турлар туралы сұрау") don't
  // actually resolve to anything either; matched for fidelity.
  return (
    <section className="bg-ink noise relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl text-white tracking-tight">{t("cta.title")}</h2>
          <p className="text-white/60 mt-3 max-w-md">{t("cta.sub")}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a href="https://wa.me/77072841148" target="_blank" rel="noopener" className="btn btn-primary rounded-full px-7 py-4 text-[15px]">
            {t("cta.btn")}
          </a>
          <a
            href="https://wa.me/77072841148"
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
            className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.2c-.24.68-1.4 1.3-1.94 1.35-.5.06-1.1.1-3.4-.72-2.86-1.02-4.68-3.9-4.83-4.08-.14-.18-1.15-1.52-1.15-2.9s.72-2.05.98-2.33c.24-.27.53-.34.7-.34h.5c.16 0 .38-.03.58.44.24.56.8 1.95.87 2.09.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.28.7 1.16 1.52 1.88 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.16-.18.68-.8.87-1.07.18-.28.36-.23.6-.14.25.09 1.6.75 1.87.89.27.14.45.2.51.32.07.12.07.68-.16 1.36z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
