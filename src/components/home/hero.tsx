"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Photo } from "@/components/photo";
import { site } from "@/content/site";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Первый экран. Единственный «постановочный» момент на сайте:
 * имя поднимается из-за кулис, затем появляется портрет и текст.
 */
export function Hero({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { y: "105%" },
          animate: { y: "0%" },
          transition: { duration: 1.1, delay, ease },
        };
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        };

  const words = tr(site.hostName).split(" ");

  return (
    <section className="on-velvet velvet-texture relative overflow-hidden text-paper">
      <div className="container-site grid min-h-[100svh] items-end gap-10 pt-28 pb-12 md:pt-32 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-20">
        <div className="order-2 lg:order-1">
          <h1>
            <span className="t-hero block">
              {words.map((w, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span className="block" {...rise(0.1 + i * 0.12)}>
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>
            <motion.span {...fade(0.55)} className="mt-6 block font-display text-xl font-light tracking-tight text-brass md:mt-8 md:text-3xl">
              {tr(site.tagline)}
            </motion.span>
          </h1>
          <motion.p {...fade(0.65)} className="mt-6 text-paper/90 md:text-lg">
            {tr(site.role)}
          </motion.p>
          <motion.p {...fade(0.7)} className="t-lead measure mt-3">
            {tr(site.subtitle)}. {tr(site.description)}
          </motion.p>
          <motion.div {...fade(0.85)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={lp(locale, "/booking")} className="btn btn-brass">
              {tr("Забронировать дату")}
            </Link>
            <Link href={lp(locale, "/portfolio")} className="btn btn-outline">
              {tr("Посмотреть работы")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="order-1 lg:order-2"
          {...(reduce
            ? {}
            : { initial: { opacity: 0, scale: 1.03 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.4, delay: 0.2, ease } })}
        >
          <Photo
            src={site.photos.hero}
            alt={`${tr(site.hostName)} — ${tr(site.role).toLowerCase()}`}
            position="center top"
            placeholder={tr("Портрет ведущего (вертикальный, 4:5)")}
            priority
            locale={locale}
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="aspect-[4/3] w-full rounded-[1.5rem] ring-1 ring-paper/10 sm:aspect-[16/10] lg:aspect-[4/5] lg:rounded-[2rem]"
          />
        </motion.div>
      </div>
    </section>
  );
}
