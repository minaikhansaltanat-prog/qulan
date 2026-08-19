import { notFound } from "next/navigation";
import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "../../review-form";
import { updateReview } from "../../actions";

export default async function EditReviewPage(props: PageProps<"/admin/reviews/[id]/edit">) {
  await requireModuleAccess("reviews");
  const { id } = await props.params;

  const [review, tours] = await Promise.all([
    prisma.review.findUnique({ where: { id } }),
    prisma.tour.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);
  if (!review) notFound();

  return (
    <div>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">Пікірді өзгерту</h1>
      <div className="mt-8">
        <ReviewForm
          action={updateReview.bind(null, review.id)}
          submitLabel="Сақтау"
          tours={tours}
          initial={{
            clientName: review.clientName,
            clientPhotoKey: review.clientPhotoKey,
            type: review.type,
            textContent: review.textContent ?? "",
            mediaKey: review.mediaKey,
            rating: review.rating,
            tourId: review.tourId ?? "",
            isPublished: review.isPublished,
            isFeatured: review.isFeatured,
          }}
        />
      </div>
    </div>
  );
}
