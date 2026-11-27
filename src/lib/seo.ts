import type { Metadata } from "next";
import { LOCALE_LABELS, LOCALES, lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { site } from "@/content/site";
import { SEO_KEYWORDS, SEO_PAGES, SITE_NAME } from "@/content/seo";

/**
 * Метаданные страницы на нужном языке:
 *  - title и description из src/content/seo.ts (если для страницы они там есть);
 *  - ссылки на версии на других языках (hreflang) — каждая версия ссылается на все три;
 *  - превью для соцсетей с картинкой на своём языке (public/og/home-<язык>.jpg).
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description, noindex }: { title?: string; description: string; noindex?: boolean },
): Metadata {
  const url = lp(locale, path);
  const languages = Object.fromEntries(LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, lp(l, path)]));
  const seo = SEO_PAGES[path]?.[locale];
  const name = t(locale, site.hostName);
  const fullTitle = seo?.title ?? (title ? `${title} — ${name} | Rovi` : `${name} — ${t(locale, site.role)} | Rovi`);
  const desc = seo?.description ?? description;
  const ogLocale = LOCALE_LABELS[locale].ogLocale;
  const image = { url: `/og/home-${locale}.jpg`, width: 1200, height: 630, alt: SITE_NAME[locale] };
  return {
    title: { absolute: fullTitle },
    description: desc,
    keywords: SEO_KEYWORDS[locale],
    alternates: { canonical: url, languages: { ...languages, "x-default": lp("ru", path) } },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: LOCALES.map((l) => LOCALE_LABELS[l].ogLocale).filter((l) => l !== ogLocale),
      siteName: SITE_NAME[locale],
      title: fullTitle,
      description: desc,
      url,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [image.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
