import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Photo } from "@/components/photo";
import { SectionHeading } from "@/components/section";
import { ApproachSteps } from "@/components/approach-steps";
import { TestimonialCard } from "@/components/testimonial-card";
import { eventCategories } from "@/content/events";
import { portfolioItems } from "@/content/portfolio";
import { testimonials } from "@/content/testimonials";
import { contactLinks, site } from "@/content/site";
import { siteUrl } from "@/lib/site";
import { BookingBand } from "@/components/booking-band";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.hostName,
    jobTitle: site.role,
    description: site.subtitle,
    url: siteUrl(),
    telephone: site.contacts.phone,
    ...(site.contacts.email ? { email: site.contacts.email } : {}),
    alternateName: site.hostNameLatin,
    sameAs: [contactLinks.instagram, contactLinks.telegram],
    address: { "@type": "PostalAddress", addressLocality: "Душанбе", addressCountry: "TJ" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />

      {/* Вступление */}
      <section className="container-site grid gap-10 py-24 md:grid-cols-[1fr_1.4fr] md:py-32">
        <h2 className="t-h2">Ведущий — это голос вашего события</h2>
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Гости запоминают не тайминг, а ощущение: было ли им тепло, интересно и легко. Я отвечаю за то, чтобы программа
            шла естественно, а каждый важный момент прозвучал вовремя и по-своему.
          </p>
          <p>
            Свадьба на двести гостей, международный форум с протоколом или семейный юбилей — подход один: подготовка,
            внимание к деталям и уважение к людям в зале.
          </p>
          <Link href="/about" className="link-underline inline-block pt-2 text-ink">
            Подробнее обо мне
          </Link>
        </div>
      </section>

      {/* Мероприятия — список, а не сетка карточек */}
      <section aria-labelledby="events-title" className="container-site pb-24 md:pb-32">
        <SectionHeading id="events-title" title="Мероприятия" lead="Форматы, которые я веду. Выберите свой, чтобы узнать подробности." />
        <ul className="border-t border-line">
          {eventCategories.map((c) => (
            <li key={c.slug} className="border-b border-line">
              <Link
                href={`/events/${c.slug}`}
                className="group grid gap-2 py-7 md:grid-cols-[1fr_1.2fr_auto] md:items-center md:gap-10 md:py-9"
              >
                <span className="font-display text-2xl font-light tracking-tight transition-colors group-hover:text-brass-deep md:text-4xl">
                  {c.title}
                </span>
                <span className="text-muted">{c.short}</span>
                <ArrowUpRight
                  aria-hidden
                  className="hidden size-6 text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink md:block"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Подход — реальная последовательность, поэтому с номерами */}
      <section className="bg-paper-2 py-24 md:py-32">
        <div className="container-site">
          <SectionHeading title="Как мы будем работать" lead="От первого звонка до последнего тоста — понятный путь без сюрпризов." />
          <ApproachSteps />
        </div>
      </section>

      {/* Портфолио */}
      <section className="container-site py-24 md:py-32">
        <SectionHeading
          title="Работы"
          action={
            <Link href="/portfolio" className="link-underline shrink-0">
              Всё портфолио
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {portfolioItems.slice(0, 3).map((item, i) => (
            <Photo
              key={item.id}
              src={item.src}
              alt={item.title}
              placeholder={`${item.title}: ${item.caption ?? "место для фото"}`}
              sizes="(min-width: 768px) 33vw, 50vw"
              className={
                i === 0
                  ? "col-span-2 aspect-[16/10] rounded-2xl md:col-span-1 md:row-span-2 md:aspect-auto md:h-full"
                  : "aspect-[4/5] rounded-2xl md:aspect-[4/3]"
              }
            />
          ))}
        </div>
      </section>

      {/* Отзывы */}
      <section className="container-site pb-24 md:pb-32">
        <SectionHeading
          title="Отзывы"
          action={
            <Link href="/reviews" className="link-underline shrink-0">
              Все отзывы
            </Link>
          }
        />
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.slice(0, 2).map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </section>

      <BookingBand />
    </>
  );
}
