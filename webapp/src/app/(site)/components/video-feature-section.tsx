"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";

export function VideoFeatureSection() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="bg-ink">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
        <Reveal>
          <p className="kicker mb-3">{t("story.kicker")}</p>
          <h2 className="font-serif font-semibold text-3xl md:text-4xl tracking-tight text-white leading-tight">
            {t("video.title")}
          </h2>
          <p className="text-white/60 mt-4 max-w-sm leading-relaxed">{t("story.sub")}</p>
          <button
            type="button"
            onClick={toggle}
            className="mt-7 inline-flex items-center gap-3 text-white font-bold text-[15px] hover:text-bred-light transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-bred flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {t("hero.cta2")}
          </button>
        </Reveal>

        <Reveal className="relative rounded-[1.75rem] overflow-hidden shadow-lift aspect-[16/10]">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${playing ? "" : "opacity-90"}`}
            muted
            loop
            playsInline
            preload="none"
            poster="/Video/posters/18102975-uhd-2160-3840-60fps.jpg"
          >
            <source src="/Video/gallery/18102975-uhd-2160-3840-60fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-bred/95 flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
            aria-label="Видеоны қосу"
          >
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
