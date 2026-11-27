import { ensureContent } from "@/lib/content/store";
import { EventsPage, eventsMetadata } from "@/components/pages/events-page";

export const metadata = eventsMetadata("tg");

export default async function Page() {
  await ensureContent();
  return <EventsPage locale="tg" />;
}
