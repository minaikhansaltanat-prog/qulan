import { notFound } from "next/navigation";
import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { TourForm } from "../../tour-form";
import { updateTour } from "../../actions";

export default async function EditTourPage(props: PageProps<"/admin/tours/[id]/edit">) {
  await requireModuleAccess("tours");
  const { id } = await props.params;

  const tour = await prisma.tour.findUnique({ where: { id } });
  if (!tour) notFound();

  const itinerary = Array.isArray(tour.itinerary)
    ? (tour.itinerary as unknown as { day: number; title: string; description: string }[])
    : [];

  return (
    <div>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">Турды өзгерту</h1>
      <div className="mt-8">
        <TourForm
          action={updateTour.bind(null, tour.id)}
          submitLabel="Сақтау"
          initial={{
            title: tour.title,
            slogan: tour.slogan ?? "",
            destinations: tour.destinations,
            durationDays: tour.durationDays,
            audience: tour.audience,
            priceTenge: tour.priceTenge,
            includes: tour.includes,
            excludes: tour.excludes,
            itinerary,
            difficulty: tour.difficulty ?? "",
            status: tour.status,
            seoTitle: tour.seoTitle ?? "",
            seoDescription: tour.seoDescription ?? "",
            slug: tour.slug,
          }}
        />
      </div>
    </div>
  );
}
