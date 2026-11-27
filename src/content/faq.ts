import type { Locale } from "@/i18n/config";

/**
 * Частые вопросы на страницах форматов (/events/<формат>).
 * Показываются на странице и передаются поисковикам разметкой FAQPage.
 */
type QA = { q: string; a: string };
type Tr<T> = Record<Locale, T>;

const price: Tr<(what: string) => QA> = {
  ru: (what) => ({
    q: `Сколько стоит ведущий ${what} в Душанбе?`,
    a: "Стоимость зависит от даты и формата мероприятия. Напишите дату, город и количество гостей — я рассчитаю и отвечу.",
  }),
  tg: (what) => ({
    q: `Нархи баранда ${what} дар Душанбе чанд аст?`,
    a: "Нарх аз сана ва формати чорабинӣ вобаста аст. Сана, шаҳр ва шумораи меҳмононро нависед — ҳисоб карда ҷавоб медиҳам.",
  }),
  en: (what) => ({
    q: `How much does a host ${what} in Dushanbe cost?`,
    a: "The price depends on the date and format of the event. Send me the date, city and number of guests, and I’ll get back to you with a quote.",
  }),
};

const language: Tr<QA> = {
  ru: {
    q: "На каком языке вы ведёте?",
    a: "На таджикском. Если часть гостей говорит по-русски, по запросу добавим второго ведущего на русском языке.",
  },
  tg: {
    q: "Бо кадом забон мебаред?",
    a: "Бо забони тоҷикӣ. Агар қисми меҳмонон русзабон бошанд, бо хоҳиши шумо барандаи дуюм бо забони русӣ ҳамроҳ мешавад.",
  },
  en: {
    q: "What language do you host in?",
    a: "In Tajik. If some of your guests speak Russian, a second host in Russian can join on request.",
  },
};

const travel: Tr<QA> = {
  ru: {
    q: "Выезжаете ли вы в другие города?",
    a: "Да, по всему Таджикистану: Худжанд, Бохтар, Куляб, Истаравшан, Турсунзаде и любой другой город.",
  },
  tg: {
    q: "Ба шаҳрҳои дигар меравед?",
    a: "Ҳа, дар тамоми Тоҷикистон: Хуҷанд, Бохтар, Кӯлоб, Истаравшан, Турсунзода ва ҳар шаҳри дигар.",
  },
  en: {
    q: "Do you travel to other cities?",
    a: "Yes, anywhere in Tajikistan: Khujand, Bokhtar, Kulob, Istaravshan, Tursunzade and any other city.",
  },
};

const booking: Tr<QA> = {
  ru: {
    q: "За сколько нужно бронировать дату?",
    a: "Заявку можно оставить в любой момент — даже на завтра. Я свяжусь с вами и скажу, свободен ли этот день.",
  },
  tg: {
    q: "Санаро чанд вақт пеш банд кардан лозим аст?",
    a: "Дархостро ҳар вақт гузоштан мумкин аст — ҳатто барои фардо. Ман бо шумо тамос гирифта мегӯям, ки он рӯз холӣ аст ё не.",
  },
  en: {
    q: "How far in advance should I book?",
    a: "You can send a request at any time — even for tomorrow. I’ll contact you and let you know whether the day is free.",
  },
};

const how: Tr<QA> = {
  ru: {
    q: "Как забронировать ведущего?",
    a: "Заполните короткую анкету на сайте или напишите в WhatsApp или Telegram: дата, город, формат и количество гостей.",
  },
  tg: {
    q: "Барандаро чӣ тавр банд кардан мумкин аст?",
    a: "Анкетаи кӯтоҳро дар сомона пур кунед ё ба WhatsApp ё Telegram нависед: сана, шаҳр, формат ва шумораи меҳмонон.",
  },
  en: {
    q: "How do I book you?",
    a: "Fill in the short form on the website or message me on WhatsApp or Telegram with the date, city, format and number of guests.",
  },
};

const international: Tr<QA> = {
  ru: {
    q: "Работаете ли вы с международными организациями?",
    a: "Да. Среди тех, с кем я работал, — UNDP, UNICEF, UNESCO, UNHCR, Евросоюз, банки, СМИ и государственные структуры.",
  },
  tg: {
    q: "Бо созмонҳои байналмилалӣ кор мекунед?",
    a: "Ҳа. Дар байни онҳое, ки бо онҳо кор кардаам, UNDP, UNICEF, UNESCO, UNHCR, Иттиҳоди Аврупо, бонкҳо, ВАО ва сохторҳои давлатӣ ҳастанд.",
  },
  en: {
    q: "Do you work with international organisations?",
    a: "Yes. I have worked with UNDP, UNICEF, UNESCO, UNHCR, the European Union, banks, media and government bodies.",
  },
};

/** «на свадьбу», «конференции»… — для вопроса о цене */
const WHAT: Record<string, Tr<string>> = {
  weddings: { ru: "на свадьбу", tg: "барои тӯй", en: "for a wedding" },
  conferences: { ru: "конференции", tg: "барои конфронс", en: "for a conference" },
  corporate: { ru: "на корпоратив", tg: "барои базми корпоративӣ", en: "for a corporate event" },
  private: { ru: "на юбилей или день рождения", tg: "барои зодрӯз ё солгард", en: "for a birthday or anniversary" },
  official: { ru: "официального мероприятия", tg: "барои маросими расмӣ", en: "for an official ceremony" },
};

/** Вопросы, изменённые в «Настройках сайта» (slug → список на трёх языках) */
let override: Record<string, { q: Record<Locale, string>; a: Record<Locale, string> }[]> | null = null;
export function setFaqOverride(v: typeof override) {
  override = v;
}

export function getFaq(slug: string, locale: Locale, opts?: { original?: boolean }): QA[] {
  const o = opts?.original ? undefined : override?.[slug];
  if (o) return o.map((x) => ({ q: x.q[locale] || x.q.ru, a: x.a[locale] || x.a.ru })).filter((x) => x.q && x.a);
  const what = WHAT[slug]?.[locale];
  if (!what) return [];
  const list = [price[locale](what), language[locale], travel[locale], booking[locale], how[locale]];
  if (slug === "conferences" || slug === "official") list.splice(2, 0, international[locale]);
  return list;
}
