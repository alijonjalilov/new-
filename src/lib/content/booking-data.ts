/**
 * Анкета бронирования в виде данных — для «Настроек сайта».
 * Работает и в браузере, и на сервере: одни и те же функции превращают
 * сохранённые в базе вопросы (на трёх языках) в вопросы анкеты.
 */
import { addTranslations, t } from "@/i18n/t";
import { SCENARIOS } from "@/lib/booking/scenarios";
import { EVENT_TYPE_KEYS, ruleToShowIf, type EventTypeKey, type Question, type ShowIfRule } from "@/lib/booking/types";

export type Tr3 = { ru: string; tg: string; en: string };

export type QData = {
  id: string;
  type: Question["type"];
  title: Tr3;
  description?: Tr3;
  summaryLabel: Tr3;
  optional?: boolean;
  field?: string;
  showIf?: ShowIfRule | null;
  options?: { value: string; label: Tr3; hint?: Tr3 }[];
  otherValue?: string;
  otherPlaceholder?: Tr3;
  placeholder?: Tr3;
  maxLength?: number;
  autoComplete?: string;
  min?: number;
  max?: number;
  suffix?: Tr3;
  addLabel?: Tr3;
  initialCount?: number;
  maxItems?: number;
  label?: Tr3;
};

export type BookingData = Record<EventTypeKey, QData[]>;

/** Исходные вопросы из кода — снимок до любых изменений из базы */
const DEFAULTS: Record<EventTypeKey, Question[]> = Object.fromEntries(
  EVENT_TYPE_KEYS.map((k) => [k, [...SCENARIOS[k].questions]]),
) as Record<EventTypeKey, Question[]>;

export const tr3 = (ru?: string): Tr3 | undefined =>
  ru === undefined ? undefined : { ru, tg: t("tg", ru), en: t("en", ru) };

/** Вопрос анкеты → данные на трёх языках */
function toData(q: Question): QData {
  const a = q as Question & Record<string, unknown>;
  const rule = (q.showIf as unknown as { rule?: ShowIfRule } | undefined)?.rule ?? null;
  const d: QData = {
    id: q.id,
    type: q.type,
    title: tr3(q.title)!,
    description: tr3(q.description),
    summaryLabel: tr3(q.summaryLabel)!,
    optional: q.optional,
    field: q.field,
    showIf: rule,
  };
  if (q.type === "single" || q.type === "multi") {
    d.options = q.options.map((o) => ({ value: o.value, label: tr3(o.label)!, hint: tr3(o.hint) }));
    d.otherValue = q.otherValue;
    d.otherPlaceholder = tr3(q.otherPlaceholder);
  }
  if ("placeholder" in a) d.placeholder = tr3(a.placeholder as string | undefined);
  if ("maxLength" in a) d.maxLength = a.maxLength as number;
  if ("autoComplete" in a) d.autoComplete = a.autoComplete as string;
  if (q.type === "number") Object.assign(d, { min: q.min, max: q.max, suffix: tr3(q.suffix) });
  if (q.type === "list") Object.assign(d, { addLabel: tr3(q.addLabel), initialCount: q.initialCount, maxItems: q.maxItems });
  if (q.type === "consent") d.label = tr3(q.label);
  return d;
}

/** Исходная анкета (как в коде) в виде данных */
export function defaultBookingData(): BookingData {
  return Object.fromEntries(EVENT_TYPE_KEYS.map((k) => [k, DEFAULTS[k].map(toData)])) as BookingData;
}

/** Данные → вопрос анкеты (русские тексты; переводы регистрируются в словаре) */
function fromData(d: QData, tg: Record<string, string>, en: Record<string, string>): Question {
  const ru = (x?: Tr3) => {
    if (!x) return undefined;
    if (x.tg) tg[x.ru] = x.tg;
    if (x.en) en[x.ru] = x.en;
    return x.ru;
  };
  const base = {
    id: d.id,
    title: ru(d.title)!,
    description: ru(d.description) || undefined,
    summaryLabel: ru(d.summaryLabel) || d.title.ru,
    optional: d.optional || undefined,
    field: (d.field || undefined) as Question["field"],
    showIf: d.showIf && d.showIf.q ? ruleToShowIf(d.showIf) : undefined,
  };
  switch (d.type) {
    case "single":
    case "multi":
      return {
        ...base,
        type: d.type,
        options: (d.options ?? []).map((o) => ({ value: o.value, label: ru(o.label)!, hint: ru(o.hint) || undefined })),
        otherValue: d.otherValue || undefined,
        otherPlaceholder: ru(d.otherPlaceholder) || undefined,
      };
    case "text":
    case "textarea":
      return { ...base, type: d.type, placeholder: ru(d.placeholder) || undefined, maxLength: d.maxLength || undefined, autoComplete: d.autoComplete };
    case "number":
      return { ...base, type: "number", min: d.min ?? 0, max: d.max ?? 1_000_000_000, placeholder: ru(d.placeholder) || undefined, suffix: ru(d.suffix) || undefined };
    case "list":
      return { ...base, type: "list", placeholder: ru(d.placeholder) || undefined, addLabel: ru(d.addLabel) || "+", initialCount: d.initialCount ?? 1, maxItems: d.maxItems ?? 10 };
    case "consent":
      return { ...base, type: "consent", label: ru(d.label) || d.title.ru };
    default:
      return { ...base, type: d.type } as Question;
  }
}

/** Применить анкету из базы (null — вернуть исходную из кода) */
export function applyBookingData(data: BookingData | null) {
  const tg: Record<string, string> = {};
  const en: Record<string, string> = {};
  for (const k of EVENT_TYPE_KEYS) {
    const list = data?.[k];
    SCENARIOS[k].questions = list ? list.map((d) => fromData(d, tg, en)) : [...DEFAULTS[k]];
  }
  addTranslations("tg", tg);
  addTranslations("en", en);
}

/** Проверка перед сохранением: понятная ошибка или null */
export function validateBookingData(data: unknown): string | null {
  if (!data || typeof data !== "object") return "Нет данных";
  const d = data as BookingData;
  for (const k of EVENT_TYPE_KEYS) {
    const list = d[k];
    if (!Array.isArray(list) || list.length === 0) return `В анкете «${k}» нет вопросов`;
    const ids = new Set<string>();
    for (const [i, q] of list.entries()) {
      const where = `Анкета ${k}, вопрос ${i + 1}`;
      if (!q.id || !/^[a-zA-Z][\w-]{0,40}$/.test(q.id)) return `${where}: неверный код вопроса`;
      if (ids.has(q.id)) return `${where}: повторяется код «${q.id}»`;
      if (!q.title?.ru?.trim()) return `${where}: пустой текст вопроса на русском`;
      if ((q.type === "single" || q.type === "multi")) {
        if (!q.options?.length) return `${where}: добавьте хотя бы один вариант ответа`;
        const vals = new Set<string>();
        for (const o of q.options) {
          if (!o.label?.ru?.trim()) return `${where}: у варианта нет текста на русском`;
          if (vals.has(o.value)) return `${where}: повторяется вариант «${o.label.ru}»`;
          vals.add(o.value);
        }
      }
      if (q.showIf && q.showIf.q && !ids.has(q.showIf.q)) return `${where}: условие ссылается на вопрос, который стоит ниже или удалён`;
      ids.add(q.id);
    }
  }
  return null;
}
