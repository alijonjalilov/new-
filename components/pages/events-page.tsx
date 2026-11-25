import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { PageIntro } from "@/components/section";
import { BookingBand } from "@/components/booking-band";
import { eventCategories } from "@/content/events";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { pageMetadata } from "@/lib/seo";

export function eventsMetadata(locale: Locale): Metadata {
  return pageMetadata(locale, "/events", {
    title: t(locale, "Мероприятия"),
    description: t(locale, "Свадьбы, конференции, корпоративы, частные и официальные мероприятия — форматы, которые я веду."),
  });
}

export function EventsPage({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  return (
    <>
      <PageIntro
        title={tr("Мероприятия")}
        lead={tr("Каждый формат требует своей интонации. Выберите ваш, чтобы узнать, что входит в работу ведущего.")}
      />
      <section className="container-site space-y-20 pb-24 md:space-y-28 md:pb-32">
        {eventCategories.map((c, i) => (
          <article key={c.slug} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <Photo
              src={c.photos[0]}
              alt={tr(c.title)}
              placeholder={t(locale, "Фото: {title}", { title: tr(c.title).toLowerCase() })}
              locale={locale}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`aspect-[4/3] rounded-3xl ${i % 2 ? "md:order-2" : ""}`}
            />
            <div>
              <h2 className="t-h2">{tr(c.title)}</h2>
              <p className="mt-4 text-lg text-muted">{tr(c.intro)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={lp(locale, `/events/${c.slug}`)} className="btn btn-primary">
                  {tr("Подробнее")}
                </Link>
                <Link href={lp(locale, `/booking?type=${c.bookingType}`)} className="btn btn-outline">
                  {tr("Забронировать")}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <BookingBand locale={locale} />
    </>
  );
}
