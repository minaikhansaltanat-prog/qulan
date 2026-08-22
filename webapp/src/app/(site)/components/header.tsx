"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-dictionary";

const NAV_ITEMS: { href: string; key: string }[] = [
  { href: "#home", key: "nav.home" },
  { href: "#tours", key: "nav.tours" },
  { href: "#destinations", key: "nav.destinations" },
  { href: "#gallery", key: "nav.gallery" },
  { href: "#reviews", key: "nav.reviews" },
  { href: "#about", key: "nav.about" },
  { href: "#faq", key: "nav.faq" },
  { href: "#contact", key: "nav.contact" },
];

const LOCALES: { code: Locale; label: string }[] = [
  { code: "kk", label: "Қазақша" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
];

const SECTION_IDS = ["home", "tours", "destinations", "gallery", "reviews", "about", "faq", "contact"];

export function Header() {
  const { t, locale, setLocale, langLabel } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [active, setActive] = useState("home");
  const langSwitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    function onScroll() {
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (langSwitchRef.current && !langSwitchRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header id="site-header" className={`hdr ${menuOpen ? "menu-open" : ""}`}>
      <div className="hdr-bg">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 h-[76px] flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-2 shrink-0" aria-label="Quan Travel — басты бет">
            <Image src="/brand/logo.png" alt="Quan Travel logo" width={140} height={44} className="h-9 md:h-11 w-auto object-contain" priority />
          </a>

          <nav className="hidden lg:flex items-center gap-2 xl:gap-6 text-[13px] xl:text-[15px] font-semibold whitespace-nowrap">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${active === item.href.slice(1) ? "active" : ""}`}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="tel:+77072841148"
              className="hidden 2xl:flex items-center gap-2 text-[15px] font-bold hover:text-bred transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
                  fill="currentColor"
                />
              </svg>
              <span>+7&nbsp;707&nbsp;284&nbsp;11&nbsp;48</span>
            </a>

            <div id="langSwitch" ref={langSwitchRef} className={`relative ${langOpen ? "lang-open" : ""}`}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen((v) => !v);
                }}
                className="flex items-center gap-1.5 border border-line rounded-full pl-3 pr-2.5 py-1.5 text-xs font-bold hover:border-bred/50 transition-colors"
                aria-haspopup="true"
                aria-expanded={langOpen}
                aria-label="Тілді таңдау"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M3 12h18M12 3c2.5 2.6 3.8 6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-6-3.8-9s1.3-6.4 3.8-9z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                <span>{langLabel(locale)}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
              <div className="lang-menu absolute right-0 mt-2 w-40 bg-white border border-line rounded-2xl shadow-lift py-2 z-50">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLocale(l.code);
                      setLangOpen(false);
                    }}
                    className="lang-opt w-full text-left px-4 py-2 text-sm font-semibold hover:bg-paper flex items-center justify-between"
                  >
                    {l.label} <span className="text-muted font-normal">{langLabel(l.code)}</span>
                  </button>
                ))}
              </div>
            </div>

            <a
              href="#tours"
              className="!hidden md:!inline-flex btn btn-primary rounded-full px-4 xl:px-5 py-2.5 text-[13px] xl:text-sm whitespace-nowrap"
            >
              {t("nav.cta")}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden burger"
              aria-label="Мәзір"
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      <div className="mobile-panel lg:hidden">
        <div className="max-w-[1360px] mx-auto px-6 pt-28 pb-12 flex flex-col gap-1 min-h-full">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="py-4 text-2xl font-serif font-semibold border-b border-line"
            >
              {t(item.key)}
            </a>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <a href="tel:+77072841148" className="flex items-center gap-3 font-bold text-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
                  fill="currentColor"
                />
              </svg>
              +7 707 284 11 48
            </a>
            <a
              href="https://wa.me/77072841148"
              target="_blank"
              rel="noopener"
              className="btn btn-primary rounded-full px-6 py-3.5 text-base w-full mt-2"
            >
              {t("nav.cta")}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
