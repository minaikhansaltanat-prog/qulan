import { requireModuleAccess } from "@/lib/auth-guards";
import { TourForm } from "../tour-form";
import { createTour } from "../actions";

export default async function NewTourPage() {
  await requireModuleAccess("tours");

  return (
    <div>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">Жаңа тур</h1>
      <div className="mt-8">
        <TourForm action={createTour} submitLabel="Тур жасау" />
      </div>
    </div>
  );
}
