import { ReviewsPage, reviewsMetadata } from "@/components/pages/reviews-page";

export const metadata = reviewsMetadata("tg");

export default function Page() {
  return <ReviewsPage locale="tg" />;
}
