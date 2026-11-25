import { STATUS_LABEL, type BookingStatusKey } from "@/lib/booking/event-types";
import { cn } from "@/lib/utils";

const STYLES: Record<BookingStatusKey, string> = {
  NEW: "bg-brass/25 text-brass-deep",
  IN_PROGRESS: "bg-violet-100 text-violet-800",
  CONTACTED: "bg-sky-100 text-sky-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-ink/8 text-muted",
};

/** Цвет точки статуса в календаре */
export const STATUS_DOT: Record<BookingStatusKey, string> = {
  NEW: "bg-brass",
  IN_PROGRESS: "bg-violet-500",
  CONTACTED: "bg-sky-500",
  CONFIRMED: "bg-emerald-500",
  REJECTED: "bg-ink/25",
};

export function StatusBadge({ status }: { status: BookingStatusKey }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap", STYLES[status])}>
      <span aria-hidden className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function BusyBadge({ title }: { title?: string }) {
  return (
    <span title={title} className="inline-flex items-center rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-danger">
      Вы заняты
    </span>
  );
}
