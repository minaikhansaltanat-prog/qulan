"use client";

import { useI18n } from "@/lib/i18n-context";
import { Reveal } from "./reveal";
import { useCarouselNav, CarouselButtons } from "./carousel";
import { useVideoModal } from "./video-modal-context";

const GALLERY_PHOTOS = [
  "whatsapp-image-2026-08-17-at-23-50-15",
  "whatsapp-image-2026-08-17-at-23-50-15-1",
  "whatsapp-image-2026-08-17-at-23-50-25",
  "whatsapp-image-2026-08-17-at-23-50-25-1",
  "whatsapp-image-2026-08-17-at-23-50-26",
  "whatsapp-image-2026-08-17-at-23-50-26-1",
  "whatsapp-image-2026-08-17-at-23-50-26-2",
  "whatsapp-image-2026-08-17-at-23-50-27",
  "whatsapp-image-2026-08-17-at-23-50-27-1",
  "whatsapp-image-2026-08-17-at-23-50-28",
  "whatsapp-image-2026-08-17-at-23-50-28-1",
  "whatsapp-image-2026-08-17-at-23-50-28-2",
  "chenyang1912-hjf36lehxy8-unsplash",
  "emanuele-bono-kotsedzmw9w-unsplash",
  "hao-fan-ktzp-z7c3hg-unsplash",
  "jakub-tomasik-tl59z1dqcfk-unsplash",
  "joylynn-goh-v0zuvtsp47e-unsplash",
  "sergio-kian-ghy74n6fwg-unsplash",
  "sergio-kian-np-zf7h7c2c-unsplash",
  "sergio-kian-tpyud2-lupc-unsplash",
  "sergio-kian-zuzs8f1rmys-unsplash",
  "texco-kwok-f-pfrx7sy4k-unsplash",
  "zheng-xue-2gx9-r6i-ro-unsplash",
  "zheng-xue-b-altawygn0-unsplash",
  "zheng-xue-fefdobuw7i4-unsplash",
  "zheng-xue-ltoq3n1hwxc-unsplash",
  "zheng-xue-qs4ek7lkog-unsplash",
];

const GALLERY_VIDEOS = [
  "12139819-1440-2560-30fps",
  "12374022-uhd-2160-3840-30fps",
  "13596083-2160-3840-30fps",
  "13606836-1080-1920-30fps",
  "14904296-1080-1920-60fps",
  "15683017-1080-1920-60fps",
  "18102975-uhd-2160-3840-60fps",
  "5996220-hd-1920-1080-30fps",
];

export function GallerySection() {
  const { t } = useI18n();
  const { openVideo } = useVideoModal();
  const photoNav = useCarouselNav();
  const videoNav = useCarouselNav();

  return (
    <>
      <section id="gallery" className="py-20 md:py-28 bg-white">
        <div className="max-w-[1360px] mx-auto">
          <Reveal className="px-5 md:px-8 mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker mb-3">{t("pgallery.kicker")}</p>
              <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("pgallery.title")}</h2>
            </div>
            <CarouselButtons goPrev={photoNav.goPrev} goNext={photoNav.goNext} />
          </Reveal>
          <div ref={photoNav.ref} className="carousel gap-4 px-5 md:px-8">
            {GALLERY_PHOTOS.map((name, i) => (
              <figure key={name} className="w-[240px] sm:w-[280px] h-[340px] rounded-2xl overflow-hidden shadow-card img-zoom bg-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/Photo/web/${name}.jpg`} alt={`${t("gallery.alt")} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-paper">
        <div className="max-w-[1360px] mx-auto">
          <Reveal className="px-5 md:px-8 mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker mb-3">{t("vgallery.kicker")}</p>
              <h2 className="font-serif font-semibold text-3xl md:text-5xl tracking-tight">{t("vgallery.title")}</h2>
            </div>
            <CarouselButtons goPrev={videoNav.goPrev} goNext={videoNav.goNext} />
          </Reveal>
          <div ref={videoNav.ref} className="carousel gap-4 px-5 md:px-8">
            {GALLERY_VIDEOS.map((name, i) => (
              <div
                key={name}
                onClick={() => openVideo(`/Video/gallery/${name}.mp4`)}
                className="relative w-[220px] sm:w-[260px] h-[380px] rounded-2xl overflow-hidden shadow-card bg-ink group cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/Video/posters/${name}.jpg`}
                  alt={`${t("video.alt")} ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/25 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lift">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#111" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
