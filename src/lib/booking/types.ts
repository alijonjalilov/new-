/**
 * Типы декларативного движка анкеты.
 * Анкета описывается данными (см. scenarios.ts), а не JSX —
 * поэтому одна и та же логика работает и в браузере, и на сервере.
 */

export const EVENT_TYPE_KEYS = [
  "WEDDING",
  "CONFERENCE",
  "CORPORATE",
  "BIRTHDAY",
  "OFFICIAL",
  "OTHER",
] as const;

export type EventTypeKey = (typeof EVENT_TYPE_KEYS)[number];

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

/** Ключевые поля, которые дублируются в отдельные колонки БД. */
export type CoreField = "eventDate" | "eventTime" | "city" | "address" | "guests" | "language";

interface BaseQuestion {
  /** Уникальный в рамках сценария ключ ответа */
  id: string;
  /** Текст вопроса на экране */
  title: string;
  /** Пояснение под вопросом */
  description?: string;
  /** Короткая подпись для резюме и админ-панели */
  summaryLabel: string;
  /** Необязательный вопрос — можно пропустить */
  optional?: boolean;
  /** Условие показа. Если не задано — вопрос показывается всегда */
  showIf?: (answers: Answers) => boolean;
  /** Если задано — значение дублируется в колонку БД */
  field?: CoreField;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: "single" | "multi";
  options: Option[];
  /** Значение варианта, при выборе которого нужно уточнить ответ текстом */
  otherValue?: string;
  otherPlaceholder?: string;
}

export interface TextQuestion extends BaseQuestion {
  type: "text" | "textarea";
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
}

export interface DateQuestion extends BaseQuestion {
  type: "date";
}

export interface TimeQuestion extends BaseQuestion {
  type: "time";
}

export interface NumberQuestion extends BaseQuestion {
  type: "number";
  min: number;
  max: number;
  placeholder?: string;
  /** Подпись после числа, например «сомони» */
  suffix?: string;
}

/** Несколько текстовых полей с кнопкой «Добавить ещё» (например, имена певцов) */
export interface ListQuestion extends BaseQuestion {
  type: "list";
  placeholder?: string;
  /** Текст кнопки добавления поля */
  addLabel: string;
  /** Сколько полей показать сразу */
  initialCount: number;
  /** Максимум полей */
  maxItems: number;
}

export type Question = ChoiceQuestion | TextQuestion | DateQuestion | TimeQuestion | NumberQuestion | ListQuestion;

export interface Scenario {
  eventType: EventTypeKey;
  questions: Question[];
}

/** Ключ, под которым хранится текстовое уточнение для варианта «Другое». */
export const otherKey = (questionId: string) => `${questionId}__other`;
