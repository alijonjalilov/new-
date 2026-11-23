/**
 * Демо-заявки для локальной проверки админ-панели.
 * Запуск:  npm run db:seed
 * НЕ запускайте на рабочей базе — данные вымышленные и помечены как тестовые.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { buildSummary, extractCoreFields } from "../src/lib/booking/engine";
import type { Answers, EventTypeKey } from "../src/lib/booking/types";

const prisma = new PrismaClient();

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const demo: { eventType: EventTypeKey; answers: Answers; name: string; status: "NEW" | "IN_PROGRESS" | "CONFIRMED" }[] = [
  {
    eventType: "WEDDING",
    name: "Тестовый клиент 1",
    status: "NEW",
    answers: {
      weddingType: "national", date: inDays(60), city: "Душанбе", venueType: "restaurant", time: "17:00",
      guests: "200-300", language: "tg-ru", secondHost: "no", music: "yes", musicTypes: ["dj", "national"],
      style: "modern", budget: "discuss",
    },
  },
  {
    eventType: "CONFERENCE",
    name: "Тестовый клиент 2",
    status: "IN_PROGRESS",
    answers: {
      conferenceType: "international", topic: "Тестовая тема", date: inDays(30), city: "Душанбе",
      venueType: "hotel", guests: "100-300", level: "international", language: "three+", interpretation: "yes",
      speakers: "4-10", officials: "yes", hostingFormat: ["full", "panels"], duration: "day", script: "draft",
      coModerator: "maybe", budget: "b3",
    },
  },
  {
    eventType: "CORPORATE",
    name: "Тестовый клиент 3",
    status: "CONFIRMED",
    answers: {
      corporateType: "new-year", company: "Тестовая компания", date: inDays(25), city: "Худжанд",
      venueType: "hall", guests: "100-200", language: "ru", duration: "hours", music: "maybe",
      showProgram: "yes", style: "energetic", budget: "b2",
    },
  },
];

async function main() {
  for (const d of demo) {
    const core = extractCoreFields(d.eventType, d.answers);
    await prisma.booking.create({
      data: {
        eventType: d.eventType,
        status: d.status,
        eventDate: core.eventDate ? new Date(`${core.eventDate}T00:00:00.000Z`) : null,
        eventTime: core.eventTime ?? null,
        city: core.city ?? null,
        address: core.address ?? null,
        guests: core.guests ?? null,
        language: core.language ?? null,
        answers: { raw: d.answers, summary: buildSummary(d.eventType, d.answers) } as unknown as Prisma.InputJsonValue,
        clientName: d.name,
        phone: "+992 00 000 00 00",
        whatsapp: "+992 00 000 00 00",
        comment: "Демо-заявка, создана скриптом seed",
      },
    });
  }
  console.log(`Создано демо-заявок: ${demo.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
