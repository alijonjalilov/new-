import { ensureContent } from "@/lib/content/store";
import { ReviewsPage, reviewsMetadata } from "@/components/pages/reviews-page";

export const metadata = reviewsMetadata("tg");

export default async function Page() {
  await ensureContent();
  return <ReviewsPage locale="tg" />;
}
