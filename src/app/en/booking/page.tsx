import type { Metadata } from "next";
import { BookingRoute } from "@/components/pages/booking-route";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/i18n/t";

export const metadata: Metadata = pageMetadata("en", "/booking", {
  title: t("en", "Забронировать ведущего"),
  description: t("en", "Оформите заявку на проведение мероприятия: несколько вопросов о дате, площадке и формате."),
});

type Props = { searchParams: Promise<{ type?: string | string[]; design?: string | string[] }> };

export default async function BookingPage({ searchParams }: Props) {
  return <BookingRoute locale="en" searchParams={searchParams} />;
}
