/**
 * Уведомления о новых заявках.
 *
 * Архитектура: список «каналов» (Telegram, e-mail). Каждый канал сам решает,
 * настроен ли он (по переменным окружения). Ошибка или отсутствие ключей
 * НИКОГДА не ломают сохранение заявки — заявка уже лежит в базе.
 *
 * Чтобы добавить новый канал (например, WhatsApp Business или Slack),
 * реализуйте интерфейс NotificationChannel и добавьте его в CHANNELS.
 */
import { telegramChannel } from "./telegram";
import { emailChannel } from "./email";
import type { NotificationChannel } from "./types";

export type { BookingNotification, NotificationChannel } from "./types";
export { plainTextNotification } from "./format";
import type { BookingNotification } from "./types";

const CHANNELS: NotificationChannel[] = [telegramChannel, emailChannel];

export async function notifyNewBooking(n: BookingNotification): Promise<void> {
  const active = CHANNELS.filter((c) => c.isConfigured());
  if (active.length === 0) return;

  const results = await Promise.allSettled(
    active.map((c) =>
      Promise.race([
        c.send(n),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000)),
      ]),
    ),
  );

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[notifications] канал «${active[i].name}» не отправил уведомление:`, r.reason);
    }
  });
}
