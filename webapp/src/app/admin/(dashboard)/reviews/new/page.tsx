import { requireModuleAccess } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "../review-form";
import { createReview } from "../actions";

export default async function NewReviewPage() {
  await requireModuleAccess("reviews");
  const tours = await prisma.tour.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } });

  return (
    <div>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-ink">Жаңа пікір</h1>
      <div className="mt-8">
        <ReviewForm action={createReview} submitLabel="Пікір қосу" tours={tours} />
      </div>
    </div>
  );
}
