import { EventsPage, eventsMetadata } from "@/components/pages/events-page";

export const metadata = eventsMetadata("tg");

export default function Page() {
  return <EventsPage locale="tg" />;
}
