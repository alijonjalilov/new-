/**
 * Движок анкеты: видимость вопросов, валидация ответов, очистка
 * «осиротевших» ответов и построение резюме. Без зависимостей от React —
 * используется и в браузере, и в API.
 */
import { SCENARIOS } from "./scenarios";
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
export function validateAnswer(q: Question, answers: Answers, opts: { minDate?: string } = {}): string | null {
  const empty = isEmptyAnswer(q, answers);
  if (empty) return q.optional ? null : q.type === "single" || q.type === "multi" ? "Выберите вариант" : "Заполните это поле";

  const v = answers[q.id];

  switch (q.type) {
    case "single": {
      const value = asString(v);
      if (!q.options.some((o) => o.value === value)) return "Выберите вариант из списка";
      break;
    }
    case "multi": {
      const values = asArray(v);
      if (new Set(values).size !== values.length) return "Повторяющиеся значения";
      if (!values.every((x) => q.options.some((o) => o.value === x))) return "Выберите варианты из списка";
      break;
    }
    case "text":
    case "textarea": {
      const value = asString(v).trim();
      const max = q.maxLength ?? (q.type === "text" ? 200 : 1000);
      if (value.length < 2) return "Слишком коротко";
      if (value.length > max) return `Не более ${max} символов`;
      break;
    }
    case "number": {
      const value = asString(v).trim();
      if (!/^\d+$/.test(value)) return "Введите число";
      const n = Number(value);
      if (n < q.min || n > q.max) return `Число от ${q.min} до ${q.max}`;
      break;
    }
    case "date": {
      const value = asString(v);
      if (!isValidDate(value)) return "Выберите корректную дату";
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const min = opts.minDate ?? todayISO(yesterday);
      if (value < min) return "Дата уже прошла";
      const maxYear = new Date().getFullYear() + 5;
      if (Number(value.slice(0, 4)) > maxYear) return "Слишком далёкая дата";
      break;
    }
    case "time": {
      if (!TIME_RE.test(asString(v))) return "Укажите время в формате ЧЧ:ММ";
      break;
    }
  }

  if (hasOtherSelected(q, answers)) {
    const other = asString(answers[otherKey(q.id)]).trim();
    if (other.length < 2) return "Уточните, пожалуйста, ваш вариант";
    if (other.length > 300) return "Не более 300 символов";
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

/** Проверяет всю анкету. Возвращает карту ошибок по id вопроса. */
export function validateAllAnswers(
  eventType: EventTypeKey,
  answers: Answers,
  opts: { minDate?: string } = {},
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

export function formatDateRu(iso: string): string {
  if (!isValidDate(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Человекочитаемое значение ответа. */
export function formatAnswer(q: Question, answers: Answers): string {
  const v = answers[q.id];
  if (isEmptyAnswer(q, answers)) return "—";
  const other = asString(answers[otherKey(q.id)]).trim();

  switch (q.type) {
    case "single": {
      const opt = q.options.find((o) => o.value === v);
      if (!opt) return asString(v);
      return q.otherValue && v === q.otherValue && other ? `${opt.label}: ${other}` : opt.label;
    }
    case "multi":
      return asArray(v)
        .map((x) => {
          const opt = q.options.find((o) => o.value === x);
          if (!opt) return x;
          return q.otherValue && x === q.otherValue && other ? `${opt.label} (${other})` : opt.label;
        })
        .join(", ");
    case "date":
      return formatDateRu(asString(v));
    default:
      return asString(v).trim();
  }
}

export interface SummaryItem {
  id: string;
  label: string;
  value: string;
}

export function buildSummary(eventType: EventTypeKey, answers: Answers): SummaryItem[] {
  return getVisibleQuestions(eventType, answers).map((q) => ({
    id: q.id,
    label: q.summaryLabel,
    value: formatAnswer(q, answers),
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
