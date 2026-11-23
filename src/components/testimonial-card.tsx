import type { Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between rounded-3xl p-7 md:p-10",
        t.placeholder ? "border border-dashed border-ink/20 bg-transparent" : "bg-paper-2",
      )}
    >
      <blockquote className={cn("font-display text-lg leading-snug font-light md:text-2xl", t.placeholder && "text-muted")}>
        {t.text}
      </blockquote>
      <figcaption className="mt-8 text-sm">
        <span className="font-medium">{t.author}</span>
        <span className="text-muted">, {t.event}</span>
        {t.placeholder && <span className="ml-2 rounded-full bg-paper-2 px-2.5 py-1 text-xs text-muted">заглушка</span>}
      </figcaption>
    </figure>
  );
}
