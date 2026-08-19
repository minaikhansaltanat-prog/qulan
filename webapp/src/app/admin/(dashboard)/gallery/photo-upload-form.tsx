"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function PhotoUploadForm({ tours }: { tours: { id: string; title: string }[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    if (!(formData.get("file") as File)?.size) {
      setError("Файлды таңдаңыз");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/admin/media/photos", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Жүктеу сәтсіз аяқталды");
        return;
      }
      formRef.current?.reset();
      router.refresh();
    } catch {
      setError("Желі қатесі");
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="photo-file" className="text-[13px] font-medium text-ink">
          Сурет файлы
        </label>
        <input
          id="photo-file"
          name="file"
          type="file"
          accept="image/*"
          required
          className="text-[13px] file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-bgreen file:px-3 file:text-[13px] file:font-medium file:text-paper hover:file:bg-bgreen-light"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="photo-alt" className="text-[13px] font-medium text-ink">
          Alt-мәтін
        </label>
        <input
          id="photo-alt"
          name="altText"
          required
          placeholder="Мысалы: Чжанцзяцзе тау бағаны"
          className="h-9 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="photo-tour" className="text-[13px] font-medium text-ink">
          Тур (міндетті емес)
        </label>
        <select
          id="photo-tour"
          name="tourId"
          className="h-9 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
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
      <button
        type="submit"
        disabled={pending}
        className="h-9 shrink-0 rounded-lg bg-bred px-4 text-[13px] font-semibold text-paper transition-colors
                   hover:not-disabled:bg-bred-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                   disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Жүктелуде..." : "Фото қосу"}
      </button>
      {error && (
        <p role="alert" className="text-[13px] text-bred-dark">
          {error}
        </p>
      )}
    </form>
  );
}
