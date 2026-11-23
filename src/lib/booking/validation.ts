import { z } from "zod";
import { pruneAnswers, validateAllAnswers } from "./engine";
import { EVENT_TYPE_KEYS, type Answers } from "./types";

/** Телефон: 7–15 цифр, допускаются +, пробелы, скобки и дефисы. */
const phoneRe = /^\+?[\d\s()-]{7,22}$/;
const digitsCount = (s: string) => s.replace(/\D/g, "").length;

const phone = (requiredMsg: string) =>
  z
    .string()
    .trim()
    .min(1, requiredMsg)
    .refine((v) => phoneRe.test(v) && digitsCount(v) >= 7 && digitsCount(v) <= 15, "Введите номер в формате +992 XX XXX XX XX");

/** Контактная форма — общая для клиента (React Hook Form) и сервера. */
export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Введите имя и фамилию").max(100, "Слишком длинное имя"),
    phone: phone("Введите номер телефона"),
    sameWhatsapp: z.boolean(),
    whatsapp: z.string().trim().max(30),
    email: z.union([z.literal(""), z.email("Некорректный e-mail").max(160)]),
    comment: z.string().trim().max(2000, "Не более 2000 символов"),
    /** Скрытое поле-ловушка для ботов: люди его не видят и не заполняют */
    website: z.string().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sameWhatsapp) return;
    const w = data.whatsapp.trim();
    if (!w) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Укажите номер WhatsApp или отметьте, что он совпадает с телефоном" });
    } else if (!phoneRe.test(w) || digitsCount(w) < 7 || digitsCount(w) > 15) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Введите номер в формате +992 XX XXX XX XX" });
    }
  });

export type ContactInput = z.infer<typeof contactSchema>;

const answerValue = z.union([z.string().max(2000), z.array(z.string().max(100)).max(20)]);

export const bookingSubmissionSchema = z.object({
  eventType: z.enum(EVENT_TYPE_KEYS),
  answers: z.record(z.string().max(60), answerValue),
  contact: contactSchema,
});

export type BookingSubmission = z.infer<typeof bookingSubmissionSchema>;

export type ParsedBooking =
  | { ok: true; data: BookingSubmission & { answers: Answers } }
  | { ok: false; fieldErrors: Record<string, string>; message: string };

/**
 * Полная серверная проверка: структура (Zod) + условная логика сценария.
 * Ответы на скрытые вопросы отбрасываются ещё до проверки.
 */
export function parseBookingSubmission(input: unknown): ParsedBooking {
  const parsed = bookingSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors, message: "Проверьте правильность заполнения формы" };
  }

  const answers = pruneAnswers(parsed.data.eventType, parsed.data.answers);
  const answerErrors = validateAllAnswers(parsed.data.eventType, answers);
  if (Object.keys(answerErrors).length > 0) {
    const fieldErrors = Object.fromEntries(Object.entries(answerErrors).map(([k, v]) => [`answers.${k}`, v]));
    return { ok: false, fieldErrors, message: "Не все вопросы анкеты заполнены корректно" };
  }

  return { ok: true, data: { ...parsed.data, answers } };
}
