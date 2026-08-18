"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-bred font-body text-[15px] font-semibold text-paper
                 shadow-[0_8px_20px_-6px_rgba(159,43,37,0.55)] transition-transform duration-150 ease-out
                 hover:not-disabled:-translate-y-px hover:not-disabled:bg-bred-light
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                 active:not-disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Кіру..." : "Кіру"}
    </button>
  );
}
