import { t } from "@/i18n/t";
import type { Locale } from "@/i18n/config";
import type { Question } from "./types";

/**
 * Перевод вопроса анкеты: заголовки, подсказки, варианты.
 * Значения (value) не меняются — заявки сохраняются одинаково на любом языке.
 */
export function localizeQuestion(q: Question, locale: Locale): Question {
  if (locale === "ru") return q;
  const tr = (s?: string) => (s === undefined ? undefined : t(locale, s));
  const base = {
    ...q,
    title: t(locale, q.title),
    description: tr(q.description),
    summaryLabel: t(locale, q.summaryLabel),
  };
  switch (q.type) {
    case "single":
    case "multi":
      return {
        ...base,
        type: q.type,
        options: q.options.map((o) => ({ ...o, label: t(locale, o.label), hint: tr(o.hint) })),
        otherPlaceholder: tr(q.otherPlaceholder),
      } as Question;
    case "text":
    case "textarea":
      return { ...base, type: q.type, placeholder: tr(q.placeholder) } as Question;
    case "number":
      return { ...base, type: q.type, placeholder: tr(q.placeholder), suffix: tr(q.suffix) } as Question;
    case "list":
      return { ...base, type: q.type, placeholder: tr(q.placeholder), addLabel: t(locale, q.addLabel) } as Question;
    case "consent":
      return { ...base, type: q.type, label: t(locale, q.label) } as Question;
    default:
      return base as Question;
  }
}
