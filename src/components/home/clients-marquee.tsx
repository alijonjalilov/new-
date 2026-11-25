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
      {/* Стили блока лежат здесь же, чтобы он работал независимо от globals.css */}
      <style>{MARQUEE_CSS}</style>
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

const MARQUEE_CSS = `
/* ── Бегущие строки «С кем я работал» ───────────────────── */
.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.marquee-track {
  display: flex;
  width: max-content;
  gap: 1rem;
  padding: 0.5rem 0;
  animation-duration: 70s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
/* Сдвиг на половину ленты + половину зазора: вторая копия встаёт ровно на место первой */
.marquee-left {
  animation-name: marquee-left;
}
.marquee-right {
  animation-name: marquee-right;
}
@keyframes marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 0.5rem)); }
}
@keyframes marquee-right {
  from { transform: translateX(calc(-50% - 0.5rem)); }
  to { transform: translateX(0); }
}
@media (hover: hover) {
  .marquee:hover .marquee-track {
    animation-play-state: paused;
  }
}
@media (min-width: 768px) {
  .marquee-track {
    gap: 1.5rem;
  }
  @keyframes marquee-left {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-50% - 0.75rem)); }
  }
  @keyframes marquee-right {
    from { transform: translateX(calc(-50% - 0.75rem)); }
    to { transform: translateX(0); }
  }
}
@media (prefers-reduced-motion: reduce) {
  .marquee {
    overflow-x: auto;
  }
  .marquee-track {
    animation: none !important;
    padding-inline: 1.25rem;
  }
}

.client-pill {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border-radius: 999px;
  background: #fff;
  box-shadow:
    0 1px 2px rgb(30 26 43 / 0.04),
    0 8px 24px -12px rgb(30 26 43 / 0.18);
}
.client-logo {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: #fff;
}
@media (min-width: 768px) {
  .client-pill {
    gap: 1.25rem;
    padding-right: 2.5rem;
  }
  .client-logo {
    width: 5rem;
    height: 5rem;
  }
}
`;
