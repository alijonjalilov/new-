import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { eventTypeFromSlug } from "@/lib/booking/event-types";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/i18n/t";

export const metadata: Metadata = pageMetadata("ru", "/booking", {
  title: t("ru", "Забронировать ведущего"),
  description: t("ru", "Оформите заявку на проведение мероприятия: несколько вопросов о дате, площадке и формате."),
});

type Props = { searchParams: Promise<{ type?: string | string[] }> };

export default async function BookingPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const initialType = eventTypeFromSlug(Array.isArray(type) ? type[0] : type);
  return <BookingWizard initialType={initialType} locale="ru" />;
}
