"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { requestVideoUploadUrl, confirmVideoUpload } from "./actions";

export function VideoUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    const altText = String(formData.get("altText") ?? "");
    if (!file?.size) {
      setError("Файлды таңдаңыз");
      return;
    }

    setPending(true);
    try {
      const { error: urlError, key, uploadUrl } = await requestVideoUploadUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });
      if (urlError || !uploadUrl || !key) {
        setError(urlError ?? "Жүктеу сілтемесін алу сәтсіз аяқталды");
        return;
      }

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!putRes.ok) {
        setError("Видео қоймаға жүктелмеді");
        return;
      }

      const confirmed = await confirmVideoUpload({ key, altText });
      if (confirmed.error) {
        setError(confirmed.error);
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
        <label htmlFor="video-file" className="text-[13px] font-medium text-ink">
          Видео файлы (≤200 МБ)
        </label>
        <input
          id="video-file"
          name="file"
          type="file"
          accept="video/*"
          required
          className="text-[13px] file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-bgreen file:px-3 file:text-[13px] file:font-medium file:text-paper hover:file:bg-bgreen-light"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="video-alt" className="text-[13px] font-medium text-ink">
          Alt-мәтін
        </label>
        <input
          id="video-alt"
          name="altText"
          required
          placeholder="Мысалы: Шанхай түнгі көрінісі"
          className="h-9 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-9 shrink-0 rounded-lg bg-bred px-4 text-[13px] font-semibold text-paper transition-colors
                   hover:not-disabled:bg-bred-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                   disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Жүктелуде..." : "Видео қосу"}
      </button>
      {error && (
        <p role="alert" className="text-[13px] text-bred-dark">
          {error}
        </p>
      )}
    </form>
  );
}
