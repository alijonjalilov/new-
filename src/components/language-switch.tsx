"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALE_LABELS, LOCALES, switchLocalePath, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { cn } from "@/lib/utils";

/** Переключатель языка: значок глобуса и короткие коды языков (RU / EN). */
export function LanguageSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname() || "/";
  return (
    <nav aria-label={t(locale, "Язык сайта")} className={cn("flex items-center gap-1.5 text-sm", className)}>
      <Globe aria-hidden className="size-4 opacity-60" />
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className="opacity-30">
              /
            </span>
          )}
          {l === locale ? (
            <span aria-current="true" className="font-medium">
              {LOCALE_LABELS[l].short}
            </span>
          ) : (
            <Link
              href={switchLocalePath(pathname, l)}
              hrefLang={LOCALE_LABELS[l].htmlLang}
              lang={LOCALE_LABELS[l].htmlLang}
              aria-label={LOCALE_LABELS[l].name}
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              {LOCALE_LABELS[l].short}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
