/**
 * Движок анкеты: видимость вопросов, валидация ответов, очистка
 * «осиротевших» ответов и построение резюме. Без зависимостей от React —
 * используется и в браузере, и в API.
 */
import { SCENARIOS } from "./scenarios";
import { t } from "@/i18n/t";
import type { Locale } from "@/i18n/config";
import {
  otherKey,
  type Answers,
  type AnswerValue,
  type CoreField,
  type EventTypeKey,
  type Question,
} from "./types";

export function getScenarioQuestions(eventType: EventTypeKey): Question[] {
  return SCENARIOS[eventType].questions;
}

/** Вопросы, которые видит пользователь при текущих ответах (в порядке показа). */
export function getVisibleQuestions(eventType: EventTypeKey, answers: Answers): Question[] {
  return getScenarioQuestions(eventType).filter((q) => !q.showIf || q.showIf(answers));
}

const asString = (v: AnswerValue | undefined): string => (typeof v === "string" ? v : "");
const asArray = (v: AnswerValue | undefined): string[] => (Array.isArray(v) ? v : []);

function hasOtherSelected(q: Question, answers: Answers): boolean {
  if ((q.type !== "single" && q.type !== "multi") || !q.otherValue) return false;
  const v = answers[q.id];
  return q.type === "single" ? v === q.otherValue : asArray(v).includes(q.otherValue);
}

/** Пустой ли ответ (для необязательных вопросов это нормально). */
export function isEmptyAnswer(q: Question, answers: Answers): boolean {
  const v = answers[q.id];
  if (q.type === "multi") return asArray(v).length === 0;
  if (q.type === "list") return asArray(v).every((x) => x.trim() === "");
  if (q.type === "consent") return v !== "yes";
  return asString(v).trim() === "";
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Сегодняшняя дата в формате YYYY-MM-DD (локальное время среды выполнения). */
export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/**
 * Проверка одного ответа. Возвращает текст ошибки или null.
 * `minDate` — минимальная допустимая дата (по умолчанию — вчера, с запасом на часовые пояса).
 */
export function validateAnswer(
  q: Question,
  answers: Answers,
  opts: { minDate?: string; locale?: Locale } = {},
): string | null {
  const L = opts.locale ?? "ru";
  const m = (ru: string, vars?: Record<string, string | number>) => t(L, ru, vars);
  const empty = isEmptyAnswer(q, answers);
  if (empty) {
    if (q.optional) return null;
    if (q.type === "single" || q.type === "multi") return m("Выберите вариант");
    if (q.type === "number" && q.suffix) return m("Укажите сумму цифрами");
    if (q.type === "consent") return m("Отметьте галочку, чтобы продолжить");
    return m("Заполните это поле");
  }

  const v = answers[q.id];

  switch (q.type) {
    case "single": {
      const value = asString(v);
      if (!q.options.some((o) => o.value === value)) return m("Выберите вариант из списка");
      break;
    }
    case "multi": {
      const values = asArray(v);
      if (new Set(values).size !== values.length) return m("Повторяющиеся значения");
      if (!values.every((x) => q.options.some((o) => o.value === x))) return m("Выберите варианты из списка");
      break;
    }
    case "text":
    case "textarea": {
      const value = asString(v).trim();
      const max = q.maxLength ?? (q.type === "text" ? 200 : 1000);
      if (value.length < 2) return m("Слишком коротко");
      if (value.length > max) return m("Не более {n} символов", { n: max });
      break;
    }
    case "list": {
      const values = asArray(v);
      if (values.length > q.maxItems) return m("Не более {n} полей", { n: q.maxItems });
      for (const x of values) {
        const item = x.trim();
        if (item && item.length < 2) return m("Слишком коротко");
        if (item.length > 100) return m("Не более 100 символов в одном поле");
      }
      break;
    }
    case "number": {
      const value = asString(v).trim();
      if (!/^\d+$/.test(value)) return m("Введите число");
      const n = Number(value);
      if (q.suffix) {
        if (n < q.min) return m("Сумма должна быть не меньше {min} {currency}", { min: q.min, currency: m(q.suffix) });
        if (n > q.max) return m("Слишком большая сумма");
      }
      if (n < q.min || n > q.max) return m("Число от {min} до {max}", { min: q.min, max: q.max });
      break;
    }
    case "date": {
      const value = asString(v);
      if (!isValidDate(value)) return m("Выберите корректную дату");
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const min = opts.minDate ?? todayISO(yesterday);
      if (value < min) return m("Дата уже прошла");
      const maxYear = new Date().getFullYear() + 5;
      if (Number(value.slice(0, 4)) > maxYear) return m("Слишком далёкая дата");
      break;
    }
    case "time": {
      if (!TIME_RE.test(asString(v))) return m("Укажите время в формате ЧЧ:ММ");
      break;
    }
  }

  if (hasOtherSelected(q, answers)) {
    const other = asString(answers[otherKey(q.id)]).trim();
    if (other.length < 2) return m("Уточните, пожалуйста, ваш вариант");
    if (other.length > 300) return m("Не более 300 символов");
  }

  return null;
}

/**
 * Оставляет только ответы на видимые вопросы. Повторяет проход, пока
 * набор не стабилизируется: удаление одного ответа может скрыть другие вопросы.
 */
export function pruneAnswers(eventType: EventTypeKey, answers: Answers): Answers {
  let current: Answers = { ...answers };
  for (let i = 0; i < 10; i++) {
    const visible = getVisibleQuestions(eventType, current);
    const next: Answers = {};
    for (const q of visible) {
      if (current[q.id] !== undefined) next[q.id] = current[q.id];
      if (hasOtherSelected(q, current) && current[otherKey(q.id)] !== undefined) {
        next[otherKey(q.id)] = current[otherKey(q.id)];
      }
    }
    if (Object.keys(next).length === Object.keys(current).length) return next;
    current = next;
  }
  return current;
}

/** Убирает пустые поля в вопросах-списках и лишние пробелы. */
export function normalizeAnswers(eventType: EventTypeKey, answers: Answers): Answers {
  const out: Answers = { ...answers };
  for (const q of getScenarioQuestions(eventType)) {
    if (q.type !== "list" || !Array.isArray(out[q.id])) continue;
    const items = (out[q.id] as string[]).map((x) => x.trim()).filter(Boolean);
    if (items.length) out[q.id] = items;
    else delete out[q.id];
  }
  return out;
}

/** Проверяет всю анкету. Возвращает карту ошибок по id вопроса. */
export function validateAllAnswers(
  eventType: EventTypeKey,
  answers: Answers,
  opts: { minDate?: string; locale?: Locale } = {},
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const q of getVisibleQuestions(eventType, answers)) {
    const err = validateAnswer(q, answers, opts);
    if (err) errors[q.id] = err;
  }
  return errors;
}

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Дата прописью на нужном языке: «24 января 2027» / «January 24, 2027» */
export function formatDate(iso: string, locale: Locale = "ru"): string {
  if (!isValidDate(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  if (locale === "en") return `${MONTHS_EN[m - 1]} ${d}, ${y}`;
  return `${d} ${t(locale, MONTHS[m - 1])} ${y}`;
}

export const formatDateRu = (iso: string) => formatDate(iso, "ru");

/** Человекочитаемое значение ответа. */
export function formatAnswer(q: Question, answers: Answers, locale: Locale = "ru"): string {
  const v = answers[q.id];
  const tr = (ru: string) => t(locale, ru);
  if (isEmptyAnswer(q, answers)) return "—";
  const other = asString(answers[otherKey(q.id)]).trim();

  switch (q.type) {
    case "single": {
      const opt = q.options.find((o) => o.value === v);
      if (!opt) return asString(v);
      return q.otherValue && v === q.otherValue && other ? `${tr(opt.label)}: ${other}` : tr(opt.label);
    }
    case "multi":
      return asArray(v)
        .map((x) => {
          const opt = q.options.find((o) => o.value === x);
          if (!opt) return x;
          return q.otherValue && x === q.otherValue && other ? `${tr(opt.label)} (${other})` : tr(opt.label);
        })
        .join(", ");
    case "date":
      return formatDate(asString(v), locale);
    case "consent":
      return tr("Да");
    case "list":
      return asArray(v)
        .map((x) => x.trim())
        .filter(Boolean)
        .join(", ");
    case "number": {
      const n = Number(asString(v));
      if (!q.suffix || !Number.isFinite(n)) return asString(v).trim();
      return `${n.toLocaleString(locale === "en" ? "en-US" : "ru-RU")} ${tr(q.suffix)}`;
    }
    default:
      return asString(v).trim();
  }
}

export interface SummaryItem {
  id: string;
  label: string;
  value: string;
}

export function buildSummary(eventType: EventTypeKey, answers: Answers, locale: Locale = "ru"): SummaryItem[] {
  return getVisibleQuestions(eventType, answers).map((q) => ({
    id: q.id,
    label: t(locale, q.summaryLabel),
    value: formatAnswer(q, answers, locale),
  }));
}

export type CoreFields = Partial<Record<CoreField, string>>;

/** Извлекает ключевые поля для отдельных колонок БД. */
export function extractCoreFields(eventType: EventTypeKey, answers: Answers): CoreFields {
  const result: CoreFields = {};
  for (const q of getVisibleQuestions(eventType, answers)) {
    if (!q.field || isEmptyAnswer(q, answers)) continue;
    // дату храним в ISO, остальное — в человекочитаемом виде
    result[q.field] = q.type === "date" ? asString(answers[q.id]) : formatAnswer(q, answers);
  }
  // Если адреса нет, но тип площадки указан — сохраняем его как адрес
  if (!result.address) {
    const venueQ = getVisibleQuestions(eventType, answers).find((q) => q.id === "venueType");
    if (venueQ && !isEmptyAnswer(venueQ, answers)) result.address = formatAnswer(venueQ, answers);
  }
  return result;
}
