import { prisma } from "@/lib/db";
import { toISODate, type ScheduleItem } from "./schedule";

export const scheduleSelect = {
  id: true,
  number: true,
  eventType: true,
  status: true,
  eventDate: true,
  eventTime: true,
  answers: true,
  clientName: true,
} as const;

type Row = {
  id: string;
  number: number;
  eventType: string;
  status: string;
  eventDate: Date | null;
  eventTime: string | null;
  answers: unknown;
  clientName: string;
};

export function toScheduleItem(b: Row): ScheduleItem {
  return {
    id: b.id,
    number: b.number,
    eventType: b.eventType,
    status: b.status,
    date: toISODate(b.eventDate),
    time: b.eventTime,
    answers: b.answers,
    clientName: b.clientName,
  };
}

/** Подтверждённые заявки на указанные даты (YYYY-MM-DD). */
export async function loadConfirmedOn(dates: (string | null)[]): Promise<ScheduleItem[]> {
  const unique = [...new Set(dates.filter((d): d is string => !!d))];
  if (unique.length === 0) return [];
  const rows = await prisma.booking.findMany({
    where: { status: "CONFIRMED", eventDate: { in: unique.map((d) => new Date(`${d}T00:00:00.000Z`)) } },
    select: scheduleSelect,
  });
  return rows.map(toScheduleItem);
}
