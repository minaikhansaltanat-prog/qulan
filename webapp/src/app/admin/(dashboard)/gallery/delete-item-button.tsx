"use client";

import { deleteGalleryItem } from "./actions";

export function DeleteItemButton({ id }: { id: string }) {
  return (
    <form
      action={deleteGalleryItem.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm("Бұл медиафайлды жою керек пе?")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label="Жою"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur-sm transition-colors
                   hover:bg-bred focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  );
}
