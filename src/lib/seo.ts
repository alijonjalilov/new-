import type { Metadata } from "next";
import { LOCALE_LABELS, LOCALES, lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { site } from "@/content/site";

/**
 * Метаданные страницы на нужном языке + ссылки на её версии
 * на других языках (hreflang) — чтобы Google показывал нужную версию.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title?: string; description: string },
): Metadata {
  const url = lp(locale, path);
  const languages = Object.fromEntries(LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, lp(l, path)]));
  const name = t(locale, site.hostName);
  const fullTitle = title ? `${title} — ${name}` : `${name} — ${t(locale, site.role)}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url, languages: { ...languages, "x-default": lp("ru", path) } },
    openGraph: {
      type: "website",
      locale: LOCALE_LABELS[locale].ogLocale,
      siteName: name,
      title: fullTitle,
      description,
      url,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
