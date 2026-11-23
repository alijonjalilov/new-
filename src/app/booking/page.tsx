import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { eventTypeFromSlug } from "@/lib/booking/event-types";

export const metadata: Metadata = {
  title: "Забронировать ведущего",
  description: "Оформите заявку на проведение мероприятия: несколько вопросов о дате, площадке и формате.",
  alternates: { canonical: "/booking" },
};

type Props = { searchParams: Promise<{ type?: string | string[] }> };

export default async function BookingPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const initialType = eventTypeFromSlug(Array.isArray(type) ? type[0] : type);
  return <BookingWizard initialType={initialType} />;
}
