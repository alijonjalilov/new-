import type { NotificationChannel } from "./types";
import { plainTextNotification } from "./format";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * E-mail через HTTP API Resend (без SDK, без SMTP).
 * Нужны RESEND_API_KEY, NOTIFY_EMAIL_FROM, NOTIFY_EMAIL_TO.
 * Чтобы использовать другого провайдера — замените функцию send.
 */
export const emailChannel: NotificationChannel = {
  name: "email",
  isConfigured: () =>
    Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_FROM && process.env.NOTIFY_EMAIL_TO),
  async send(n) {
    const text = plainTextNotification(n);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_EMAIL_FROM,
        to: process.env.NOTIFY_EMAIL_TO!.split(",").map((s) => s.trim()),
        subject: `Новая заявка №${n.number}: ${n.eventTypeLabel} — ${n.clientName}`,
        text,
        html: `<pre style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
      }),
    });
    if (!res.ok) throw new Error(`Resend API ${res.status}: ${await res.text()}`);
  },
};
