"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createAdminUser } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-lg bg-bgreen px-5 text-[14px] font-semibold text-paper transition-colors
                 hover:not-disabled:bg-bgreen-light
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Қосылуда..." : "Администратор қосу"}
    </button>
  );
}

export function CreateAdminForm() {
  const [state, formAction] = useActionState(createAdminUser, undefined);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-[13px] font-medium text-ink">
          Аты-жөні
        </label>
        <input
          id="name"
          name="name"
          required
          className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[13px] font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[13px] font-medium text-ink">
          Уақытша құпия сөз
        </label>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={8}
          className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <div className="sm:col-span-3 flex items-center gap-3">
        <SubmitButton />
        {state?.error && (
          <p role="alert" className="text-[13px] text-bred-dark">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
