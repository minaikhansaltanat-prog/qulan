"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addExternalVideo } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-9 shrink-0 rounded-lg bg-bgreen px-4 text-[13px] font-semibold text-paper transition-colors
                 hover:not-disabled:bg-bgreen-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Қосылуда..." : "Сілтеме қосу"}
    </button>
  );
}

export function ExternalVideoForm() {
  const [state, formAction] = useActionState(addExternalVideo, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="ext-url" className="text-[13px] font-medium text-ink">
          YouTube / Vimeo / Instagram сілтемесі
        </label>
        <input
          id="ext-url"
          name="url"
          type="url"
          required
          placeholder="https://youtube.com/watch?v=..."
          className="h-9 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="ext-alt" className="text-[13px] font-medium text-ink">
          Alt-мәтін
        </label>
        <input
          id="ext-alt"
          name="altText"
          required
          className="h-9 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <SubmitButton />
      {state?.error && (
        <p role="alert" className="text-[13px] text-bred-dark">
          {state.error}
        </p>
      )}
    </form>
  );
}
