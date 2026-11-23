/**
 * Занятость ведущего: оценка времени мероприятия и поиск пересечений
 * с уже подтверждёнными заявками. Без зависимостей — работает и в API, и в админке.
 *
 * В заявке есть только время начала, поэтому длительность оцениваем:
 *  - по ответу «Продолжительность» (если вопрос был в анкете);
 *  - иначе по типу мероприятия (см. DEFAULT_HOURS).
 * Если время начала не указано — считаем занятым весь день.
 * Числа можно поменять под себя.
 */

export const DEFAULT_HOURS: Record<string, number> = {
  WEDDING: 6,
  CONFERENCE: 5,
  CORPORATE: 5,
  BIRTHDAY: 5,
  OFFICIAL: 4,
  OTHER: 5,
};

/** Ответ на вопрос «Продолжительность» → часы (null — весь день). */
const DURATION_HOURS: Record<string, number | null> = {
  hours: 4,
  half: 6,
  day: null,
  days: null,
};

export interface ScheduleItem {
  id: string;
  number: number;
  eventType: string;
  status: string;
  /** YYYY-MM-DD */
  date: string | null;
  /** HH:MM */
  time: string | null;
  /** Ответы анкеты (используем только duration) */
  answers?: unknown;
  clientName?: string;
}

export interface TimeWindow {
  /** Минуты от начала дня */
  start: number;
  end: number;
  allDay: boolean;
}

const DAY = 24 * 60;

function durationAnswer(answers: unknown): string | null {
  const raw = (answers as { raw?: Record<string, unknown> } | null)?.raw;
  const v = raw?.duration;
  return typeof v === "string" ? v : null;
}

export function eventWindow(item: ScheduleItem): TimeWindow {
  const dur = durationAnswer(item.answers);
  const durHours = dur && dur in DURATION_HOURS ? DURATION_HOURS[dur] : DEFAULT_HOURS[item.eventType] ?? 5;
  const m = item.time?.match(/^(\d{2}):(\d{2})$/);
  if (!m || durHours === null) return { start: 0, end: DAY, allDay: true };
  const start = Number(m[1]) * 60 + Number(m[2]);
  return { start, end: Math.min(start + durHours * 60, DAY), allDay: false };
}

export const windowsOverlap = (a: TimeWindow, b: TimeWindow) => a.start < b.end && b.start < a.end;

const hhmm = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export function formatWindow(w: TimeWindow): string {
  if (w.allDay) return "весь день";
  return `${hhmm(w.start)}–${w.end >= DAY ? "24:00" : hhmm(w.end)}`;
}

/**
 * Подтверждённые заявки, которые пересекаются с item по дате и времени.
 * Сама заявка и отклонённые в расчёт не берутся.
 */
export function findConflicts(item: ScheduleItem, others: ScheduleItem[]): ScheduleItem[] {
  if (!item.date || item.status === "REJECTED") return [];
  const w = eventWindow(item);
  return others.filter(
    (o) => o.id !== item.id && o.status === "CONFIRMED" && o.date === item.date && windowsOverlap(w, eventWindow(o)),
  );
}

/** Текст предупреждения для админки и уведомлений. */
export function conflictMessage(conflicts: ScheduleItem[]): string | null {
  if (conflicts.length === 0) return null;
  const list = conflicts.map((c) => `№${c.number} (${formatWindow(eventWindow(c))})`).join(", ");
  return `В этот день и время вы уже заняты: подтверждена заявка ${list}.`;
}

export const toISODate = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);
