import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { PageIntro } from "@/components/section";
import { BookingBand } from "@/components/booking-band";
import { eventCategories } from "@/content/events";

export const metadata: Metadata = {
  title: "Мероприятия",
  description: "Свадьбы, конференции, корпоративы, частные и официальные мероприятия — форматы, которые я веду.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <PageIntro
        title="Мероприятия"
        lead="Каждый формат требует своей интонации. Выберите ваш, чтобы узнать, что входит в работу ведущего."
      />
      <section className="container-site space-y-20 pb-24 md:space-y-28 md:pb-32">
        {eventCategories.map((c, i) => (
          <article key={c.slug} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <Photo
              src={c.photos[0]}
              alt={c.title}
              placeholder={`Фото: ${c.title.toLowerCase()}`}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`aspect-[4/3] rounded-3xl ${i % 2 ? "md:order-2" : ""}`}
            />
            <div>
              <h2 className="t-h2">{c.title}</h2>
              <p className="mt-4 text-lg text-muted">{c.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/events/${c.slug}`} className="btn btn-primary">
                  Подробнее
                </Link>
                <Link href={`/booking?type=${c.bookingType}`} className="btn btn-outline">
                  Забронировать
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <BookingBand />
    </>
  );
}
