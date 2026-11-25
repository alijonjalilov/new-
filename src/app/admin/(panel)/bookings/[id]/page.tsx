import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AtSign, MessageCircle, Phone } from "lucide-react";
import { prisma } from "@/lib/db";
import { EVENT_TYPE_BY_KEY } from "@/lib/booking/event-types";
import { buildSummary, formatDateRu, type SummaryItem } from "@/lib/booking/engine";
import type { Answers } from "@/lib/booking/types";
import { StatusBadge } from "@/components/admin/status-badge";
import { BookingActions } from "@/components/admin/booking-actions";
import { conflictMessage, eventWindow, findConflicts, formatWindow } from "@/lib/booking/schedule";
import { loadConfirmedOn, toScheduleItem } from "@/lib/booking/schedule-db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Заявка" };

type Props = { params: Promise<{ id: string }> };

/** Резюме сохраняется вместе с заявкой; если его нет — строим из сырых ответов. */
function readSummary(eventType: keyof typeof EVENT_TYPE_BY_KEY, stored: unknown): SummaryItem[] {
  const obj = (stored ?? {}) as { summary?: unknown; raw?: unknown };
  if (Array.isArray(obj.summary)) {
    return obj.summary.filter(
      (s): s is SummaryItem => !!s && typeof s === "object" && "label" in s && "value" in s,
    );
  }
  if (obj.raw && typeof obj.raw === "object") return buildSummary(eventType, obj.raw as Answers);
  return [];
}

const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const b = await prisma.booking.findUnique({ where: { id } });
  if (!b) notFound();

  const summary = readSummary(b.eventType, b.answers);
  const item = toScheduleItem(b);
  const busy = conflictMessage(findConflicts(item, await loadConfirmedOn([item.date])));

  const key = [
    { label: "Дата", value: b.eventDate ? formatDateRu(b.eventDate.toISOString().slice(0, 10)) : null },
    { label: "Время", value: b.eventTime ? `${b.eventTime} (примерно ${formatWindow(eventWindow(item))})` : null },
    { label: "Город", value: b.city },
    { label: "Площадка / адрес", value: b.address },
    { label: "Гостей", value: b.guests },
    { label: "Язык второго ведущего", value: b.language },
    { label: "Язык сайта", value: (b.answers as { locale?: string } | null)?.locale === "en" ? "Английский" : "Русский" },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" /> Все заявки
      </Link>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted">
            Заявка №{b.number}, получена {b.createdAt.toLocaleString("ru-RU", { dateStyle: "long", timeStyle: "short" })}
          </p>
          <h1 className="mt-1 font-display text-3xl font-light tracking-tight">{EVENT_TYPE_BY_KEY[b.eventType].label}</h1>
        </div>
        <StatusBadge status={b.status} />
      </div>

      {busy && (
        <div role="alert" className="rounded-2xl border border-danger/30 bg-danger/5 p-5 text-danger">
          <p className="font-medium">Вы уже заняты в это время</p>
          <p className="mt-1 text-sm">{busy}</p>
          {item.date && (
            <Link href={`/admin/calendar?month=${item.date.slice(0, 7)}&day=${item.date}`} className="mt-2 inline-block text-sm underline">
              Открыть день в календаре
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6">
            <h2 className="mb-4 font-medium">Главное</h2>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {key.map((k) => (
                <div key={k.label}>
                  <dt className="text-sm text-muted">{k.label}</dt>
                  <dd className="mt-0.5">{k.value || "—"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-6">
            <h2 className="mb-2 font-medium">Все ответы анкеты</h2>
            <dl>
              {summary.map((s, i) => (
                <div key={`${s.label}-${i}`} className="grid gap-1 border-b border-line py-3 last:border-0 sm:grid-cols-[14rem_1fr] sm:gap-4">
                  <dt className="text-sm text-muted">{s.label}</dt>
                  <dd className="break-words">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {b.comment && (
            <section className="rounded-2xl bg-white p-6">
              <h2 className="mb-2 font-medium">Комментарий клиента</h2>
              <p className="whitespace-pre-wrap">{b.comment}</p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6">
            <h2 className="mb-4 font-medium">Клиент</h2>
            <p className="text-lg">{b.clientName}</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 hover:text-brass-deep">
                  <Phone aria-hidden className="size-4 text-muted" />
                  {b.phone}
                </a>
              </li>
              {b.extraPhones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 hover:text-brass-deep">
                    <Phone aria-hidden className="size-4 text-muted" />
                    {p} <span className="text-sm text-muted">(доп.)</span>
                  </a>
                </li>
              ))}
              {b.whatsapp && (
                <li>
                  <a href={waLink(b.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-brass-deep">
                    <MessageCircle aria-hidden className="size-4 text-muted" />
                    WhatsApp: {b.whatsapp}
                  </a>
                </li>
              )}
              {b.email && (
                <li>
                  <a href={`mailto:${b.email}`} className="flex items-center gap-3 break-all hover:text-brass-deep">
                    <AtSign aria-hidden className="size-4 text-muted" />
                    {b.email}
                  </a>
                </li>
              )}
            </ul>
          </section>

          <BookingActions id={b.id} status={b.status} adminNote={b.adminNote ?? ""} deleted={b.deletedAt !== null} />
        </div>
      </div>
    </div>
  );
}
