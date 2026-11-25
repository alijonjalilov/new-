import Link from "next/link";
import { connection } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSiteClosed } from "@/lib/site-settings";
import { contactLinks, site } from "@/content/site";
import { LOCALES, LOCALE_LABELS, lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";

/**
 * Оборачивает публичные страницы. Если в админке включено «Сайт закрыт»,
 * посетители видят страницу технических работ, а администратор — обычный сайт
 * с полосой-напоминанием сверху.
 */
export async function MaintenanceGate({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  await connection(); // проверяем при каждом запросе, а не один раз при сборке
  if (!(await isSiteClosed())) return <>{children}</>;
  if (await getAdminSession()) {
    return (
      <>
        <div className="fixed inset-x-0 bottom-0 z-[60] bg-danger px-5 py-2.5 text-center text-sm text-white">
          Сайт закрыт для посетителей — они видят страницу «технические работы». Вы видите сайт, потому что вошли как
          администратор.{" "}
          <Link href="/admin" className="font-medium underline underline-offset-4">
            Открыть сайт в админке
          </Link>
        </div>
        {children}
      </>
    );
  }
  return <MaintenancePage locale={locale} />;
}

export function MaintenancePage({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  const links = [
    { href: contactLinks.phone, label: site.contacts.phone },
    { href: contactLinks.whatsapp, label: "WhatsApp" },
    { href: contactLinks.telegram, label: "Telegram" },
    { href: contactLinks.instagram, label: "Instagram" },
  ];
  return (
    <main id="main" className="velvet-texture flex min-h-svh flex-col text-paper">
      <div className="container-site flex justify-end gap-3 pt-6 text-sm">
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={lp(l, "/")}
            lang={LOCALE_LABELS[l].htmlLang}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "text-paper" : "text-paper/55 hover:text-paper"}
          >
            {LOCALE_LABELS[l].short}
          </Link>
        ))}
      </div>
      <div className="container-site flex flex-1 flex-col justify-center py-16">
        <p className="font-display text-lg tracking-tight text-brass">{tr(site.hostName)}</p>
        <h1 className="t-h1 mt-6 max-w-3xl">{tr("Сайт временно закрыт")}</h1>
        <p className="t-lead measure mt-6 text-paper/75">
          {tr("Идут технические работы, скоро всё снова заработает. Чтобы заказать ведущего, позвоните или напишите — я на связи.")}
        </p>
        <ul className="mt-10 flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="btn btn-brass"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
