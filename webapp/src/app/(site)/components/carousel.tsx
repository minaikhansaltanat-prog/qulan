"use client";

import { useEffect, useRef } from "react";

function cardStep(el: HTMLElement): number {
  const first = el.firstElementChild as HTMLElement | null;
  if (!first) return 320;
  const style = getComputedStyle(el);
  const gap = parseFloat(style.columnGap || style.gap || "24");
  return first.getBoundingClientRect().width + gap;
}

/** Shared carousel scroll/wrap behavior. Attach `ref` to the scrolling
 * container; `goPrev`/`goNext` drive it from buttons placed anywhere
 * (some sections put them next to the heading, others below the strip). */
export function useCarouselNav() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let wrapTimer: ReturnType<typeof setTimeout>;
    function onScroll() {
      clearTimeout(wrapTimer);
      wrapTimer = setTimeout(() => {
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 4 && el.scrollLeft >= maxScroll - 4) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 900);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(wrapTimer);
    };
  }, []);

  function go(direction: "prev" | "next") {
    const el = ref.current;
    if (!el) return;
    const step = cardStep(el);
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (direction === "next") {
      if (el.scrollLeft >= maxScroll - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: step, behavior: "smooth" });
    } else {
      if (el.scrollLeft <= 4) el.scrollTo({ left: maxScroll, behavior: "smooth" });
      else el.scrollBy({ left: -step, behavior: "smooth" });
    }
  }

  return { ref, goPrev: () => go("prev"), goNext: () => go("next") };
}

export function CarouselButtons({
  goPrev,
  goNext,
  className = "",
}: {
  goPrev: () => void;
  goNext: () => void;
  className?: string;
}) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <button type="button" onClick={goPrev} className="car-btn" aria-label="Алдыңғы">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" onClick={goNext} className="car-btn" aria-label="Келесі">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
