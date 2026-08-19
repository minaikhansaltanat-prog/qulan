"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { WeChatPopover } from "./wechat-popover";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-bgreen-dark bg-[#0F1E17] text-white pt-16 pb-8">
      <div className="max-w-[1360px] mx-auto px-5 md:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2">
            <Image src="/logo/logo.png" alt="Quan Travel" width={160} height={40} className="h-10 w-auto object-contain brightness-0 invert opacity-95" />
            <p className="text-white/55 text-sm mt-5 max-w-xs leading-relaxed">{t("footer.desc")}</p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/quan_travel_/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg,#405DE6,#833AB4,#C13584,#E1306C,#FD1D1D,#F77737,#FCAF45)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="white" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" />
                  <circle cx="17.3" cy="6.7" r="1.1" fill="white" />
                </svg>
              </a>
              {/* TODO: replace with the real YouTube link when provided */}
              <a href="#" target="_blank" rel="noopener" aria-label="YouTube" className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M9.3 8.4v7.2l6.4-3.6-6.4-3.6z" />
                </svg>
              </a>
              <a href="https://wa.me/77479545771" target="_blank" rel="noopener" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.2c-.24.68-1.4 1.3-1.94 1.35-.5.06-1.1.1-3.4-.72-2.86-1.02-4.68-3.9-4.83-4.08-.14-.18-1.15-1.52-1.15-2.9s.72-2.05.98-2.33c.24-.27.53-.34.7-.34h.5c.16 0 .38-.03.58.44.24.56.8 1.95.87 2.09.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.28.7 1.16 1.52 1.88 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.16-.18.68-.8.87-1.07.18-.28.36-.23.6-.14.25.09 1.6.75 1.87.89.27.14.45.2.51.32.07.12.07.68-.16 1.36z" />
                </svg>
              </a>
              {/* TODO: replace with the real Telegram link when provided */}
              <a href="#" target="_blank" rel="noopener" aria-label="Telegram" className="w-10 h-10 rounded-full bg-[#26A5E4] flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M21.9 4.3L2.5 11.9c-1 .4-1 1.7.1 2l4.6 1.4 1.8 5.6c.2.7 1.1.9 1.6.3l2.6-2.8 4.9 3.6c.7.5 1.7.1 1.9-.7l3.5-15.6c.2-.9-.7-1.7-1.6-1.4zM8.5 14.8l9.4-7c.3-.2.6.2.3.4l-7.8 7.5-.3 3.3-1.6-4.2z" />
                </svg>
              </a>
              <WeChatPopover
                triggerClassName="w-10 h-10 rounded-full bg-[#07C160] flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                iconSize={17}
              />
            </div>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-wider text-white/40 mb-4">{t("footer.h_tours")}</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#tours" className="hover:text-white transition-colors">{t("footer.l_tours")}</a></li>
              <li><a href="#destinations" className="hover:text-white transition-colors">{t("footer.l_dest")}</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">{t("footer.l_gallery")}</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-wider text-white/40 mb-4">{t("footer.h_company")}</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#about" className="hover:text-white transition-colors">{t("footer.l_about")}</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">{t("footer.l_reviews")}</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-wider text-white/40 mb-4">{t("footer.h_contact")}</p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="tel:+77479545771" className="hover:text-white transition-colors">+7 747 954 57 71</a></li>
              <li><a href="https://wa.me/77479545771" target="_blank" rel="noopener" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="https://www.instagram.com/quan_travel_/" target="_blank" rel="noopener" className="hover:text-white transition-colors">Instagram · @quan_travel_</a></li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <Image src="/logo/wechat-qr.jpg" alt="WeChat QR коды" width={80} height={80} className="w-20 h-20 rounded-lg object-cover border border-white/15 shrink-0" />
              <div>
                <p className="text-white/85 text-xs font-bold flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#07C160" aria-hidden="true">
                    <path d="M8.7 3.5C4.6 3.5 1.4 6.3 1.4 9.7c0 2 1 3.7 2.6 4.9l-.6 2 2.2-1.1c.8.2 1.4.3 2 .3h.5a5.6 5.6 0 01-.2-1.5c0-3.5 3.3-6.3 7.5-6.3h.4c-.6-3-3.9-4.5-7.1-4.5zm-2.6 3.9a1 1 0 110 2 1 1 0 010-2zm5.2 0a1 1 0 110 2 1 1 0 010-2z" />
                    <path d="M16.1 9.9c-3.6 0-6.5 2.4-6.5 5.4s2.9 5.4 6.5 5.4c.6 0 1.2 0 1.7-.2l1.9.9-.5-1.7c1.3-1 2.1-2.3 2.1-3.9 0-3-2.9-5.4-6.5-5.4h.3zm-2.3 3.3a.85.85 0 110 1.7.85.85 0 010-1.7zm4.5 0a.85.85 0 110 1.7.85.85 0 010-1.7z" />
                  </svg>
                  WeChat
                </p>
                <p className="text-white/50 text-[11px] mt-1.5 leading-relaxed">{t("footer.wechat_caption")}</p>
                <p className="text-white/40 text-[11px] mt-0.5">ID: gb890105</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.legal")}</p>
        </div>
      </div>
    </footer>
  );
}
