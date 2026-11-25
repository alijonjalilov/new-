import Link from "next/link";
import { contactLinks, nav, site } from "@/content/site";
import { eventCategories } from "@/content/events";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";

export function SiteFooter({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  const year = new Date().getFullYear();
  return (
    <footer className="on-velvet velvet-texture text-paper">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-display text-2xl font-light tracking-tight md:text-3xl">{tr(site.hostName)}</p>
          <p className="mt-3 max-w-sm text-paper/70">{tr(site.role)}</p>
          <p className="mt-2 max-w-sm text-sm text-paper/55">
            {tr(site.city)}. {tr(site.travel)}.
          </p>
          <Link href={lp(locale, "/booking")} className="btn btn-brass mt-8">
            {tr("Забронировать дату")}
          </Link>
        </div>

        <nav aria-label={tr("Разделы сайта")}>
          <p className="mb-4 text-sm text-paper/50">{tr("Разделы")}</p>
          <ul className="space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={lp(locale, n.href)} className="text-paper/85 hover:text-brass">
                  {tr(n.label)}
                </Link>
              </li>
            ))}
            {eventCategories.slice(0, 2).map((c) => (
              <li key={c.slug}>
                <Link href={lp(locale, `/events/${c.slug}`)} className="text-paper/85 hover:text-brass">
                  {tr(c.title)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-sm text-paper/50">{tr("Связаться")}</p>
          <ul className="space-y-2.5">
            <li>
              <a href={contactLinks.phone} className="text-paper/85 hover:text-brass">
                {site.contacts.phone}
              </a>
            </li>
            <li>
              <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-paper/85 hover:text-brass">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={contactLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-paper/85 hover:text-brass">
                Telegram
              </a>
            </li>
            <li>
              <a href={contactLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-paper/85 hover:text-brass">
                Instagram
              </a>
            </li>
            {site.contacts.email && (
              <li>
                <a href={contactLinks.email} className="text-paper/85 hover:text-brass">
                  {site.contacts.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-paper/50 sm:flex-row sm:justify-between">
          <p>
            © {year} {tr(site.hostName)}
          </p>
          <p className="flex gap-6">
            <span>{tr(site.city)}</span>
            {/* Вход в админ-панель: незаметная ссылка для владельца сайта */}
            <Link href="/admin" rel="nofollow" className="hover:text-brass">
              {tr("Вход")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
