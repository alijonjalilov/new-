import { EventsPage, eventsMetadata } from "@/components/pages/events-page";

export const metadata = eventsMetadata("en");

export default function Page() {
  return <EventsPage locale="en" />;
}
