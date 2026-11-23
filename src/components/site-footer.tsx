import Link from "next/link";
import { contactLinks, nav, site } from "@/content/site";
import { eventCategories } from "@/content/events";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-velvet velvet-texture text-paper">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-display text-2xl font-light tracking-tight md:text-3xl">{site.hostName}</p>
          <p className="mt-3 max-w-sm text-paper/70">{site.subtitle}</p>
          <Link href="/booking" className="btn btn-brass mt-8">
            Забронировать дату
          </Link>
        </div>

        <nav aria-label="Разделы сайта">
          <p className="mb-4 text-sm text-paper/50">Разделы</p>
          <ul className="space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-paper/85 hover:text-brass">
                  {n.label}
                </Link>
              </li>
            ))}
            {eventCategories.slice(0, 2).map((c) => (
              <li key={c.slug}>
                <Link href={`/events/${c.slug}`} className="text-paper/85 hover:text-brass">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-sm text-paper/50">Связаться</p>
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
            <li>
              <a href={contactLinks.email} className="text-paper/85 hover:text-brass">
                {site.contacts.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-paper/50 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.hostName}
          </p>
          <p>{site.city}</p>
        </div>
      </div>
    </footer>
  );
}
