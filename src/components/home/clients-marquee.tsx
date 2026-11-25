import Image from "next/image";
import { clients, type Client } from "@/content/clients";
import type { Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { SectionHeading } from "@/components/section";

/**
 * «С кем я работал»: две бегущие строки с логотипами.
 * Верхняя едет слева направо, нижняя — справа налево. Наведение мышью останавливает строку.
 * Если у посетителя в системе выключена анимация, строки не двигаются, их можно листать.
 */
export function ClientsMarquee({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  const half = Math.ceil(clients.length / 2);
  const rows: { items: Client[]; dir: "right" | "left" }[] = [
    { items: clients.slice(0, half), dir: "right" },
    { items: clients.slice(half), dir: "left" },
  ];

  return (
    <section aria-labelledby="clients-title" className="overflow-hidden bg-paper-2 py-20 md:py-28">
      <div className="container-site">
        <SectionHeading
          id="clients-title"
          title={tr("С кем я работал")}
          lead={tr("Компании, бренды и организации, с которыми мы уже сотрудничали.")}
        />
      </div>

      {/* Для экранных дикторов — обычный список без повторов */}
      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.slug}>{locale === "en" ? c.nameEn : c.name}</li>
        ))}
      </ul>

      <div aria-hidden className="space-y-4 md:space-y-6">
        {rows.map((row, i) => (
          <div key={i} className="marquee">
            <div className={`marquee-track marquee-${row.dir}`}>
              {/* Содержимое повторено дважды — так лента крутится без шва */}
              {[0, 1].map((copy) =>
                row.items.map((c) => <ClientPill key={`${copy}-${c.slug}`} client={c} locale={locale} />),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClientPill({ client, locale }: { client: Client; locale: Locale }) {
  // Все логотипы — «одного размера» по площади: широкие ниже, квадратные меньше по ширине
  let w = client.round ? 100 : Math.min(80, 52 * Math.sqrt(client.ratio));
  let h = client.round ? 100 : w / client.ratio;
  if (h > 78) {
    h = 78;
    w = h * client.ratio;
  }
  return (
    <div className="client-pill">
      <span className="client-logo">
        <Image
          src={`/images/clients/${client.slug}.png`}
          alt=""
          width={360}
          height={Math.round(360 / client.ratio)}
          sizes="80px"
          style={{ width: `${w}%`, height: `${h}%` }}
          className="object-contain"
        />
      </span>
      <span className="whitespace-nowrap text-lg font-semibold tracking-tight md:text-2xl">
        {locale === "en" ? client.nameEn : client.name}
      </span>
    </div>
  );
}
