"use client";

import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

const BIG = { img: "/Photo/web/new-glass-bridge-valley.jpg", alt: "Чжанцзяцзе", zh: "张家界", key: "dest.city.zhangjiajie", descKey: "dest.zhangjiajie" };
const MEDIUM = { img: "/Photo/web/whatsapp-image-2026-08-17-at-23-50-28-2.jpg", alt: "Шанхай", zh: "上海", key: "dest.city.shanghai" };
const SMALL_TOP = [
  { img: "/Photo/web/city-chongqing.jpg", alt: "Чунцин, Хунъядун", zh: "重庆", key: "dest.city.chongqing" },
  { img: "/Photo/web/city-xian.jpg", alt: "Сиань, Терракот әскері", zh: "西安", key: "dest.city.xian" },
];
const SMALL_BOTTOM = [
  { img: "/Photo/web/city-guangzhou.jpg", alt: "Гуанчжоу панорамасы", zh: "广州", key: "dest.city.guangzhou" },
  { img: "/Photo/web/city-hongkong.jpg", alt: "Гонконг, Виктория шығанағы", zh: "香港", key: "dest.city.hongkong" },
  { img: "/Photo/web/city-chengdu.jpg", alt: "Чэнду, панда", zh: "成都", key: "dest.city.chengdu" },
];

export function DestinationsSection() {
  const { t } = useI18n();

  return (
    <section id="destinations" className="py-20 md:py-28 bg-white">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <Reveal className="mb-12">
          <p className="kicker mb-3">{t("dest.kicker")}</p>
          <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("dest.title")}</h2>
        </Reveal>

        <div className="grid md:grid-cols-4 md:grid-rows-2 gap-5">
          <a
            href="#contact"
            className="group relative rounded-3xl overflow-hidden md:col-span-2 md:row-span-2 h-72 md:h-[600px] shadow-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BIG.img} alt={BIG.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-7">
              <p className="text-white/60 font-serif text-3xl mb-1">{BIG.zh}</p>
              <h3 className="text-white font-serif font-semibold text-3xl">{t(BIG.key)}</h3>
              <p className="text-white/75 text-sm mt-2 max-w-xs">{t(BIG.descKey!)}</p>
            </div>
          </a>

          <a href="#contact" className="group relative rounded-3xl overflow-hidden md:col-span-2 h-56 md:h-[290px] shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MEDIUM.img} alt={MEDIUM.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 flex items-end justify-between w-full">
              <div>
                <p className="text-white/60 font-serif text-xl mb-1">{MEDIUM.zh}</p>
                <h3 className="text-white font-serif font-semibold text-2xl">{t(MEDIUM.key)}</h3>
              </div>
            </div>
          </a>

          {SMALL_TOP.map((d) => (
            <a key={d.key} href="#contact" className="group relative rounded-3xl overflow-hidden md:col-span-1 h-40 md:h-[290px] shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt={d.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
                <p className="text-white/60 font-serif text-base">{d.zh}</p>
                <h3 className="text-white font-serif font-semibold text-lg">{t(d.key)}</h3>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5 mt-5">
          {SMALL_BOTTOM.map((d) => (
            <a key={d.key} href="#contact" className="group relative rounded-3xl overflow-hidden h-32 md:h-40 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt={d.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4 md:p-5">
                <p className="text-white/60 font-serif text-sm">{d.zh}</p>
                <h3 className="text-white font-serif font-semibold text-base md:text-lg">{t(d.key)}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
