/**
 * Языки сайта.
 *
 * Русский — основной: страницы без префикса (/about).
 * Остальные языки — с префиксом (/en/about).
 *
 * Тексты переводятся словарями «русский текст → перевод»
 * (src/i18n/dictionaries/*.ts). Чтобы добавить таджикский:
 *  1. заполнить src/i18n/dictionaries/tg.ts;
 *  2. добавить "tg" в LOCALES и в DICTIONARIES (src/i18n/t.ts);
 *  3. скопировать папку src/app/en в src/app/tg и заменить в ней "en" на "tg".
 */
export const LOCALES = ["ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_LABELS: Record<Locale, { short: string; name: string; htmlLang: string; ogLocale: string }> = {
  ru: { short: "RU", name: "Русский", htmlLang: "ru", ogLocale: "ru_RU" },
  en: { short: "EN", name: "English", htmlLang: "en", ogLocale: "en_US" },
};

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);

/** Путь страницы на нужном языке: lp("en", "/about") → "/en/about" */
export function lp(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Определяет язык по адресу страницы */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/** Тот же адрес на другом языке: /en/about → /about */
export function switchLocalePath(pathname: string, target: Locale): string {
  const current = localeFromPath(pathname);
  let rest = pathname;
  if (current !== DEFAULT_LOCALE) rest = pathname.slice(current.length + 1) || "/";
  return lp(target, rest);
}
