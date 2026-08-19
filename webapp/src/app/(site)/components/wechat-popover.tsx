"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";

const WECHAT_ID = "gb890105";

export function WeChatPopover({
  triggerClassName,
  iconSize,
}: {
  triggerClassName: string;
  iconSize: number;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [copied, setCopied] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  function position() {
    const btn = btnRef.current;
    const pop = popRef.current;
    if (!btn || !pop) return;
    const margin = 12;
    const btnRect = btn.getBoundingClientRect();
    const popH = pop.offsetHeight;
    const popW = pop.offsetWidth;

    let top: number;
    const spaceBelow = window.innerHeight - btnRect.bottom;
    const spaceAbove = btnRect.top;
    if (spaceBelow >= popH + margin || spaceBelow >= spaceAbove) {
      top = Math.min(btnRect.bottom + margin, window.innerHeight - popH - margin);
    } else {
      top = btnRect.top - popH - margin;
    }
    top = Math.max(margin, top);

    let left = btnRect.left + btnRect.width / 2 - popW / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - popW - margin));

    setPos({ top, left });
  }

  useEffect(() => {
    if (!open) return;
    position();
    const onResize = () => position();
    window.addEventListener("resize", onResize);
    function onDocClick(e: MouseEvent) {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        e.target !== btnRef.current &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onDocClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — no-op, matches original's silent catch
    }
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-label="WeChat"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={triggerClassName}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M8.7 3.5C4.6 3.5 1.4 6.3 1.4 9.7c0 2 1 3.7 2.6 4.9l-.6 2 2.2-1.1c.8.2 1.4.3 2 .3h.5a5.6 5.6 0 01-.2-1.5c0-3.5 3.3-6.3 7.5-6.3h.4c-.6-3-3.9-4.5-7.1-4.5zm-2.6 3.9a1 1 0 110 2 1 1 0 010-2zm5.2 0a1 1 0 110 2 1 1 0 010-2z" />
          <path d="M16.1 9.9c-3.6 0-6.5 2.4-6.5 5.4s2.9 5.4 6.5 5.4c.6 0 1.2 0 1.7-.2l1.9.9-.5-1.7c1.3-1 2.1-2.3 2.1-3.9 0-3-2.9-5.4-6.5-5.4h.3zm-2.3 3.3a.85.85 0 110 1.7.85.85 0 010-1.7zm4.5 0a.85.85 0 110 1.7.85.85 0 010-1.7z" />
        </svg>
      </button>
      <div
        ref={popRef}
        style={open ? { top: pos.top, left: pos.left } : undefined}
        className={`${open ? "" : "hidden"} fixed w-64 bg-white rounded-2xl shadow-lift p-5 text-center z-[160]`}
      >
        <Image
          src="/logo/wechat-qr.jpg"
          alt="WeChat QR коды"
          width={160}
          height={160}
          className="w-40 h-40 mx-auto rounded-lg object-cover border border-line"
        />
        <p className="text-ink font-bold text-sm mt-3">{t("wechat.title")}</p>
        <p className="text-muted text-xs mt-1">{t("wechat.sub")}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            copyId();
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 border border-line rounded-xl py-2 text-sm font-semibold text-ink hover:border-bred/50 transition-colors"
        >
          <span>{copied ? t("wechat.copied") : `ID: ${WECHAT_ID}`}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
