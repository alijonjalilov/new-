import type { Metadata } from "next";
import { EventPage, eventMetadata } from "@/components/pages/event-page";
import { eventCategories } from "@/content/events";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return eventCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return eventMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <EventPage locale="en" slug={slug} />;
}
