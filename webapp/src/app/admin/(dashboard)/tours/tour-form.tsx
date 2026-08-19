"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { DESTINATION_LABELS, AUDIENCE_LABELS, TOUR_STATUS_LABELS } from "@/lib/tour-labels";
import { slugify } from "@/lib/slug";
import type { Destination, TourAudience, TourStatus } from "@/generated/prisma/enums";

type ItineraryDay = { day: number; title: string; description: string };

type TourFormValues = {
  title: string;
  slogan: string;
  destinations: Destination[];
  durationDays: number;
  audience: TourAudience;
  priceTenge: number | null;
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  difficulty: string;
  status: TourStatus;
  seoTitle: string;
  seoDescription: string;
  slug: string;
};

const EMPTY: TourFormValues = {
  title: "",
  slogan: "",
  destinations: [],
  durationDays: 5,
  audience: "GROUP",
  priceTenge: null,
  includes: [],
  excludes: [],
  itinerary: [],
  difficulty: "",
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
  slug: "",
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-lg bg-bred px-6 text-[14px] font-semibold text-paper transition-colors
                 hover:not-disabled:bg-bred-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bgold
                 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Сақталуда..." : label}
    </button>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                   focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
      />
    </div>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-medium text-ink">{label}</p>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
            placeholder={placeholder}
            className="h-10 flex-1 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="Жою"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-muted hover:bg-paper-dim"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="self-start text-[13px] font-medium text-bgreen hover:underline"
      >
        + Жол қосу
      </button>
    </div>
  );
}

function ItineraryEditor({ days, onChange }: { days: ItineraryDay[]; onChange: (days: ItineraryDay[]) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] font-medium text-ink">Күн-күнге бағдарлама</p>
      {days.map((d, i) => (
        <div key={i} className="rounded-lg border border-line p-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ink">{i + 1}-күн</span>
            <button
              type="button"
              onClick={() => onChange(days.filter((_, j) => j !== i).map((day, j) => ({ ...day, day: j + 1 })))}
              aria-label="Күнді жою"
              className="text-[13px] text-bred-dark hover:underline"
            >
              Жою
            </button>
          </div>
          <input
            value={d.title}
            onChange={(e) => onChange(days.map((day, j) => (j === i ? { ...day, title: e.target.value } : day)))}
            placeholder="Күннің тақырыбы"
            className="mt-2 h-10 w-full rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          />
          <textarea
            value={d.description}
            onChange={(e) =>
              onChange(days.map((day, j) => (j === i ? { ...day, description: e.target.value } : day)))
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
        onClick={() => onChange([...days, { day: days.length + 1, title: "", description: "" }])}
        className="self-start text-[13px] font-medium text-bgreen hover:underline"
      >
        + Күн қосу
      </button>
    </div>
  );
}

export function TourForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string }>;
  initial?: Partial<TourFormValues>;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [values, setValues] = useState<TourFormValues>({ ...EMPTY, ...initial });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  function set<K extends keyof TourFormValues>(key: K, value: TourFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleDestination(d: Destination) {
    set(
      "destinations",
      values.destinations.includes(d) ? values.destinations.filter((x) => x !== d) : [...values.destinations, d]
    );
  }

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <TextField
        label="Атауы"
        name="title"
        required
        value={values.title}
        onChange={(v) => {
          set("title", v);
          if (!slugTouched) set("slug", slugify(v));
        }}
      />
      <TextField label="Ұран / слоган" name="slogan" value={values.slogan} onChange={(v) => set("slogan", v)} />

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-ink">Бағыттар</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DESTINATION_LABELS) as Destination[]).map((d) => (
            <label
              key={d}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                values.destinations.includes(d)
                  ? "border-bred bg-bred/10 text-bred-dark"
                  : "border-line text-muted hover:bg-paper-dim"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={values.destinations.includes(d)}
                onChange={() => toggleDestination(d)}
              />
              {DESTINATION_LABELS[d]}
            </label>
          ))}
        </div>
        <input type="hidden" name="destinations" value={JSON.stringify(values.destinations)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Ұзақтығы (күн)"
          name="durationDays"
          type="number"
          required
          value={String(values.durationDays)}
          onChange={(v) => set("durationDays", Number(v) || 0)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="audience" className="text-[13px] font-medium text-ink">
            Топтық / жеке
          </label>
          <select
            id="audience"
            name="audience"
            value={values.audience}
            onChange={(e) => set("audience", e.target.value as TourAudience)}
            className="h-11 rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                       focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
          >
            {(Object.keys(AUDIENCE_LABELS) as TourAudience[]).map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_LABELS[a]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Баға (теңге, міндетті емес)"
          name="priceTenge"
          type="number"
          value={values.priceTenge === null ? "" : String(values.priceTenge)}
          onChange={(v) => set("priceTenge", v === "" ? null : Number(v))}
        />
        <TextField
          label="Физикалық қиындық деңгейі"
          name="difficulty"
          value={values.difficulty}
          onChange={(v) => set("difficulty", v)}
        />
      </div>

      <StringListEditor label="Не кіреді" items={values.includes} onChange={(v) => set("includes", v)} placeholder="Мысалы: Қонақүй" />
      <input type="hidden" name="includes" value={JSON.stringify(values.includes)} />

      <StringListEditor label="Не кірмейді" items={values.excludes} onChange={(v) => set("excludes", v)} placeholder="Мысалы: Авиабилет" />
      <input type="hidden" name="excludes" value={JSON.stringify(values.excludes)} />

      <ItineraryEditor days={values.itinerary} onChange={(v) => set("itinerary", v)} />
      <input type="hidden" name="itinerary" value={JSON.stringify(values.itinerary)} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-[13px] font-medium text-ink">
          Мәртебе
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={(e) => set("status", e.target.value as TourStatus)}
          className="h-11 max-w-xs rounded-lg border border-line bg-white px-3 text-[14px] outline-none
                     focus-visible:border-bgold focus-visible:ring-2 focus-visible:ring-bgold/30"
        >
          {(Object.keys(TOUR_STATUS_LABELS) as TourStatus[]).map((s) => (
            <option key={s} value={s}>
              {TOUR_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <h3 className="font-display text-[16px] text-ink">SEO</h3>
        <div className="mt-4 flex flex-col gap-4">
          <TextField label="SEO — title" name="seoTitle" value={values.seoTitle} onChange={(v) => set("seoTitle", v)} />
          <TextField
            label="SEO — meta description"
            name="seoDescription"
            value={values.seoDescription}
            onChange={(v) => set("seoDescription", v)}
          />
          <TextField
            label="URL-слаг"
            name="slug"
            required
            value={values.slug}
            onChange={(v) => {
              setSlugTouched(true);
              set("slug", slugify(v));
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} />
        {state?.error && (
          <p role="alert" className="text-[13px] text-bred-dark">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
