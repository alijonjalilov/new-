import type { Metadata } from "next";
import { PageIntro } from "@/components/section";
import { TestimonialCard } from "@/components/testimonial-card";
import { BookingBand } from "@/components/booking-band";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Отзывы",
  description: "Отзывы клиентов о проведённых мероприятиях.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageIntro title="Отзывы" lead="Слова тех, с кем мы уже провели их события." />
      <section className="container-site pb-24 md:pb-32">
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </section>
      <BookingBand />
    </>
  );
}
