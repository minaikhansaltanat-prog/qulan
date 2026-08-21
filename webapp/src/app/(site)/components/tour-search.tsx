"use client";

import { useI18n } from "@/lib/i18n-context";

export function TourSearch() {
  const { t } = useI18n();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const city = (form.elements.namedItem("fCity") as HTMLSelectElement).value;
    const type = (form.elements.namedItem("fType") as HTMLSelectElement).value;

    document.querySelectorAll<HTMLElement>("#tourGrid > article").forEach((card) => {
      const cities = (card.getAttribute("data-city") || "").split(" ");
      const types = (card.getAttribute("data-type") || "").split(" ");
      const show = (!city || cities.includes(city)) && (!type || types.includes(type));
      card.style.display = show ? "" : "none";
    });

    document.getElementById("tours")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative z-20 -mt-8 md:-mt-10 px-5 md:px-8">
      <div
        className="max-w-[1360px] mx-auto rounded-2xl md:rounded-[1.5rem] shadow-lift"
        style={{ background: "linear-gradient(120deg, #7c211c 0%, #9f2b25 55%, #6f1e19 100%)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 md:gap-0 md:divide-x md:divide-white/15 px-5 md:px-8 py-6"
        >
          <div className="px-0 md:px-6 first:pl-0">
            <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="9" r="2.3" stroke="currentColor" strokeWidth="2" />
              </svg>
              {t("search.city")}
            </label>
            <select
              name="fCity"
              className="w-full bg-transparent text-white font-semibold text-[15px] outline-none cursor-pointer"
            >
              <option className="text-ink" value="">{t("search.city_all")}</option>
              <option className="text-ink" value="zhangjiajie">{t("dest.city.zhangjiajie")}</option>
              <option className="text-ink" value="shanghai">{t("dest.city.shanghai")}</option>
              <option className="text-ink" value="chongqing">{t("dest.city.chongqing")}</option>
              <option className="text-ink" value="xian">{t("dest.city.xian")}</option>
              <option className="text-ink" value="guangzhou">{t("dest.city.guangzhou")}</option>
              <option className="text-ink" value="hongkong">{t("dest.city.hongkong")}</option>
              <option className="text-ink" value="chengdu">{t("dest.city.chengdu")}</option>
            </select>
          </div>
          <div className="px-0 md:px-6">
            <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t("search.type")}
            </label>
            <select
              name="fType"
              className="w-full bg-transparent text-white font-semibold text-[15px] outline-none cursor-pointer"
            >
              <option className="text-ink" value="">{t("search.type_all")}</option>
              <option className="text-ink" value="group">{t("search.type_group")}</option>
              <option className="text-ink" value="private">{t("search.type_private")}</option>
            </select>
          </div>
          <div className="px-0 md:px-6">
            <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/60 font-bold mb-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              </svg>
              {t("search.date")}
            </label>
            <select
              name="fDate"
              className="w-full bg-transparent text-white font-semibold text-[15px] outline-none cursor-pointer"
            >
              <option className="text-ink" value="">{t("search.date_any")}</option>
              <option className="text-ink" value="soon">{t("search.date_soon")}</option>
              <option className="text-ink" value="season">{t("search.date_season")}</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn rounded-xl px-7 py-4 text-sm font-bold mt-2 md:mt-0 md:ml-6 bg-bgold text-ink hover:bg-bgold-light transition-colors"
          >
            <span>{t("search.submit")}</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
