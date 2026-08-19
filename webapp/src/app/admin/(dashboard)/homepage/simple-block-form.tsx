"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-10 rounded-lg bg-bred px-5 text-[13px] font-semibold text-paper transition-colors
                 hover:not-disabled:bg-bred-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Сақталуда..." : "Сақтау"}
    </button>
  );
}

export function SimpleBlockForm({
  action,
  fields,
  initial,
}: {
  action: (
    prevState: { error?: string; success?: boolean } | undefined,
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean }>;
  fields: { name: string; label: string; multiline?: boolean }[];
  initial: Record<string, string>;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setSavedFlash(true);
      const t = setTimeout(() => setSavedFlash(false), 2000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label htmlFor={field.name} className="text-[13px] font-medium text-ink">
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              id={field.name}
              name={field.name}
              defaultValue={initial[field.name] ?? ""}
              rows={3}
              className="rounded-lg border border-line bg-white px-3 py-2 text-[14px] outline-none
                         focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              defaultValue={initial[field.name] ?? ""}
              className="h-10 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                         focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <SubmitButton />
        {savedFlash && <span className="text-[13px] text-bgreen">✓ Сақталды</span>}
        {state?.error && (
          <p role="alert" className="text-[13px] text-bred-dark">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
