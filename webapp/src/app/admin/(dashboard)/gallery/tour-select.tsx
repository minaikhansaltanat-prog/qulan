"use client";

import { useTransition } from "react";
import { assignGalleryItemTour } from "./actions";

export function TourSelect({
  itemId,
  currentTourId,
  tours,
}: {
  itemId: string;
  currentTourId: string | null;
  tours: { id: string; title: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={currentTourId ?? ""}
      disabled={pending}
      onChange={(e) => startTransition(() => assignGalleryItemTour(itemId, e.target.value))}
      className="h-7 max-w-full rounded-md border border-paper/30 bg-ink/60 px-1.5 text-[11px] text-paper backdrop-blur-sm outline-none"
    >
      <option value="">Тур жоқ</option>
      {tours.map((t) => (
        <option key={t.id} value={t.id}>
          {t.title}
        </option>
      ))}
    </select>
  );
}
