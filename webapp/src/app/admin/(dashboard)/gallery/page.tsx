import Image from "next/image";
import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { mediaProxyUrl } from "@/lib/s3";
import { PhotoUploadForm } from "./photo-upload-form";
import { VideoUploadForm } from "./video-upload-form";
import { ExternalVideoForm } from "./external-video-form";
import { DeleteItemButton } from "./delete-item-button";
import { TourSelect } from "./tour-select";

export default async function GalleryPage() {
  await requireModuleAccess("gallery");
  const [items, tours] = await Promise.all([
    prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.tour.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">
        Фото/видео галерея
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-[1.7] text-muted">
        Жалпы медиа кітапхана — сайттың «Фотогалерея» және «Видеогалерея» блоктарын осы жерден
        толтырасыз. Әр файлды турға тағайындауға болады (міндетті емес).
      </p>

      <div className="mt-8 space-y-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Фото қосу</h2>
        <PhotoUploadForm tours={tours} />
      </div>

      <div className="mt-4 space-y-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Видео жүктеу</h2>
        <VideoUploadForm tours={tours} />
      </div>

      <div className="mt-4 space-y-4 rounded-xl border border-line bg-white p-5">
        <h2 className="font-display text-[18px] text-ink">Немесе сыртқы видео сілтемесі</h2>
        <ExternalVideoForm tours={tours} />
      </div>

      {items.length === 0 ? (
        <p className="mt-10 text-[14px] text-muted">Әзірге медиафайл жоқ.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-paper-dim">
              {item.type === "PHOTO" && item.key ? (
                <Image
                  src={mediaProxyUrl(item.key)}
                  alt={item.altText}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  unoptimized
                />
              ) : item.type === "VIDEO" && item.source === "UPLOAD" && item.key ? (
                <video
                  src={mediaProxyUrl(item.key)}
                  className="h-full w-full object-cover"
                  muted
                  controls
                  preload="metadata"
                />
              ) : (
                <a
                  href={item.externalUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full flex-col items-center justify-center gap-2 bg-bgreen-dark p-4 text-center text-paper"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  <span className="text-[12px] leading-tight text-paper/80">{item.altText}</span>
                </a>
              )}
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <DeleteItemButton id={item.id} />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-ink/80 to-transparent px-2 pb-2 pt-4">
                <p className="truncate text-[11px] text-paper/90">{item.altText}</p>
                <div className="pointer-events-auto opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <TourSelect itemId={item.id} currentTourId={item.tourId} tours={tours} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
