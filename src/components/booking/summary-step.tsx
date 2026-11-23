"use client";

import { Pencil } from "lucide-react";
import type { SummaryItem } from "@/lib/booking/engine";

export function SummaryStep({
  eventLabel,
  items,
  onEdit,
  onEditType,
}: {
  eventLabel: string;
  items: SummaryItem[];
  onEdit: (id: string) => void;
  onEditType: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      <dl>
        <Row label="Мероприятие" value={eventLabel} onEdit={onEditType} />
        {items.map((it) => (
          <Row key={it.id} label={it.label} value={it.value} onEdit={() => onEdit(it.id)} />
        ))}
      </dl>
    </div>
  );
}

function Row({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-x-4 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-[13rem_1fr_auto] md:px-6">
      <dt className="text-sm text-muted md:pt-0.5">{label}</dt>
      <dd className="col-start-1 row-start-2 mt-1 break-words md:col-start-2 md:row-start-1 md:mt-0">
        {value === "—" ? <span className="text-muted">Не указано</span> : value}
      </dd>
      <button
        type="button"
        onClick={onEdit}
        className="col-start-2 row-span-2 row-start-1 -m-2 inline-flex items-center gap-1.5 rounded-full p-2 text-sm text-brass-deep hover:text-ink md:col-start-3 md:row-span-1"
        aria-label={`Изменить: ${label}`}
      >
        <Pencil aria-hidden className="size-4" />
        <span className="hidden sm:inline">Изменить</span>
      </button>
    </div>
  );
}
