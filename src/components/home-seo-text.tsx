import type { Locale } from "@/i18n/config";
import { t } from "@/i18n/t";

/** Короткий текст о ведущем на главной — с естественными словами, по которым ищут */
export const HOME_SEO = {
  title: "Ведущий мероприятий в Душанбе",
  paragraphs: [
    "Субхон Джалилов (Rovi) — ведущий свадеб, тоев, конференций и корпоративов в Душанбе. Журналист, теле- и радиоведущий, программный директор «Азия-Плюс» и ведущий утренней программы «Имкон».",
    "Веду мероприятия на таджикском языке. По запросу добавим второго ведущего на русском. Выезжаю в Худжанд, Бохтар, Куляб и в любой город Таджикистана.",
    "Свадьба и той, конференция или форум, юбилей, корпоратив, официальная церемония — напишите дату и формат, и я отвечу, свободен ли этот день.",
  ],
};

export function HomeSeoText({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="about-host" className="container-site pb-24 md:pb-32">
      <div className="grid gap-8 border-t border-line pt-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <h2 id="about-host" className="t-h3">
          {t(locale, HOME_SEO.title)}
        </h2>
        <div className="measure space-y-4 text-muted">
          {HOME_SEO.paragraphs.map((p) => (
            <p key={p}>{t(locale, p)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
