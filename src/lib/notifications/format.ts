import type { BookingNotification } from "./types";

export function plainTextNotification(n: BookingNotification): string {
  const lines = [
    `Новая заявка №${n.number} — ${n.eventTypeLabel}`,
    n.siteLocale === "en" ? "Заявка с английской версии сайта" : null,
    n.warning ? `\n⚠️ ${n.warning}` : null,
    "",
    `Клиент: ${n.clientName}`,
    `Телефон: ${n.phone}`,
    n.extraPhones?.length ? `Доп. номера: ${n.extraPhones.join(", ")}` : null,
    n.whatsapp ? `WhatsApp: ${n.whatsapp}` : null,
    n.email ? `E-mail: ${n.email}` : null,
    "",
    ...n.summary.filter((s) => s.value !== "—").map((s) => `${s.label}: ${s.value}`),
    n.comment ? `\nКомментарий: ${n.comment}` : null,
    n.adminUrl ? `\nОткрыть в админ-панели: ${n.adminUrl}` : null,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
