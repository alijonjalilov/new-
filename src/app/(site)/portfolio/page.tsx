import type { Metadata } from "next";
import { PageIntro } from "@/components/section";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { BookingBand } from "@/components/booking-band";

export const metadata: Metadata = {
  title: "Портфолио",
  description: "Фото и видео с проведённых мероприятий: свадьбы, конференции, корпоративы и другие события.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageIntro title="Портфолио" lead="Фотографии и видео с мероприятий. Выберите категорию, чтобы посмотреть похожие события." />
      <section className="container-site pb-24 md:pb-32">
        <PortfolioGrid />
      </section>
      <BookingBand />
    </>
  );
}
