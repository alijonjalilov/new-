/**
 * Подготовка к мультиязычности.
 *
 * Сейчас сайт работает на русском. Тексты вынесены в src/content/* и
 * src/lib/booking/scenarios.ts, поэтому для добавления таджикского и английского:
 *  1. Добавьте язык в LOCALES ниже.
 *  2. Создайте переводы контента (например, src/content/tg/site.ts) или
 *     подключите библиотеку next-intl.
 *  3. Перенесите страницы в сегмент src/app/[locale]/… и используйте
 *     generateStaticParams по LOCALES. Метаданные — alternates.languages.
 * Подробности — в README.md, раздел «Мультиязычность».
 */
export const LOCALES = ["ru"] as const; // в будущем: ["ru", "tg", "en"]
export type Locale = (typeof LOCALES)[number] | "tg" | "en";
export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_NAMES: Record<Locale, string> = {
  ru: "Русский",
  tg: "Тоҷикӣ",
  en: "English",
};
