import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { BookingStatus, EventType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { BOOKING_STATUSES, EVENT_TYPES, EVENT_TYPE_BY_KEY } from "@/lib/booking/event-types";
import { formatDateRu } from "@/lib/booking/engine";
import { BookingList } from "@/components/admin/booking-list";
import { conflictMessage, findConflicts } from "@/lib/booking/schedule";
import { loadConfirmedOn, scheduleSelect, toScheduleItem } from "@/lib/booking/schedule-db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Заявки" };

const PAGE_SIZE = 20;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function parseFilters(sp: SP) {
  const q = one(sp.q).trim().slice(0, 100);
  const type = one(sp.type);
  const status = one(sp.status);
  const from = one(sp.from);
  const to = one(sp.to);
  const dateField = one(sp.dateField) === "created" ? "created" : "event";
  const page = Math.max(1, Number.parseInt(one(sp.page), 10) || 1);
  return {
    q,
    type: (Object.values(EventType) as string[]).includes(type) ? (type as EventType) : "",
    status: (Object.values(BookingStatus) as string[]).includes(status) ? (status as BookingStatus) : "",
    from: DATE_RE.test(from) ? from : "",
    to: DATE_RE.test(to) ? to : "",
    dateField,
    page,
  } as const;
}

type Filters = ReturnType<typeof parseFilters>;

function buildWhere(f: Filters): Prisma.BookingWhereInput {
  // Заявки из корзины в списке и статистике не показываем
  const where: Prisma.BookingWhereInput = { deletedAt: null };
  if (f.type) where.eventType = f.type;
  if (f.status) where.status = f.status;

  if (f.from || f.to) {
    const range: { gte?: Date; lte?: Date } = {};
    if (f.from) range.gte = new Date(`${f.from}T00:00:00.000Z`);
    if (f.to) range.lte = new Date(`${f.to}T23:59:59.999Z`);
    if (f.dateField === "created") where.createdAt = range;
    else where.eventDate = range;
  }

  if (f.q) {
    const contains = { contains: f.q, mode: "insensitive" as const };
    const or: Prisma.BookingWhereInput[] = [
      { clientName: contains },
      { phone: contains },
      { whatsapp: contains },
      { email: contains },
      { city: contains },
      { address: contains },
      { comment: contains },
    ];
    const num = Number(f.q.replace(/^№/, ""));
    if (Number.isInteger(num) && num > 0 && num < 2_147_483_647) or.push({ number: num });
    where.OR = or;
  }
  return where;
}

function qs(f: Filters, patch: Partial<Record<keyof Filters, string | number>>) {
  const params = new URLSearchParams();
  const merged = { ...f, ...patch } as Record<string, string | number>;
  for (const [k, v] of Object.entries(merged)) {
    if (v === "" || v === undefined) continue;
    if (k === "page" && Number(v) === 1) continue;
    if (k === "dateField" && v === "event") continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `/admin?${s}` : "/admin";
}

type DashboardData = {
    total: number;
    byType: Record<string, number>;
    newCount: number;
    confirmed: number;
    filteredCount: number;
    rows: Prisma.BookingGetPayload<{
      select: { id: true; number: true; eventType: true; status: true; eventDate: true; eventTime: true; answers: true; city: true; guests: true; clientName: true; phone: true; createdAt: true };
    }>[];
    /** id заявки → текст предупреждения о занятости */
    busy: Record<string, string>;
  };

async function loadDashboard(f: Filters, where: Prisma.BookingWhereInput): Promise<DashboardData | null> {
  try {
    const live = { deletedAt: null };
    const countType = (eventType: EventType) => prisma.booking.count({ where: { ...live, eventType } });
    const [total, weddings, conferences, corporates, newCount, confirmedCount, filteredCount, rows] = await Promise.all([
      prisma.booking.count({ where: live }),
      countType("WEDDING"),
      countType("CONFERENCE"),
      countType("CORPORATE"),
      prisma.booking.count({ where: { ...live, status: "NEW" } }),
      prisma.booking.count({ where: { ...live, status: "CONFIRMED" } }),
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (f.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: { ...scheduleSelect, city: true, guests: true, phone: true, createdAt: true },
      }),
    ]);
    // Отмечаем заявки, которые пересекаются с уже подтверждёнными
    const items = rows.map(toScheduleItem);
    const confirmed = await loadConfirmedOn(items.map((i) => i.date));
    const busy: Record<string, string> = {};
    for (const it of items) {
      const msg = conflictMessage(findConflicts(it, confirmed));
      if (msg) busy[it.id] = msg;
    }
    const byType: Record<string, number> = { WEDDING: weddings, CONFERENCE: conferences, CORPORATE: corporates };
    return { total, byType, newCount, confirmed: confirmedCount, filteredCount, rows, busy };
  } catch (error) {
    console.error("[admin] Ошибка загрузки заявок:", error);
    return null;
  }
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<SP> }) {
  const f = parseFilters(await searchParams);
  const where = buildWhere(f);

  const data = await loadDashboard(f, where);
  if (!data) {
    return (
        <div role="alert" className="rounded-3xl border border-danger/30 bg-white p-8">
          <h1 className="font-display text-2xl font-light">База данных недоступна</h1>
          <p className="mt-3 text-muted">
            Проверьте переменную DATABASE_URL и что миграции применены (<code>npm run db:deploy</code>). Подробности — в логах сервера.
          </p>
        </div>
      );

  }

  const stats = [
    { label: "Всего заявок", value: data.total },
    { label: "Новые", value: data.newCount, href: qs({ ...f, page: 1 }, { status: "NEW", page: 1 }) },
    { label: "Подтверждённые", value: data.confirmed, href: qs({ ...f, page: 1 }, { status: "CONFIRMED", page: 1 }) },
    { label: "Свадьбы", value: data.byType.WEDDING ?? 0, href: qs(f, { type: "WEDDING", page: 1 }) },
    { label: "Конференции", value: data.byType.CONFERENCE ?? 0, href: qs(f, { type: "CONFERENCE", page: 1 }) },
    { label: "Корпоративы", value: data.byType.CORPORATE ?? 0, href: qs(f, { type: "CORPORATE", page: 1 }) },
  ];

  const pages = Math.max(1, Math.ceil(data.filteredCount / PAGE_SIZE));
  const hasFilters = Boolean(f.q || f.type || f.status || f.from || f.to);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-light tracking-tight">Заявки</h1>

      <section aria-label="Статистика" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const inner = (
            <>
              <span className="block text-sm text-muted">{s.label}</span>
              <span className="mt-2 block font-display text-3xl font-light tabular-nums">{s.value}</span>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="rounded-2xl bg-white p-5 transition-colors hover:bg-paper">
              {inner}
            </Link>
          ) : (
            <div key={s.label} className="rounded-2xl bg-white p-5">
              {inner}
            </div>
          );
        })}
      </section>

      {/* Фильтры — обычная GET-форма: работает и без JavaScript, ссылку можно сохранить */}
      <form method="get" action="/admin" className="grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-12 md:p-5">
        <div className="md:col-span-4">
          <label htmlFor="f-q" className="field-label">
            Поиск
          </label>
          <input id="f-q" name="q" defaultValue={f.q} className="field" placeholder="Имя, телефон, город, №" type="search" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="f-type" className="field-label">
            Тип
          </label>
          <select id="f-type" name="type" defaultValue={f.type} className="field">
            <option value="">Все</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.short}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="f-status" className="field-label">
            Статус
          </label>
          <select id="f-status" name="status" defaultValue={f.status} className="field">
            <option value="">Все</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-4">
          <fieldset>
            <legend className="field-label">Период</legend>
            <div className="flex flex-wrap gap-2">
              <select name="dateField" defaultValue={f.dateField} aria-label="По какой дате фильтровать" className="field w-auto flex-none">
                <option value="event">Дата мероприятия</option>
                <option value="created">Дата заявки</option>
              </select>
              <input name="from" type="date" defaultValue={f.from} aria-label="С" className="field min-w-0 flex-1" />
              <input name="to" type="date" defaultValue={f.to} aria-label="По" className="field min-w-0 flex-1" />
            </div>
          </fieldset>
        </div>
        <div className="flex gap-2 md:col-span-12">
          <button type="submit" className="btn btn-primary min-h-11">
            Применить
          </button>
          {hasFilters && (
            <Link href="/admin" className="btn btn-outline min-h-11">
              Сбросить
            </Link>
          )}
          <span className="ml-auto self-center text-sm text-muted">Найдено: {data.filteredCount}</span>
        </div>
      </form>

      {data.rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-muted">
          {hasFilters ? "По этим условиям заявок нет. Измените фильтры." : "Заявок пока нет. Они появятся здесь сразу после отправки формы на сайте."}
        </div>
      ) : (
        <>
          <BookingList
            rows={data.rows.map((r) => ({
              id: r.id,
              number: r.number,
              eventType: r.eventType,
              status: r.status,
              clientName: r.clientName,
              phone: r.phone,
              city: r.city,
              guests: r.guests,
              eventDate: r.eventDate ? formatDateRu(r.eventDate.toISOString().slice(0, 10)) : null,
              createdAt: r.createdAt.toLocaleDateString("ru-RU"),
              busy: data.busy[r.id] ?? null,
            }))}
          />

          {pages > 1 && (
            <nav aria-label="Страницы" className="flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pages || Math.abs(p - f.page) <= 2)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {i > 0 && p - arr[i - 1] > 1 && <span className="text-muted">…</span>}
                    <Link
                      href={qs(f, { page: p })}
                      aria-current={p === f.page ? "page" : undefined}
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-full text-sm tabular-nums",
                        p === f.page ? "bg-velvet text-paper" : "bg-white hover:bg-paper",
                      )}
                    >
                      {p}
                    </Link>
                  </span>
                ))}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
