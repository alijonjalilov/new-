import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { tg } from "./dictionaries/tg";

/**
 * Перевод по русскому тексту.
 * Ключ — русская фраза (как в таблице переводов), значение — перевод.
 * Если перевода нет — показывается русский текст.
 * Переменные пишутся в фигурных скобках: t("en", "Спасибо, {name}!", { name })
 */
const DICTIONARIES: Partial<Record<Locale, Record<string, string>>> = { en, tg };

export function t(locale: Locale, ru: string, vars?: Record<string, string | number>): string {
  const dict = DICTIONARIES[locale];
  let out = (dict && dict[ru]) || ru;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

/** Есть ли перевод (для проверки полноты словаря) */
export const hasTranslation = (locale: Locale, ru: string) => locale === "ru" || Boolean(DICTIONARIES[locale]?.[ru]);
