"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type VideoModalContextValue = { openVideo: (src: string) => void };

const VideoModalContext = createContext<VideoModalContextValue | null>(null);

export function VideoModalProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = useCallback((s: string) => {
    setSrc(s);
    document.documentElement.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setSrc(null);
    document.documentElement.style.overflow = "";
  }, []);

  return (
    <VideoModalContext.Provider value={{ openVideo }}>
      {children}
      <div
        className={`fixed inset-0 z-[200] items-center justify-center bg-ink/90 p-4 backdrop-blur-sm ${src ? "flex" : "hidden"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          aria-label="Жабу"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {src && (
          <video
            ref={videoRef}
            src={src}
            className="max-w-full max-h-[85vh] rounded-2xl"
            controls
            playsInline
            autoPlay
          />
        )}
      </div>
    </VideoModalContext.Provider>
  );
}

export function useVideoModal() {
  const ctx = useContext(VideoModalContext);
  if (!ctx) throw new Error("useVideoModal must be used within VideoModalProvider");
  return ctx;
}
