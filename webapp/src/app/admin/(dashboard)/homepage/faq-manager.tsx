"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createFaq, deleteFaq, toggleFaqPublish } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-10 shrink-0 rounded-lg bg-bgreen px-4 text-[13px] font-semibold text-paper transition-colors
                 hover:not-disabled:bg-bgreen-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Қосылуда..." : "Сұрақ қосу"}
    </button>
  );
}

type FaqItem = { id: string; question: string; answer: string; isPublished: boolean };

export function FaqManager({ items }: { items: FaqItem[] }) {
  const [state, formAction] = useActionState(createFaq, undefined);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-line p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="faq-question" className="text-[13px] font-medium text-ink">
            Сұрақ
          </label>
          <input
            id="faq-question"
            name="question"
            required
            className="h-10 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="faq-answer" className="text-[13px] font-medium text-ink">
            Жауап
          </label>
          <textarea
            id="faq-answer"
            name="answer"
            required
            rows={2}
            className="rounded-lg border border-line bg-white px-3 py-2 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          />
        </div>
        <div className="flex items-center gap-3">
          <SubmitButton />
          {state?.error && (
            <p role="alert" className="text-[13px] text-bred-dark">
              {state.error}
            </p>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-line bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-medium text-ink">{item.question}</p>
                <p className="mt-1 text-[13px] text-muted">{item.answer}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <form action={toggleFaqPublish.bind(null, item.id)}>
                  <button
                    type="submit"
                    className={`h-8 rounded-md border px-2.5 text-[12px] font-medium transition-colors ${
                      item.isPublished ? "border-bgreen/40 bg-bgreen/10 text-bgreen" : "border-line text-muted hover:bg-paper-dim"
                    }`}
                  >
                    {item.isPublished ? "Жарияланды" : "Жасырын"}
                  </button>
                </form>
                <form
                  action={deleteFaq.bind(null, item.id)}
                  onSubmit={(e) => {
                    if (!window.confirm("Бұл сұрақты жою керек пе?")) e.preventDefault();
                  }}
                >
                  <button
                    type="submit"
                    className="h-8 rounded-md border border-bred-light/40 px-2.5 text-[12px] font-medium text-bred-dark hover:bg-bred/10"
                  >
                    Жою
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-[14px] text-muted">Әзірге сұрақ жоқ.</p>}
      </div>
    </div>
  );
}
