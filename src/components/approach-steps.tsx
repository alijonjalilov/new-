import { t } from "@/i18n/t";
import type { Locale } from "@/i18n/config";
import { processSteps as steps } from "@/content/process";


export function ApproachSteps({ locale }: { locale: Locale }) {
  return (
    <ol className="grid gap-10 md:grid-cols-2 md:gap-x-16 lg:grid-cols-4 lg:gap-x-10">
      {steps.map((s, i) => (
        <li key={s.title} className="border-t border-ink/15 pt-6">
          <span className="font-display text-sm text-brass-deep" aria-hidden>
            {i + 1}
          </span>
          <h3 className="t-h3 mt-3">{t(locale, s.title)}</h3>
          <p className="mt-3 text-muted">{t(locale, s.text)}</p>
        </li>
      ))}
    </ol>
  );
}
