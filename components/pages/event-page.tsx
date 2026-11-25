import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Photo } from "@/components/photo";
import { SectionHeading } from "@/components/section";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { BookingBand } from "@/components/booking-band";
import { getEventCategory } from "@/content/events";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { pageMetadata } from "@/lib/seo";

export function eventMetadata(locale: Locale, slug: string): Metadata {
  const c = getEventCategory(slug);
  if (!c) return {};
  return pageMetadata(locale, `/events/${c.slug}`, { title: t(locale, c.title), description: t(locale, c.short) });
}

export function EventPage({ locale, slug }: { locale: Locale; slug: string }) {
  const tr = (s: string) => t(locale, s);
  const c = getEventCategory(slug);
  if (!c) notFound();

  const videos = c.youtube.length > 0 ? c.youtube : [undefined, undefined];
  const mainPhoto = c.photos[0] ?? null;
  const gallery: (string | null)[] = c.photos.length > 1 ? c.photos.slice(1) : [null, null, null];

  return (
    <>
      <section className="container-site pt-32 pb-16 md:pt-44 md:pb-24">
        <nav aria-label={tr("Навигация по разделу")} className="mb-8 text-sm text-muted">
          <Link href={lp(locale, "/events")} className="hover:text-ink">
            {tr("Мероприятия")}
          </Link>
          <span aria-hidden> / </span>
          <span aria-current="page">{tr(c.title)}</span>
        </nav>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            <h1 className="t-h1">{tr(c.title)}</h1>
            <p className="t-lead measure mt-6">{tr(c.intro)}</p>
            <Link href={lp(locale, `/booking?type=${c.bookingType}`)} className="btn btn-primary mt-8">
              {tr("Забронировать дату")}
            </Link>
          </div>
          <Photo
            src={mainPhoto}
            alt={tr(c.title)}
            placeholder={t(locale, "Главное фото: {title}", { title: tr(c.title).toLowerCase() })}
            locale={locale}
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="aspect-[4/5] rounded-3xl"
          />
        </div>
      </section>

      <section className="bg-paper-2 py-20 md:py-28">
        <div className="container-site grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="t-h2">{tr("Что входит в работу")}</h2>
            <ul className="mt-8 space-y-4">
              {c.includes.map((item) => (
                <li key={item} className="flex gap-3 text-lg">
                  <Check aria-hidden className="mt-1 size-5 shrink-0 text-brass-deep" />
                  <span>{tr(item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-h2">{tr("Как идёт подготовка")}</h2>
            <ol className="mt-8 space-y-6">
              {c.process.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="font-display text-brass-deep" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{tr(p.title)}</h3>
                    <p className="mt-1 text-muted">{tr(p.text)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-site py-20 md:py-28">
        <SectionHeading title={tr("Фото и видео")} />
        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((v, i) => (
            <YouTubeEmbed key={i} url={v} title={t(locale, "{title}: видео {n}", { title: tr(c.title), n: i + 1 })} locale={locale} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {gallery.map((src, i) => (
            <Photo
              key={i}
              src={src}
              alt={t(locale, "{title}, фото {n}", { title: tr(c.title), n: i + 2 })}
              placeholder={tr("Место для фото")}
              locale={locale}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="aspect-[4/3] rounded-2xl"
            />
          ))}
        </div>
      </section>

      <BookingBand locale={locale} />
    </>
  );
}
