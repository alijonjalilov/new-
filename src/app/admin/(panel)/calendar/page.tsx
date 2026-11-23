import Link from "next/link";
import { prisma } from "@/lib/db";
import { EVENT_TYPE_BY_KEY, BOOKING_STATUSES, type BookingStatusKey } from "@/lib/booking/event-types";
import { formatDateRu } from "@/lib/booking/engine";
import { conflictMessage, eventWindow, findConflicts, formatWindow, type ScheduleItem } from "@/lib/booking/schedule";
import { scheduleSelect, toScheduleItem } from "@/lib/booking/schedule-db";
import { BusyBadge, STATUS_DOT, StatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Календарь" };

/** Часовой пояс ведущего — для подсветки «сегодня» */
const TIME_ZONE = "Asia/Dushanbe";

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

const pad = (n: number) => String(n).padStart(2, "0");
const todayISO = () => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());

function shiftMonth(y: number, m: number, delta: number) {
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

const sortByTime = (a: ScheduleItem, b: ScheduleItem) => (a.time ?? "00:00").localeCompare(b.time ?? "00:00");

export default async function CalendarPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const today = todayISO();
  const monthParam = /^\d{4}-\d{2}$/.test(one(sp.month)) ? one(sp.month) : today.slice(0, 7);
  const [year, month] = monthParam.split("-").map(Number);
  const dayParam = one(sp.day);
  const selected = /^\d{4}-\d{2}-\d{2}$/.test(dayParam) && dayParam.startsWith(monthParam)
    ? dayParam
    : today.startsWith(monthParam)
      ? today
      : null;

  let items: ScheduleItem[];
  try {
    const rows = await prisma.booking.findMany({
      where: {
        eventDate: {
          gte: new Date(Date.UTC(year, month - 1, 1)),
          lt: new Date(Date.UTC(year, month, 1)),
        },
      },
      orderBy: [{ eventDate: "asc" }, { eventTime: "asc" }],
      select: scheduleSelect,
    });
    items = rows.map(toScheduleItem);
  } catch (error) {
    console.error("[admin/calendar]", error);
    return (
      <div role="alert" className="rounded-3xl border border-danger/30 bg-white p-8">
        <h1 className="font-display text-2xl font-light">База данных недоступна</h1>
        <p className="mt-3 text-muted">Проверьте подключение к базе. Подробности — в логах сервера.</p>
      </div>
    );
  }

  // Группируем по дням и считаем пересечения с подтверждёнными
  const byDay = new Map<string, ScheduleItem[]>();
  for (const it of items) {
    if (!it.date) continue;
    byDay.set(it.date, [...(byDay.get(it.date) ?? []), it]);
  }
  const conflictsById = new Map<string, ScheduleItem[]>();
  for (const it of items) conflictsById.set(it.id, findConflicts(it, items));

  // Сетка месяца: недели с понедельника
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstWeekday = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${monthParam}-${pad(i + 1)}`),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const href = (m: string, d?: string) => `/admin/calendar?month=${m}${d ? `&day=${d}` : ""}`;
  const selectedItems = selected ? (byDay.get(selected) ?? []).slice().sort(sortByTime) : [];
  const busyTotal = items.filter((i) => (conflictsById.get(i.id)?.length ?? 0) > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-light tracking-tight">Календарь</h1>
        <nav aria-label="Выбор месяца" className="flex items-center gap-2">
          <Link href={href(shiftMonth(year, month, -1))} className="btn btn-outline min-h-10 px-4" aria-label="Предыдущий месяц">
            ‹
          </Link>
          <span className="min-w-40 text-center font-medium">
            {MONTHS[month - 1]} {year}
          </span>
          <Link href={href(shiftMonth(year, month, 1))} className="btn btn-outline min-h-10 px-4" aria-label="Следующий месяц">
            ›
          </Link>
          <Link href={href(today.slice(0, 7), today)} className="btn min-h-10 px-4 text-muted hover:text-ink">
            Сегодня
          </Link>
        </nav>
      </div>

      {/* Легенда цветов */}
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
        {BOOKING_STATUSES.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span aria-hidden className={cn("size-2.5 rounded-full", STATUS_DOT[s.key])} />
            {s.label}
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full ring-2 ring-danger" />
          Пересекается с подтверждённой
        </li>
      </ul>

      {busyTotal > 0 && (
        <p role="status" className="rounded-2xl border border-danger/25 bg-danger/5 px-4 py-3 text-danger">
          В этом месяце {busyTotal} {busyTotal === 1 ? "заявка приходится" : "заявки приходятся"} на время, когда вы уже заняты. Такие дни отмечены красным.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Сетка */}
        <div className="overflow-hidden rounded-2xl bg-white">
          <div className="grid grid-cols-7 border-b border-line text-center text-xs text-muted">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-2">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date) return <div key={`e${i}`} className="min-h-16 border-b border-r border-line bg-paper/60 md:min-h-28" />;
              const dayItems = (byDay.get(date) ?? []).slice().sort(sortByTime);
              const hasConfirmed = dayItems.some((d) => d.status === "CONFIRMED");
              const hasBusy = dayItems.some((d) => (conflictsById.get(d.id)?.length ?? 0) > 0);
              const isToday = date === today;
              const isSelected = date === selected;
              const label = `${Number(date.slice(8))} ${MONTHS[month - 1].toLowerCase()}: ${dayItems.length ? `${dayItems.length} заявок` : "нет заявок"}${hasBusy ? ", есть пересечение" : ""}`;
              return (
                <Link
                  key={date}
                  href={href(monthParam, date)}
                  aria-label={label}
                  aria-current={isSelected ? "date" : undefined}
                  className={cn(
                    "relative flex min-h-16 flex-col gap-1 border-b border-r border-line p-1.5 transition-colors hover:bg-paper md:min-h-28 md:p-2",
                    hasConfirmed && "bg-emerald-50/70",
                    hasBusy && "bg-danger/5",
                    isSelected && "outline-2 -outline-offset-2 outline-velvet",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs tabular-nums md:text-sm",
                      isToday && "bg-velvet text-paper",
                    )}
                  >
                    {Number(date.slice(8))}
                  </span>

                  {/* Телефон: только точки */}
                  <span className="flex flex-wrap gap-1 md:hidden">
                    {dayItems.slice(0, 6).map((d) => (
                      <span
                        key={d.id}
                        className={cn(
                          "size-2 rounded-full",
                          STATUS_DOT[d.status as BookingStatusKey],
                          (conflictsById.get(d.id)?.length ?? 0) > 0 && "ring-2 ring-danger",
                        )}
                      />
                    ))}
                  </span>

                  {/* Компьютер: время и тип */}
                  <span className="hidden flex-col gap-0.5 md:flex">
                    {dayItems.slice(0, 3).map((d) => (
                      <span key={d.id} className="flex items-center gap-1.5 truncate text-xs">
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            STATUS_DOT[d.status as BookingStatusKey],
                            (conflictsById.get(d.id)?.length ?? 0) > 0 && "ring-2 ring-danger",
                          )}
                        />
                        <span className="tabular-nums text-muted">{d.time ?? "—"}</span>
                        <span className="truncate">{EVENT_TYPE_BY_KEY[d.eventType as keyof typeof EVENT_TYPE_BY_KEY]?.short}</span>
                      </span>
                    ))}
                    {dayItems.length > 3 && <span className="text-xs text-muted">ещё {dayItems.length - 3}</span>}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Заявки выбранного дня */}
        <aside className="space-y-3 self-start lg:sticky lg:top-6">
          <h2 className="font-medium">{selected ? formatDateRu(selected) : "Выберите день"}</h2>
          {selected && selectedItems.length === 0 && (
            <p className="rounded-2xl bg-white p-5 text-muted">В этот день заявок нет — дата свободна.</p>
          )}
          {selectedItems.map((d) => {
            const conflicts = conflictsById.get(d.id) ?? [];
            const msg = conflictMessage(conflicts);
            return (
              <Link
                key={d.id}
                href={`/admin/bookings/${d.id}`}
                className={cn("block rounded-2xl bg-white p-5 transition-colors hover:bg-paper", msg && "ring-1 ring-danger/40")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium tabular-nums">{formatWindow(eventWindow(d))}</p>
                    <p className="text-sm text-muted">
                      №{d.number}, {EVENT_TYPE_BY_KEY[d.eventType as keyof typeof EVENT_TYPE_BY_KEY]?.label}
                    </p>
                    <p className="mt-1">{d.clientName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={d.status as BookingStatusKey} />
                    {msg && <BusyBadge />}
                  </div>
                </div>
                {msg && <p className="mt-3 text-sm text-danger">{msg}</p>}
              </Link>
            );
          })}
          <p className="text-xs leading-relaxed text-muted">
            В заявке указано только время начала, поэтому длительность считается примерно: свадьба — 6 часов, другие
            мероприятия — 4–5 часов, «весь день», если время не указано. Занятым считается время подтверждённых заявок.
          </p>
        </aside>
      </div>
    </div>
  );
}
