import { ensureContent } from "@/lib/content/store";
import type { Metadata } from "next";
import { BookingRoute } from "@/components/pages/booking-route";
import { pageMetadata } from "@/lib/seo";
import { t } from "@/i18n/t";

export const metadata: Metadata = pageMetadata("tg", "/booking", {
  title: t("tg", "Забронировать ведущего"),
  description: t("tg", "Оформите заявку на проведение мероприятия: несколько вопросов о дате, площадке и формате."),
});

type Props = { searchParams: Promise<{ type?: string | string[]; design?: string | string[] }> };

export default async function BookingPage({ searchParams }: Props) {
  await ensureContent();
  return <BookingRoute locale="tg" searchParams={searchParams} />;
}
