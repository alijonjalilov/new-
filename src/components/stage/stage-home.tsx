import { Manrope, Unbounded } from "next/font/google";
import { StageClient, type StageData } from "@/components/stage/stage-client";
import { clientName, clients } from "@/content/clients";
import { getEventCategory } from "@/content/events";
import { processSteps } from "@/content/process";
import { contactLinks, site } from "@/content/site";
import { LOCALES, LOCALE_LABELS, lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { getStageStats, getVenueVersions, VENUE_SLOTS, venuePhotoUrl } from "@/lib/home-design";

/* Шрифты «Сцены»: для русского и английского — Unbounded + Manrope.
   В них нет таджикских букв, поэтому для таджикского — Geologica + Golos (подключены на всём сайте). */
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"], variable: "--font-unbounded", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "600", "700"], variable: "--font-manrope", display: "swap" });

/** Стороны, куда уезжает микрофон на каждом формате: 1 — вправо, −1 — влево */
const SIDES = [1, -1, 1, -1, 1] as const;

/** Подписи к деталям разобранного микрофона */
const PART_LABELS: [string, string, string][] = [
  ["Сетка", "Голос", "опыт журналиста и телеведущего"],
  ["Кольцо", "Сценарий", "держит программу вечера вместе"],
  ["Капсюль", "Подготовка", "связь с площадкой и подрядчиками"],
  ["Плата", "Тайминг", "включаю нужный момент вовремя"],
  ["Корпус", "Импровизация", "когда что-то пошло не по плану"],
];

/** Все тексты «Сцены», которых нет в других данных сайта (переводы — в словарях) */
const TEXTS = {
  kicker: "Ведущий мероприятий · Душанбе, Таджикистан",
  heroText: "Свадьбы, конференции, корпоративы и официальные церемонии по всему Таджикистану.",
  book: "Забронировать дату",
  works: "Посмотреть работы",
  navBook: "Забронировать",
  partsKicker: "Из чего состоит вечер",
  partsTitle: "Больше, чем микрофон",
  partsText: "Гости запоминают не тайминг, а ощущение вечера. За ним стоит работа, которую не видно.",
  statsTitle: "Один вечер в цифрах",
  trustTitle: "Спасибо за доверие",
  trustText: "Международные организации, банки, СМИ и государственные структуры, с которыми мы работали.",
  trustThanks: "Благодарю каждого за сотрудничество!",
  processKicker: "Как мы будем работать",
  finalTitle: "Ваш вечер — следующий",
  finalText: "Напишите дату и формат, отвечу в течение дня.",
  finalForm: "Заявка на сайте",
  hudScroll: "Крутите колесо",
  hudEnd: "Финал",
  back: "Назад",
  next: "Дальше",
  mic: "Микрофон",
  clientsList: "С кем я работал",
  languages: "Язык сайта",
  admin: "Вход в панель управления",
};
export type StageTexts = Record<keyof typeof TEXTS, string>;

export async function StageHome({ locale, preview }: { locale: Locale; preview: boolean }) {
  const tr = (s: string) => t(locale, s);
  const [stats, versions] = await Promise.all([getStageStats(), getVenueVersions()]);

  const texts = Object.fromEntries(Object.entries(TEXTS).map(([k, v]) => [k, tr(v)])) as StageTexts;

  const data: StageData = {
    locale,
    preview,
    texts,
    hostName: tr(site.hostName),
    parts: PART_LABELS.map((p) => p.map(tr) as [string, string, string]),
    formats: VENUE_SLOTS.map((slot, i) => {
      const c = getEventCategory(slot);
      const v = versions[slot];
      return { slot, title: tr(c?.title ?? slot), text: tr(c?.short ?? ""), side: SIDES[i], photo: v ? venuePhotoUrl(slot, v) : null };
    }),
    steps: processSteps.map((s) => ({ title: tr(s.title), text: tr(s.text) })),
    stats: {
      subtitle: stats.subtitle[locale] || stats.subtitle.ru,
      items: stats.items.map((it) => ({ n: it.n, inf: Boolean(it.inf), label: it.label[locale] || it.label.ru })),
    },
    clients: clients.map((c) => ({ slug: c.slug, name: clientName(c, locale), ratio: c.ratio, round: Boolean(c.round) })),
    links: {
      home: lp(locale, "/"),
      whatsapp: contactLinks.whatsapp,
      telegram: contactLinks.telegram,
      booking: lp(locale, "/booking"),
      langs: LOCALES.map((l) => ({ code: l, short: LOCALE_LABELS[l].short, name: LOCALE_LABELS[l].name, href: lp(l, "/") })),
    },
  };

  return (
    <div className={`${unbounded.variable} ${manrope.variable}`}>
      <StageClient data={data} />
    </div>
  );
}
