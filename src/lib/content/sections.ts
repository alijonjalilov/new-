/**
 * Разделы «Настроек сайта»: исходные данные (из кода), проверка и применение.
 * Тексты хранятся на трёх языках; русский текст — ключ, переводы попадают в словарь.
 */
import { eventCategories } from "@/content/events";
import { getFaq, setFaqOverride } from "@/content/faq";
import { processSteps } from "@/content/process";
import { addTranslations } from "@/i18n/t";
import type { Locale } from "@/i18n/config";
import { applyBookingData, defaultBookingData, tr3, validateBookingData, type BookingData, type Tr3 } from "./booking-data";

type Section<T> = {
  title: string;
  description: string;
  getDefault: () => T;
  validate: (v: T) => string | null;
  apply: (v: T | null) => void;
};

const reg = (tr: Tr3 | undefined, tg: Record<string, string>, en: Record<string, string>) => {
  if (!tr?.ru) return "";
  if (tr.tg) tg[tr.ru] = tr.tg;
  if (tr.en) en[tr.ru] = tr.en;
  return tr.ru;
};
const flush = (tg: Record<string, string>, en: Record<string, string>) => {
  addTranslations("tg", tg);
  addTranslations("en", en);
};
const filled = (x?: Tr3) => Boolean(x?.ru?.trim());

/* ── Форматы мероприятий ─────────────────────────────── */
export type FormatData = {
  slug: string;
  title: Tr3;
  short: Tr3;
  intro: Tr3;
  includes: Tr3[];
  process: { title: Tr3; text: Tr3 }[];
  youtube: string[];
};
const FORMAT_DEFAULTS = eventCategories.map((c) => ({ ...c, includes: [...c.includes], process: [...c.process], youtube: [...c.youtube] }));

const formats: Section<FormatData[]> = {
  title: "Форматы мероприятий",
  description: "Свадьбы, конференции… — названия, описания, что входит, этапы подготовки, видео",
  getDefault: () =>
    FORMAT_DEFAULTS.map((c) => ({
      slug: c.slug,
      title: tr3(c.title)!,
      short: tr3(c.short)!,
      intro: tr3(c.intro)!,
      includes: c.includes.map((x) => tr3(x)!),
      process: c.process.map((p) => ({ title: tr3(p.title)!, text: tr3(p.text)! })),
      youtube: [...c.youtube],
    })),
  validate: (v) => {
    for (const f of v) {
      if (!filled(f.title)) return "У формата пустое название";
      if (!eventCategories.some((c) => c.slug === f.slug)) return "Неизвестный формат";
    }
    return null;
  },
  apply: (v) => {
    const tg: Record<string, string> = {};
    const en: Record<string, string> = {};
    for (const [i, c] of eventCategories.entries()) {
      const d = v?.find((f) => f.slug === c.slug);
      const def = FORMAT_DEFAULTS[i];
      c.title = d ? reg(d.title, tg, en) : def.title;
      c.short = d ? reg(d.short, tg, en) : def.short;
      c.intro = d ? reg(d.intro, tg, en) : def.intro;
      c.includes = d ? d.includes.filter(filled).map((x) => reg(x, tg, en)) : [...def.includes];
      c.process = d ? d.process.filter((p) => filled(p.title)).map((p) => ({ title: reg(p.title, tg, en), text: reg(p.text, tg, en) })) : [...def.process];
      c.youtube = d ? d.youtube.map((s) => s.trim()).filter(Boolean) : [...def.youtube];
    }
    flush(tg, en);
  },
};

/* ── Частые вопросы ─────────────────────────────────── */
export type FaqData = { slug: string; items: { q: Tr3; a: Tr3 }[] }[];
const LOCALES3: Locale[] = ["ru", "tg", "en"];
const faq: Section<FaqData> = {
  title: "Частые вопросы",
  description: "Вопросы и ответы на страницах форматов",
  getDefault: () =>
    eventCategories.map((c) => {
      const by = Object.fromEntries(LOCALES3.map((l) => [l, getFaq(c.slug, l, { original: true })])) as Record<Locale, { q: string; a: string }[]>;
      return {
        slug: c.slug,
        items: by.ru.map((_, i) => ({
          q: { ru: by.ru[i].q, tg: by.tg[i]?.q ?? "", en: by.en[i]?.q ?? "" },
          a: { ru: by.ru[i].a, tg: by.tg[i]?.a ?? "", en: by.en[i]?.a ?? "" },
        })),
      };
    }),
  validate: (v) => (v.some((f) => f.items.some((i) => filled(i.q) !== filled(i.a))) ? "У вопроса нет ответа (или наоборот)" : null),
  apply: (v) =>
    setFaqOverride(v ? Object.fromEntries(v.map((f) => [f.slug, f.items.filter((i) => filled(i.q))])) : null),
};

/* ── Как мы работаем ────────────────────────────────── */
export type StepsData = { title: Tr3; text: Tr3 }[];
const STEPS_DEFAULT = processSteps.map((s) => ({ ...s }));
const steps: Section<StepsData> = {
  title: "Как мы работаем",
  description: "Шаги работы с клиентом на главной (оба дизайна)",
  getDefault: () => STEPS_DEFAULT.map((s) => ({ title: tr3(s.title)!, text: tr3(s.text)! })),
  validate: (v) => (v.length < 1 || v.length > 8 ? "Нужно от 1 до 8 шагов" : v.some((s) => !filled(s.title)) ? "У шага пустое название" : null),
  apply: (v) => {
    const tg: Record<string, string> = {};
    const en: Record<string, string> = {};
    const next = v ? v.map((s) => ({ title: reg(s.title, tg, en), text: reg(s.text, tg, en) })) : STEPS_DEFAULT.map((s) => ({ ...s }));
    processSteps.splice(0, processSteps.length, ...next);
    flush(tg, en);
  },
};

/* ── Анкета бронирования ────────────────────────────── */
const booking: Section<BookingData> = {
  title: "Анкета бронирования",
  description: "Вопросы, варианты ответов, порядок и условия для каждого вида мероприятия",
  getDefault: defaultBookingData,
  validate: validateBookingData,
  apply: applyBookingData,
};

export const SECTIONS = { booking, formats, faq, steps } as const;
export type SectionKey = keyof typeof SECTIONS;
export const isSectionKey = (k: unknown): k is SectionKey => typeof k === "string" && k in SECTIONS;
