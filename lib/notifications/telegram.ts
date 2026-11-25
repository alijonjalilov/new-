import type { NotificationChannel } from "./types";
import { plainTextNotification } from "./format";

/** Telegram Bot API. Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID. */
export const telegramChannel: NotificationChannel = {
  name: "telegram",
  isConfigured: () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  async send(n) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        // Обычный текст — без parse_mode, чтобы спецсимволы в ответах клиента ничего не ломали
        text: plainTextNotification(n).slice(0, 4000),
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) throw new Error(`Telegram API ${res.status}: ${await res.text()}`);
  },
};
