"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveWhyBlock } from "./actions";
import type { WhyContent } from "@/lib/homepage-blocks";

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

export function WhyBlockForm({ initial }: { initial: WhyContent }) {
  const [state, formAction] = useActionState(saveWhyBlock, undefined);
  const [cards, setCards] = useState(initial.cards);
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor="why-kicker" className="text-[13px] font-medium text-ink">
          Кішкентай айдар
        </label>
        <input
          id="why-kicker"
          name="kicker"
          defaultValue={initial.kicker}
          className="h-10 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="why-title" className="text-[13px] font-medium text-ink">
          Тақырып
        </label>
        <input
          id="why-title"
          name="title"
          defaultValue={initial.title}
          className="h-10 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="why-subtitle" className="text-[13px] font-medium text-ink">
          Түсіндірме мәтін
        </label>
        <textarea
          id="why-subtitle"
          name="subtitle"
          defaultValue={initial.subtitle}
          rows={2}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-ink">УТП-карточкалар</p>
        {cards.map((card, i) => (
          <div key={i} className="rounded-lg border border-line p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-muted">{i + 1}-карточка</span>
              <button
                type="button"
                onClick={() => setCards(cards.filter((_, j) => j !== i))}
                className="text-[13px] text-bred-dark hover:underline"
              >
                Жою
              </button>
            </div>
            <input
              value={card.title}
              onChange={(e) => setCards(cards.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)))}
              placeholder="Карточка тақырыбы"
              className="mt-2 h-9 w-full rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                         focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
            />
            <textarea
              value={card.description}
              onChange={(e) =>
                setCards(cards.map((c, j) => (j === i ? { ...c, description: e.target.value } : c)))
              }
              placeholder="Сипаттама"
              rows={2}
              className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-[14px] outline-none
                         focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCards([...cards, { title: "", description: "" }])}
          className="self-start text-[13px] font-medium text-bgreen hover:underline"
        >
          + Карточка қосу
        </button>
      </div>
      <input type="hidden" name="cards" value={JSON.stringify(cards)} />

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
