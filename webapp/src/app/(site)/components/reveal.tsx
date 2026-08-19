"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

/**
 * Port of the static site's `[data-reveal]` + GSAP ScrollTrigger fade-up.
 * GSAP was only ever used for this one effect (see index.html's "SCROLL
 * REVEAL" block), so a plain IntersectionObserver replaces it here instead
 * of pulling in the GSAP/ScrollTrigger CDN scripts.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
