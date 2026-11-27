import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTIONS, isSectionKey } from "@/lib/content/sections";
import { getSectionValue } from "@/lib/content/store";
import { eventCategories } from "@/content/events";
import { EVENT_TYPES } from "@/lib/booking/event-types";
import { ContentEditor } from "@/components/admin/content-editor";

export const dynamic = "force-dynamic";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();
  const info = await getSectionValue(section);
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        <Link href="/admin/settings" className="hover:text-ink">
          Настройки сайта
        </Link>{" "}
        / {SECTIONS[section].title}
      </p>
      <ContentEditor
        section={section}
        title={SECTIONS[section].title}
        initial={info.value}
        changed={info.changed}
        hasPrev={info.hasPrev}
        formats={eventCategories.map((c) => ({ slug: c.slug, title: c.title }))}
        eventTypes={EVENT_TYPES.map((e) => ({ key: e.key, label: e.label }))}
      />
    </div>
  );
}
