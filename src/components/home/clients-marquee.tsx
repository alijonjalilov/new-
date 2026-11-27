import Image from "next/image";
import { clientName, clients, type Client } from "@/content/clients";
import type { Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { ClientsToggle } from "@/components/home/clients-toggle";

/**
 * «С кем я работал»: две бегущие строки с логотипами.
 * Верхняя едет слева направо, нижняя — справа налево. Наведение мышью останавливает строку.
 * Если у посетителя в системе выключена анимация, строки не двигаются, их можно листать.
 */
export function ClientsMarquee({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  // Компании раскладываются по строкам через одну, чтобы строки были вперемешку
  const rows: { items: Client[]; dir: "right" | "left" }[] = [
    { items: clients.filter((_, i) => i % 2 === 0), dir: "right" },
    { items: clients.filter((_, i) => i % 2 === 1), dir: "left" },
  ];

  const name = (c: Client) => clientName(c, locale);

  return (
    <section aria-labelledby="clients-title" className="overflow-hidden bg-paper-2 py-16 md:py-24">
      {/* Стили блока лежат здесь же, чтобы он работал независимо от globals.css */}
      <style>{MARQUEE_CSS}</style>
      <ClientsToggle
        title={tr("С кем я работал")}
        lead={tr("Компании, бренды и организации, с которыми мы уже сотрудничали.")}
        showLabel={tr("Посмотреть все")}
        hideLabel={tr("Свернуть")}
        srList={
          /* Для экранных дикторов — обычный список без повторов */
          <ul className="sr-only">
            {clients.map((c) => (
              <li key={c.slug}>{name(c)}</li>
            ))}
          </ul>
        }
        marquee={
          <div aria-hidden className="space-y-3 md:space-y-4">
            {rows.map((row, i) => (
              <div key={i} className="marquee">
                <div
                  className={`marquee-track marquee-${row.dir}`}
                  style={{ animationDuration: `${row.items.length * 6}s` }}
                >
                  {/* Содержимое повторено дважды — так лента крутится без шва */}
                  {[0, 1].map((copy) =>
                    row.items.map((c) => <ClientPill key={`${copy}-${c.slug}`} client={c} locale={locale} />),
                  )}
                </div>
              </div>
            ))}
          </div>
        }
        grid={
          <ul className="container-site flex flex-wrap gap-3">
            {clients.map((c) => (
              <li key={c.slug}>
                <ClientPill client={c} locale={locale} />
              </li>
            ))}
          </ul>
        }
      />
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
          alt={t(locale, "Логотип {name} — клиент ведущего Субхона Джалилова", { name: clientName(client, locale) })}
          width={360}
          height={Math.round(360 / client.ratio)}
          sizes="64px"
          style={{ width: `${w}%`, height: `${h}%` }}
          className="object-contain"
        />
      </span>
      <span className="whitespace-nowrap text-base font-semibold tracking-tight md:text-lg">
        {clientName(client, locale)}
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
  gap: 0.75rem;
  padding: 0.375rem 0;
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
  to { transform: translateX(calc(-50% - 0.375rem)); }
}
@keyframes marquee-right {
  from { transform: translateX(calc(-50% - 0.375rem)); }
  to { transform: translateX(0); }
}
@media (hover: hover) {
  .marquee:hover .marquee-track {
    animation-play-state: paused;
  }
}
@media (min-width: 768px) {
  .marquee-track {
    gap: 1rem;
  }
  @keyframes marquee-left {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-50% - 0.5rem)); }
  }
  @keyframes marquee-right {
    from { transform: translateX(calc(-50% - 0.5rem)); }
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
  gap: 0.75rem;
  padding: 0.375rem 1.5rem 0.375rem 0.375rem;
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
  width: 3.25rem;
  height: 3.25rem;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: #fff;
}
@media (min-width: 768px) {
  .client-pill {
    gap: 1rem;
    padding-right: 1.75rem;
  }
  .client-logo {
    width: 4rem;
    height: 4rem;
  }
}
`;
