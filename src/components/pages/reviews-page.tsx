import { features } from "@/content/site";
import type { Metadata } from "next";
import { PageIntro } from "@/components/section";
import { TestimonialCard } from "@/components/testimonial-card";
import { BookingBand } from "@/components/booking-band";
import { testimonials } from "@/content/testimonials";
import { type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { pageMetadata } from "@/lib/seo";

export function reviewsMetadata(locale: Locale): Metadata {
  return pageMetadata(locale, "/reviews", { noindex: !features.reviews,
    title: t(locale, "Отзывы"),
    description: t(locale, "Отзывы клиентов о проведённых мероприятиях."),
  });
}

export function ReviewsPage({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  return (
    <>
      <PageIntro title={tr("Отзывы")} lead={tr("Слова тех, с кем мы уже провели их события.")} />
      <section className="container-site pb-24 md:pb-32">
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} t={item} locale={locale} />
          ))}
        </div>
      </section>
      <BookingBand locale={locale} />
    </>
  );
}
