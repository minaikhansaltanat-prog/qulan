"use client";

import { useEffect, useRef, useState } from "react";
import { WeChatPopover } from "./wechat-popover";

export function Fab() {
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div ref={fabRef} className={`fixed z-[150] bottom-5 right-5 md:bottom-8 md:right-8 flex flex-col items-end gap-3 ${open ? "fab-open" : ""}`}>
      <div className="fab-item">
        <WeChatPopover
          triggerClassName="w-12 h-12 rounded-full bg-[#07C160] shadow-lift flex items-center justify-center"
          iconSize={22}
        />
      </div>
      {/* TODO: replace with the real Telegram link when provided */}
      <a
        href="#"
        target="_blank"
        rel="noopener"
        className="fab-item w-12 h-12 rounded-full bg-[#26A5E4] shadow-lift flex items-center justify-center"
        aria-label="Telegram"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M21.9 4.3L2.5 11.9c-1 .4-1 1.7.1 2l4.6 1.4 1.8 5.6c.2.7 1.1.9 1.6.3l2.6-2.8 4.9 3.6c.7.5 1.7.1 1.9-.7l3.5-15.6c.2-.9-.7-1.7-1.6-1.4zM8.5 14.8l9.4-7c.3-.2.6.2.3.4l-7.8 7.5-.3 3.3-1.6-4.2z" />
        </svg>
      </a>
      <a
        href="https://wa.me/77479545771"
        target="_blank"
        rel="noopener"
        className="fab-item w-12 h-12 rounded-full bg-[#25D366] shadow-lift flex items-center justify-center"
        aria-label="WhatsApp"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.2c-.24.68-1.4 1.3-1.94 1.35-.5.06-1.1.1-3.4-.72-2.86-1.02-4.68-3.9-4.83-4.08-.14-.18-1.15-1.52-1.15-2.9s.72-2.05.98-2.33c.24-.27.53-.34.7-.34h.5c.16 0 .38-.03.58.44.24.56.8 1.95.87 2.09.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.28.7 1.16 1.52 1.88 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.16-.18.68-.8.87-1.07.18-.28.36-.23.6-.14.25.09 1.6.75 1.87.89.27.14.45.2.51.32.07.12.07.68-.16 1.36z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-bgold to-bgreen shadow-lift flex items-center justify-center"
        aria-label="Байланыс арналары"
      >
        <span className="fab-pulse bg-bgold/40"></span>
        <span className="fab-pulse p2 bg-bgreen/40"></span>
        <svg className="fab-plus relative z-10" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
