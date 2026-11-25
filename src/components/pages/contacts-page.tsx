import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, Camera, MessageCircle, Phone, Send } from "lucide-react";
import { PageIntro } from "@/components/section";
import { contactLinks, site } from "@/content/site";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { pageMetadata } from "@/lib/seo";

export function contactsMetadata(locale: Locale): Metadata {
  return pageMetadata(locale, "/contacts", {
    title: t(locale, "Контакты"),
    description: t(locale, "Связаться с ведущим {name}: телефон, WhatsApp, Telegram, Instagram. {city}.", {
      name: t(locale, site.hostName),
      city: t(locale, site.city),
    }),
  });
}

export function ContactsPage({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);

  const channels = [
    { label: tr("Телефон"), value: site.contacts.phone, href: contactLinks.phone, icon: Phone, external: false },
    { label: "WhatsApp", value: tr("Написать в WhatsApp"), href: contactLinks.whatsapp, icon: MessageCircle, external: true },
    { label: "Telegram", value: `@${site.contacts.telegram}`, href: contactLinks.telegram, icon: Send, external: true },
    { label: "Instagram", value: `@${site.contacts.instagram}`, href: contactLinks.instagram, icon: Camera, external: true },
    { label: tr("Электронная почта"), value: site.contacts.email, href: contactLinks.email, icon: AtSign, external: false },
    // Пустые контакты (например, не указанная почта) не показываем
  ].filter((c) => c.href && c.value);

  return (
    <>
      <PageIntro
        title={tr("Контакты")}
        lead={tr("Самый быстрый способ — оставить заявку: так я сразу увижу детали вашего мероприятия.")}
      />
      <section className="container-site grid gap-12 pb-24 md:grid-cols-[1.2fr_1fr] md:gap-16 md:pb-32">
        <ul className="border-t border-line">
          {channels.map(({ label, value, href, icon: Icon, external }) => (
            <li key={label} className="border-b border-line">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-5 py-6"
              >
                <Icon aria-hidden className="size-5 shrink-0 text-brass-deep" />
                <span className="flex-1">
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="block text-lg transition-colors group-hover:text-brass-deep md:text-xl">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <aside className="on-velvet velvet-texture self-start rounded-3xl p-8 text-paper md:p-10">
          <h2 className="t-h2">{tr("Заявка на мероприятие")}</h2>
          <p className="mt-4 text-paper/75">
            {tr("Несколько вопросов о дате, площадке и формате. Займёт около трёх минут, удобно заполнять с телефона.")}
          </p>
          <Link href={lp(locale, "/booking")} className="btn btn-brass mt-8 w-full sm:w-auto">
            {tr("Оформить заявку")}
          </Link>
          <p className="mt-6 text-sm text-paper/55">
            {tr(site.city)}. {tr(site.travel)}.
          </p>
        </aside>
      </section>
    </>
  );
}
