import { ReviewsPage, reviewsMetadata } from "@/components/pages/reviews-page";

export const metadata = reviewsMetadata("ru");

export default function Page() {
  return <ReviewsPage locale="ru" />;
}
