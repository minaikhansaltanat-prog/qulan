"use client";

import { deleteTour, moveTour } from "./actions";

export function TourRowActions({
  id,
  isFirst,
  isLast,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <form action={moveTour.bind(null, id, "up")}>
        <button
          type="submit"
          disabled={isFirst}
          aria-label="Жоғары жылжыту"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors
                     hover:not-disabled:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↑
        </button>
      </form>
      <form action={moveTour.bind(null, id, "down")}>
        <button
          type="submit"
          disabled={isLast}
          aria-label="Төмен жылжыту"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors
                     hover:not-disabled:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-30"
        >
          ↓
        </button>
      </form>
      <form
        action={deleteTour.bind(null, id)}
        onSubmit={(event) => {
          if (!window.confirm("Бұл турды жою керек пе? Әрекетті қайтару мүмкін емес.")) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="h-8 rounded-md border border-bred-light/40 px-3 text-[13px] font-medium text-bred-dark transition-colors
                     hover:bg-bred/10"
        >
          Жою
        </button>
      </form>
    </div>
  );
}
