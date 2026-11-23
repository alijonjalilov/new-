import { STATUS_LABEL, type BookingStatusKey } from "@/lib/booking/event-types";
import { cn } from "@/lib/utils";

const STYLES: Record<BookingStatusKey, string> = {
  NEW: "bg-brass/25 text-brass-deep",
  IN_PROGRESS: "bg-velvet/10 text-velvet",
  CONTACTED: "bg-sky-100 text-sky-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-ink/8 text-muted",
};

export function StatusBadge({ status }: { status: BookingStatusKey }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap", STYLES[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}
