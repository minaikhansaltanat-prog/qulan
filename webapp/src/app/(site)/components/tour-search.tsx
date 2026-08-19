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
    <section className="bg-ink relative z-20">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-6">
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 md:gap-0 md:divide-x md:divide-white/10"
        >
          <div className="px-0 md:px-6 first:pl-0">
            <label className="block text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1.5">
              {t("search.city")}
            </label>
            <select
              name="fCity"
              className="w-full bg-transparent text-white font-semibold text-[15px] outline-none cursor-pointer"
            >
              <option value="">{t("search.city_all")}</option>
              <option value="zhangjiajie">{t("dest.city.zhangjiajie")}</option>
              <option value="shanghai">{t("dest.city.shanghai")}</option>
              <option value="chongqing">{t("dest.city.chongqing")}</option>
              <option value="xian">{t("dest.city.xian")}</option>
              <option value="guangzhou">{t("dest.city.guangzhou")}</option>
              <option value="hongkong">{t("dest.city.hongkong")}</option>
              <option value="chengdu">{t("dest.city.chengdu")}</option>
            </select>
          </div>
          <div className="px-0 md:px-6">
            <label className="block text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1.5">
              {t("search.type")}
            </label>
            <select
              name="fType"
              className="w-full bg-transparent text-white font-semibold text-[15px] outline-none cursor-pointer"
            >
              <option value="">{t("search.type_all")}</option>
              <option value="group">{t("search.type_group")}</option>
              <option value="private">{t("search.type_private")}</option>
            </select>
          </div>
          <div className="px-0 md:px-6">
            <label className="block text-[11px] uppercase tracking-wider text-white/50 font-bold mb-1.5">
              {t("search.date")}
            </label>
            <select
              name="fDate"
              className="w-full bg-transparent text-white font-semibold text-[15px] outline-none cursor-pointer"
            >
              <option value="">{t("search.date_any")}</option>
              <option value="soon">{t("search.date_soon")}</option>
              <option value="season">{t("search.date_season")}</option>
            </select>
          </div>
          {/* Both the button and its inner span carry `data-i18n="search.submit"`
              on the live site, so the outer element's JS overwrite wipes out
              the inner span and the search icon on every render — no icon
              actually shows. Matched here for fidelity. */}
          <button
            type="submit"
            className="btn btn-primary rounded-xl md:rounded-2xl px-7 py-4 text-sm mt-2 md:mt-0 md:ml-6"
          >
            {t("search.submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
