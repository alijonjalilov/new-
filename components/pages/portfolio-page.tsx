import type { Metadata } from "next";
import { PageIntro } from "@/components/section";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { BookingBand } from "@/components/booking-band";
import { type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { pageMetadata } from "@/lib/seo";

export function portfolioMetadata(locale: Locale): Metadata {
  return pageMetadata(locale, "/portfolio", {
    title: t(locale, "Портфолио"),
    description: t(locale, "Фото и видео с проведённых мероприятий: свадьбы, конференции, корпоративы и другие события."),
  });
}

export function PortfolioPage({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  return (
    <>
      <PageIntro
        title={tr("Портфолио")}
        lead={tr("Фотографии и видео с мероприятий. Выберите категорию, чтобы посмотреть похожие события.")}
      />
      <section className="container-site pb-24 md:pb-32">
        <PortfolioGrid locale={locale} />
      </section>
      <BookingBand locale={locale} />
    </>
  );
}
