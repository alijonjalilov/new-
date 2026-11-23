import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, Camera, MessageCircle, Phone, Send } from "lucide-react";
import { PageIntro } from "@/components/section";
import { contactLinks, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Связаться с ведущим ${site.hostName}: телефон, WhatsApp, Telegram, Instagram, e-mail.`,
  alternates: { canonical: "/contacts" },
};

const channels = [
  { label: "Телефон", value: site.contacts.phone, href: contactLinks.phone, icon: Phone, external: false },
  { label: "WhatsApp", value: "Написать в WhatsApp", href: contactLinks.whatsapp, icon: MessageCircle, external: true },
  { label: "Telegram", value: `@${site.contacts.telegram}`, href: contactLinks.telegram, icon: Send, external: true },
  { label: "Instagram", value: `@${site.contacts.instagram}`, href: contactLinks.instagram, icon: Camera, external: true },
  { label: "Электронная почта", value: site.contacts.email, href: contactLinks.email, icon: AtSign, external: false },
];

export default function ContactsPage() {
  return (
    <>
      <PageIntro title="Контакты" lead="Самый быстрый способ — оставить заявку: так я сразу увижу детали вашего мероприятия." />
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
          <h2 className="t-h2">Заявка на мероприятие</h2>
          <p className="mt-4 text-paper/75">
            Несколько вопросов о дате, площадке и формате. Займёт около трёх минут, удобно заполнять с телефона.
          </p>
          <Link href="/booking" className="btn btn-brass mt-8 w-full sm:w-auto">
            Оформить заявку
          </Link>
          <p className="mt-6 text-sm text-paper/55">{site.city}</p>
        </aside>
      </section>
    </>
  );
}
