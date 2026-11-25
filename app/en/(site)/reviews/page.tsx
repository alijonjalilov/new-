import { ReviewsPage, reviewsMetadata } from "@/components/pages/reviews-page";

export const metadata = reviewsMetadata("en");

export default function Page() {
  return <ReviewsPage locale="en" />;
}
