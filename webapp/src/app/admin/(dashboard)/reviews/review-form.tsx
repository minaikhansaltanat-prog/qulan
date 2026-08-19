"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { requestReviewMediaUploadUrl } from "./actions";
import { mediaProxyUrl } from "@/lib/s3-client";
import type { ReviewType } from "@/generated/prisma/enums";

const TYPE_LABELS: Record<ReviewType, string> = { VIDEO: "Видео", TEXT: "Жазбаша", AUDIO: "Аудио" };

type ReviewFormValues = {
  clientName: string;
  clientPhotoKey: string | null;
  type: ReviewType;
  textContent: string;
  mediaKey: string | null;
  rating: number;
  tourId: string;
  isPublished: boolean;
  isFeatured: boolean;
};

const EMPTY: ReviewFormValues = {
  clientName: "",
  clientPhotoKey: null,
  type: "TEXT",
  textContent: "",
  mediaKey: null,
  rating: 5,
  tourId: "",
  isPublished: false,
  isFeatured: false,
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-lg bg-bred px-6 text-[14px] font-semibold text-paper transition-colors
                 hover:not-disabled:bg-bred-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Сақталуда..." : label}
    </button>
  );
}

export function ReviewForm({
  action,
  initial,
  submitLabel,
  tours,
}: {
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string }>;
  initial?: Partial<ReviewFormValues>;
  submitLabel: string;
  tours: { id: string; title: string }[];
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [values, setValues] = useState<ReviewFormValues>({ ...EMPTY, ...initial });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaFileName, setMediaFileName] = useState<string | null>(initial?.mediaKey ? "Жүктелген файл" : null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function set<K extends keyof ReviewFormValues>(key: K, value: ReviewFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set("clientPhotoKey", data.key);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Жүктеу қатесі");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaUploading(true);
    setUploadError(null);
    try {
      const { error, key, uploadUrl } = await requestReviewMediaUploadUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });
      if (error || !uploadUrl || !key) throw new Error(error ?? "Сілтеме алу сәтсіз");

      const putRes = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!putRes.ok) throw new Error("Файл қоймаға жүктелмеді");

      set("mediaKey", key);
      setMediaFileName(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Жүктеу қатесі");
    } finally {
      setMediaUploading(false);
    }
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="clientName" className="text-[13px] font-medium text-ink">
          Клиент аты
        </label>
        <input
          id="clientName"
          name="clientName"
          required
          value={values.clientName}
          onChange={(e) => set("clientName", e.target.value)}
          className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>

      <div className="flex items-center gap-4">
        {values.clientPhotoKey && (
          <Image
            src={mediaProxyUrl(values.clientPhotoKey)}
            alt=""
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
            unoptimized
          />
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="clientPhoto" className="text-[13px] font-medium text-ink">
            Клиент фотосы (міндетті емес)
          </label>
          <input
            id="clientPhoto"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={avatarUploading}
            className="text-[13px] file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-bgreen file:px-3 file:text-[13px] file:font-medium file:text-paper hover:file:bg-bgreen-light"
          />
        </div>
      </div>
      <input type="hidden" name="clientPhotoKey" value={values.clientPhotoKey ?? ""} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-[13px] font-medium text-ink">
            Пікір түрі
          </label>
          <select
            id="type"
            name="type"
            value={values.type}
            onChange={(e) => set("type", e.target.value as ReviewType)}
            className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          >
            {(Object.keys(TYPE_LABELS) as ReviewType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rating" className="text-[13px] font-medium text-ink">
            Рейтинг
          </label>
          <select
            id="rating"
            name="rating"
            value={values.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
            className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {"★".repeat(r)}
                {"☆".repeat(5 - r)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {values.type === "TEXT" ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="textContent" className="text-[13px] font-medium text-ink">
            Пікір мәтіні
          </label>
          <textarea
            id="textContent"
            name="textContent"
            rows={4}
            value={values.textContent}
            onChange={(e) => set("textContent", e.target.value)}
            className="rounded-lg border border-line bg-white px-3 py-2 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="media" className="text-[13px] font-medium text-ink">
            {values.type === "VIDEO" ? "Видео файл (≤200 МБ)" : "Аудио файл (≤200 МБ)"}
          </label>
          <input
            id="media"
            type="file"
            accept={values.type === "VIDEO" ? "video/*" : "audio/*"}
            onChange={handleMediaChange}
            disabled={mediaUploading}
            className="text-[13px] file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-bgreen file:px-3 file:text-[13px] file:font-medium file:text-paper hover:file:bg-bgreen-light"
          />
          {mediaUploading && <p className="text-[13px] text-muted">Жүктелуде...</p>}
          {mediaFileName && !mediaUploading && <p className="text-[13px] text-bgreen">✓ {mediaFileName}</p>}
        </div>
      )}
      <input type="hidden" name="mediaKey" value={values.mediaKey ?? ""} />
      <input type="hidden" name="textContent" value={values.type === "TEXT" ? values.textContent : ""} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tourId" className="text-[13px] font-medium text-ink">
          Байланысты тур (міндетті емес)
        </label>
        <select
          id="tourId"
          name="tourId"
          value={values.tourId}
          onChange={(e) => set("tourId", e.target.value)}
          className="h-11 max-w-sm rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        >
          <option value="">— Жоқ —</option>
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-[14px] text-ink">
          <input
            type="checkbox"
            name="isPublished"
            checked={values.isPublished}
            onChange={(e) => set("isPublished", e.target.checked)}
            className="size-4 accent-bgreen"
          />
          Жариялау
        </label>
        <label className="flex items-center gap-2 text-[14px] text-ink">
          <input
            type="checkbox"
            name="isFeatured"
            checked={values.isFeatured}
            onChange={(e) => set("isFeatured", e.target.checked)}
            className="size-4 accent-bgold"
          />
          Ұсынылған
        </label>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} />
        {(state?.error || uploadError) && (
          <p role="alert" className="text-[13px] text-bred-dark">
            {state?.error || uploadError}
          </p>
        )}
      </div>
    </form>
  );
}
