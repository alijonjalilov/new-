import { z } from "zod";
import { normalizeAnswers, pruneAnswers, validateAllAnswers } from "./engine";
import { EVENT_TYPE_KEYS, type Answers } from "./types";

/** Телефон: от 9 до 15 цифр, допускаются +, пробелы, скобки и дефисы. */
const phoneRe = /^\+?[\d\s()-]{9,24}$/;
const digitsCount = (s: string) => s.replace(/\D/g, "").length;
export const isValidPhone = (v: string) => phoneRe.test(v.trim()) && digitsCount(v) >= 9 && digitsCount(v) <= 15;
const PHONE_HINT = "Номер должен содержать минимум 9 цифр, например 88 888 76 88";

/** Сколько дополнительных номеров можно добавить */
export const MAX_EXTRA_PHONES = 2;

/** Контактная форма — общая для клиента (React Hook Form) и сервера. */
export const contactSchema = z
  .object({
    name: z.string().trim().min(3, "Введите имя и фамилию (минимум 3 буквы)").max(100, "Слишком длинное имя"),
    phone: z.string().trim().min(1, "Введите номер телефона").refine(isValidPhone, PHONE_HINT),
    /** Дополнительные номера: пустые поля игнорируются */
    extraPhones: z.array(z.string().trim().max(30)).max(MAX_EXTRA_PHONES),
    sameWhatsapp: z.boolean(),
    whatsapp: z.string().trim().max(30),
    comment: z.string().trim().max(2000, "Не более 2000 символов"),
    /** Скрытое поле-ловушка для ботов: люди его не видят и не заполняют */
    website: z.string().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    data.extraPhones.forEach((p, i) => {
      if (p && !isValidPhone(p)) ctx.addIssue({ code: "custom", path: ["extraPhones", i], message: PHONE_HINT });
    });
    if (data.sameWhatsapp) return;
    const w = data.whatsapp.trim();
    if (!w) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "Укажите номер WhatsApp или отметьте, что он совпадает с телефоном" });
    } else if (!isValidPhone(w)) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: PHONE_HINT });
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

  const answers = normalizeAnswers(parsed.data.eventType, pruneAnswers(parsed.data.eventType, parsed.data.answers));
  const answerErrors = validateAllAnswers(parsed.data.eventType, answers);
  if (Object.keys(answerErrors).length > 0) {
    const fieldErrors = Object.fromEntries(Object.entries(answerErrors).map(([k, v]) => [`answers.${k}`, v]));
    return { ok: false, fieldErrors, message: "Не все вопросы анкеты заполнены корректно" };
  }

  return { ok: true, data: { ...parsed.data, answers } };
}
