"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { I18N, type Locale } from "./i18n-dictionary";

const LANG_LABELS: Record<Locale, string> = { kk: "ҚАЗ", ru: "РУС", en: "ENG", zh: "中文" };
const STORAGE_KEY = "qt_lang";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  langLabel: (l: Locale) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("kk");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && stored in I18N) setLocaleState(stored);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }

  function t(key: string): string {
    return I18N[locale][key] ?? I18N.kk[key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, langLabel: (l) => LANG_LABELS[l] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
