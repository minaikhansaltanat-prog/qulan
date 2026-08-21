"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useVideoModal } from "./video-modal-context";
import { Reveal } from "./reveal";

const HERO_VIDEOS = [
  "/Video/web/12139819-1440-2560-30fps.mp4",
  "/Video/web/12374022-uhd-2160-3840-30fps.mp4",
  "/Video/web/13596083-2160-3840-30fps.mp4",
  "/Video/web/13606836-1080-1920-30fps.mp4",
  "/Video/web/14904296-1080-1920-60fps.mp4",
  "/Video/web/15683017-1080-1920-60fps.mp4",
  "/Video/web/18102975-uhd-2160-3840-60fps.mp4",
];
const HERO_POSTERS = [
  "/Video/posters/12139819-1440-2560-30fps.jpg",
  "/Video/posters/12374022-uhd-2160-3840-30fps.jpg",
  "/Video/posters/13596083-2160-3840-30fps.jpg",
  "/Video/posters/13606836-1080-1920-30fps.jpg",
  "/Video/posters/14904296-1080-1920-60fps.jpg",
  "/Video/posters/15683017-1080-1920-60fps.jpg",
  "/Video/posters/18102975-uhd-2160-3840-60fps.jpg",
];

// Real opening banner: Kuan's own Shanghai photo (same asset used in the
// founder card and the Destinations "Шанхай" tile) — shown bright and
// unfiltered for the first 2s, matching the reference mockup's editorial
// hero-photo composition, then crossfades into the video carousel.
const HERO_INTRO_PHOTO = "/Photo/web/whatsapp-image-2026-08-17-at-23-50-28-2.jpg";

export function Hero() {
  const { t } = useI18n();
  const { openVideo } = useVideoModal();
  const [heroIndex, setHeroIndex] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setIntroVisible(false);
      return;
    }
    const introTimeout = setTimeout(() => setIntroVisible(false), 2000);
    return () => clearTimeout(introTimeout);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    function startCycle() {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setHeroIndex((i) => (i + 1) % HERO_VIDEOS.length);
      }, 5000);
    }
    function stopCycle() {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    startCycle();
    videoRefs.current.forEach((v) => v?.play().catch(() => {}));

    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCycle();
          videoRefs.current.forEach((v) => v?.play().catch(() => {}));
        } else {
          stopCycle();
          videoRefs.current.forEach((v) => v?.pause());
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => {
      stopCycle();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    videoRefs.current[heroIndex]?.play().catch(() => {});
  }, [heroIndex]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden bg-ink"
    >
      <div className="absolute inset-0">
        {HERO_VIDEOS.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className={`hero-video ${i === heroIndex ? "is-active" : ""}`}
            muted
            loop
            playsInline
            preload={i < 2 ? "auto" : "metadata"}
            poster={HERO_POSTERS[i]}
            src={src}
          />
        ))}
      </div>
      <Image
        src={HERO_INTRO_PHOTO}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`hero-video ${introVisible ? "is-active" : ""}`}
        aria-hidden="true"
      />
      {/* Slightly richer scrim than the original — the redesign leans on a
          deeper red-black gradient instead of flat ink, so the CHINA
          wordmark's red/gold split has enough contrast to read as premium
          rather than washed out. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(17,17,17,.90) 0%, rgba(35,15,13,.72) 30%, rgba(17,17,17,.22) 62%, rgba(17,17,17,0) 82%)",
        }}
      />
      <div className="absolute inset-0 hero-scrim-b"></div>

      <div className="relative z-10 max-w-[1360px] mx-auto w-full px-5 md:px-8 pb-10 md:pb-0 pt-32 md:pt-24">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <Reveal className="glass-dark md:bg-transparent md:backdrop-blur-0 rounded-3xl p-6 md:p-0 max-w-2xl">
            <p className="kicker text-white/90 mb-4">{t("hero.kicker")}</p>

            {/* CHINA wordmark — the reference's central art-direction move.
                Split-color treatment (deep red → gold) instead of a flat
                gradient, matching the brand's existing red/gold palette. */}
            <p
              className="font-serif font-bold leading-[0.9] tracking-tight text-[4.2rem] sm:text-[6rem] md:text-[7.5rem]"
              aria-hidden="true"
            >
              <span className="text-bred-light">{t("hero.wordmark_1")}</span>
              <span className="text-bgold-light">{t("hero.wordmark_2")}</span>
            </p>

            <h1 className="sr-only">
              {t("hero.h1_1")} {t("hero.h1_2")} {t("hero.h1_3")}
            </h1>

            <p className="mt-3 text-white/90 text-sm md:text-base font-semibold tracking-[0.14em] uppercase max-w-lg">
              {t("hero.tagline")}
            </p>
            <p className="mt-5 text-white/80 text-base md:text-lg max-w-lg leading-relaxed">{t("hero.sub")}</p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a href="#tours" className="btn btn-primary rounded-full px-7 py-4 text-[15px]">
                {t("hero.cta1")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => openVideo(HERO_VIDEOS[5])}
                className="btn btn-ghost !text-white hover:!text-bgold-light text-[15px]"
              >
                <span className="w-11 h-11 rounded-full border border-white/50 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>{t("hero.cta2")}</span>
              </button>
            </div>

            {/* Real trust fact (87,600+ Instagram followers, Meta Verified) —
                not the reference's invented "1000+ saved travellers" chip. */}
            <div className="mt-7 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 pl-2 pr-4 py-2 max-w-full">
              <span className="inline-flex items-center gap-2.5 shrink-0 whitespace-nowrap">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bred text-white shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-white text-[13px] font-bold">87 600+</span>
              </span>
              <span className="text-white/70 text-[13px]">{t("trust.d1")}</span>
            </div>
          </Reveal>

          <Reveal as="aside" className="glass-light rounded-3xl shadow-glow p-6 w-full lg:w-[320px] shrink-0">
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-line">
              <Image
                src="/Photo/web/whatsapp-image-2026-08-17-at-23-50-28-2.jpg"
                alt="Куан — Quan Travel негізін қалаушы"
                width={56}
                height={56}
                className="size-14 rounded-full object-cover object-top ring-2 ring-bgold/40"
              />
              <div>
                <p className="font-bold text-[15px] leading-tight">Куан</p>
                <p className="text-[13px] text-muted mt-0.5">Негізін қалаушы · жеке гид</p>
              </div>
            </div>
            <ul className="space-y-5">
              <li className="flex gap-3.5 items-start">
                <span className="w-10 h-10 rounded-xl bg-bred/10 text-bred flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-[15px]">{t("trust.t1")}</p>
                  <p className="text-sm text-muted mt-0.5">{t("trust.d1")}</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <span className="w-10 h-10 rounded-xl bg-bgold/10 text-bgold flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-[15px]">{t("trust.t2")}</p>
                  <p className="text-sm text-muted mt-0.5">{t("trust.d2")}</p>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <span className="w-10 h-10 rounded-xl bg-bgreen/10 text-bgreen flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.7" />
                    <rect x="3" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
                    <rect x="17" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
                <div>
                  <p className="font-bold text-[15px]">{t("trust.t3")}</p>
                  <p className="text-sm text-muted mt-0.5">{t("trust.d3")}</p>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="absolute z-10 bottom-5 right-5 md:right-8 flex gap-1.5">
        {HERO_VIDEOS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setHeroIndex(i)}
            aria-label={`Слайд ${i + 1}`}
            className={`w-6 h-1.5 rounded-full transition-colors ${i === heroIndex ? "bg-white" : "bg-white/35"}`}
          />
        ))}
      </div>
    </section>
  );
}
