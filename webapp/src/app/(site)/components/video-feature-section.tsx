"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n-context";

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
    <section className="relative bg-ink">
      <div className="relative aspect-[16/10] md:aspect-[21/9] w-full overflow-hidden">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${playing ? "" : "opacity-80"}`}
          muted
          loop
          playsInline
          preload="none"
          poster="/Video/posters/18102975-uhd-2160-3840-60fps.jpg"
        >
          <source src="/Video/gallery/18102975-uhd-2160-3840-60fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-serif font-semibold text-3xl md:text-6xl text-white max-w-3xl">{t("video.title")}</h2>
          <button
            type="button"
            onClick={toggle}
            className="mt-8 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
            aria-label="Видеоны қосу"
          >
            {playing ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#111" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#111" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
