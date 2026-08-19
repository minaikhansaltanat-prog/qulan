"use client";

import { deleteReview, togglePublish, toggleFeatured } from "./actions";

export function ReviewRowActions({
  id,
  isPublished,
  isFeatured,
}: {
  id: string;
  isPublished: boolean;
  isFeatured: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <form action={togglePublish.bind(null, id)}>
        <button
          type="submit"
          className="h-8 rounded-md border border-line px-2.5 text-[12px] font-medium text-ink transition-colors hover:bg-paper-dim"
        >
          {isPublished ? "Жасыру" : "Жариялау"}
        </button>
      </form>
      <form action={toggleFeatured.bind(null, id)}>
        <button
          type="submit"
          className={`h-8 rounded-md border px-2.5 text-[12px] font-medium transition-colors ${
            isFeatured ? "border-bgold bg-bgold/10 text-bgold" : "border-line text-ink hover:bg-paper-dim"
          }`}
        >
          {isFeatured ? "★ Ұсынылған" : "☆ Ұсыну"}
        </button>
      </form>
      <form
        action={deleteReview.bind(null, id)}
        onSubmit={(event) => {
          if (!window.confirm("Бұл пікірді жою керек пе?")) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="h-8 rounded-md border border-bred-light/40 px-2.5 text-[12px] font-medium text-bred-dark transition-colors hover:bg-bred/10"
        >
          Жою
        </button>
      </form>
    </div>
  );
}
