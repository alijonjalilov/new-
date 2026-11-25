import { EventsPage, eventsMetadata } from "@/components/pages/events-page";

export const metadata = eventsMetadata("ru");

export default function Page() {
  return <EventsPage locale="ru" />;
}
