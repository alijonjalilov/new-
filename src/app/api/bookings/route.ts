import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { parseBookingSubmission } from "@/lib/booking/validation";
import { buildSummary, extractCoreFields } from "@/lib/booking/engine";
import { EVENT_TYPE_BY_KEY } from "@/lib/booking/event-types";
import { notifyNewBooking } from "@/lib/notifications";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/site";
import { t } from "@/i18n/t";
import { isLocale, type Locale } from "@/i18n/config";
import { isSiteClosed } from "@/lib/site-settings";
import { conflictMessage, findConflicts } from "@/lib/booking/schedule";
import { loadConfirmedOn } from "@/lib/booking/schedule-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const nullIfEmpty = (s: string | undefined | null) => (s && s.trim() ? s.trim() : null);

export async function POST(request: Request) {
  // Язык ответа: из адреса страницы-источника (для сообщений об ошибках)
  const headerLocale = request.headers.get("x-site-locale");
  const refLocale: Locale = isLocale(headerLocale) ? headerLocale : "ru";

  if (await isSiteClosed()) {
    return NextResponse.json(
      { ok: false, message: t(refLocale, "Сайт временно закрыт. Позвоните или напишите нам напрямую.") },
      { status: 503 },
    );
  }
  const limit = rateLimit(`booking:${clientIp(request.headers)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: t(refLocale, "Слишком много заявок подряд. Попробуйте позже или свяжитесь с нами напрямую.") },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: t(refLocale, "Некорректный запрос") }, { status: 400 });
  }

  // Ловушка для ботов: скрытое поле заполнено — делаем вид, что всё хорошо, но ничего не сохраняем
  const honeypot = (body as { contact?: { website?: unknown } })?.contact?.website;
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true, number: 0 }, { status: 201 });
  }

  const parsed = parseBookingSubmission(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors }, { status: 422 });
  }

  const { eventType, answers, contact } = parsed.data;
  const siteLocale: Locale = isLocale(parsed.data.locale) ? parsed.data.locale : "ru";
  const core = extractCoreFields(eventType, answers);
  const summary = buildSummary(eventType, answers);
  const whatsapp = contact.sameWhatsapp ? contact.phone : contact.whatsapp;
  const extraPhones = contact.extraPhones.map((p) => p.trim()).filter(Boolean);

  try {
    const booking = await prisma.booking.create({
      data: {
        eventType,
        eventDate: core.eventDate ? new Date(`${core.eventDate}T00:00:00.000Z`) : null,
        eventTime: core.eventTime ?? null,
        city: core.city ?? null,
        address: core.address ?? null,
        guests: core.guests ?? null,
        language: core.language ?? null,
        // Сохраняем и «сырые» ответы, и читаемое резюме — так заявка
        // останется понятной, даже если вопросы анкеты потом изменятся.
        answers: { raw: answers, summary, locale: siteLocale } as unknown as Prisma.InputJsonValue,
        clientName: contact.name,
        phone: contact.phone,
        whatsapp: nullIfEmpty(whatsapp),
        extraPhones,
        comment: nullIfEmpty(contact.comment),
      },
      select: { id: true, number: true },
    });

    // Проверяем, не занят ли ведущий в это время (ошибка проверки не мешает заявке)
    let warning: string | null = null;
    try {
      const date = core.eventDate ?? null;
      warning = conflictMessage(
        findConflicts(
          { id: booking.id, number: booking.number, eventType, status: "NEW", date, time: core.eventTime ?? null, answers: { raw: answers } },
          await loadConfirmedOn([date]),
        ),
      );
    } catch (e) {
      console.error("[bookings] Не удалось проверить занятость:", e);
    }

    // Уведомления не блокируют ответ дольше нескольких секунд и не ломают сохранение
    await notifyNewBooking({
      id: booking.id,
      number: booking.number,
      eventTypeLabel: EVENT_TYPE_BY_KEY[eventType].label,
      clientName: contact.name,
      phone: contact.phone,
      whatsapp: nullIfEmpty(whatsapp),
      extraPhones,
      comment: nullIfEmpty(contact.comment),
      summary,
      adminUrl: `${siteUrl()}/admin/bookings/${booking.id}`,
      warning,
      siteLocale,
    }).catch((e) => console.error("[notifications]", e));

    return NextResponse.json({ ok: true, number: booking.number }, { status: 201 });
  } catch (error) {
    console.error("[bookings] Ошибка сохранения заявки:", error);
    return NextResponse.json(
      {
        ok: false,
        message: t(refLocale, "Не удалось сохранить заявку. Пожалуйста, попробуйте ещё раз или свяжитесь с нами по телефону."),
      },
      { status: 500 },
    );
  }
}
