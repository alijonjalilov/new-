import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/t";
import type { Locale } from "@/i18n/config";

export function TestimonialCard({ t: item, locale }: { t: Testimonial; locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  const it = item;
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between rounded-3xl p-7 md:p-10",
        it.placeholder ? "border border-dashed border-ink/20 bg-transparent" : "bg-paper-2",
      )}
    >
      <blockquote className={cn("font-display text-lg leading-snug font-light md:text-2xl", it.placeholder && "text-muted")}>
        {tr(it.text)}
      </blockquote>
      <figcaption className="mt-8 text-sm">
        <span className="font-medium">{tr(it.author)}</span>
        <span className="text-muted">, {tr(it.event)}</span>
        {it.placeholder && <span className="ml-2 rounded-full bg-paper-2 px-2.5 py-1 text-xs text-muted">{tr("заглушка")}</span>}
      </figcaption>
    </figure>
  );
}
