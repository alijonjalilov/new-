"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { LanguageSwitch } from "@/components/language-switch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // На главной шапка прозрачная поверх тёмного первого экрана
  const isHome = pathname === lp(locale, "/");
  const overHero = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overHero ? "on-velvet bg-transparent text-paper" : "border-b border-line bg-paper/90 text-ink backdrop-blur-md",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        {tr("Перейти к содержанию")}
      </a>
      <div className="container-site flex h-16 items-center justify-between gap-3 md:h-20">
        <Link
          href={lp(locale, "/")}
          className="shrink-0 whitespace-nowrap font-display text-base tracking-tight md:text-lg"
          aria-label={t(locale, "{name} — на главную", { name: tr(site.hostName) })}
        >
          {tr(site.hostName)}
        </Link>

        <nav aria-label={tr("Основная навигация")} className="hidden items-center gap-4 xl:flex">
          {nav.map((item) => {
            const href = lp(locale, item.href);
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={item.href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap text-[0.9rem] transition-opacity hover:opacity-100",
                  active ? "opacity-100 underline decoration-brass underline-offset-8" : "opacity-75",
                )}
              >
                {tr(item.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitch locale={locale} className={overHero ? "text-paper" : "text-ink"} />
          <Link
            href={lp(locale, "/booking")}
            className={cn("btn hidden min-h-11 px-5 sm:inline-flex xl:px-4", overHero ? "btn-brass" : "btn-primary")}
          >
            {tr("Забронировать ведущего")}
          </Link>
          {/* Вход в админ-панель — неброская ссылка, как в подвале */}
          <Link href="/admin" rel="nofollow" className="hidden whitespace-nowrap text-sm opacity-50 transition-opacity hover:opacity-100 sm:inline">
            {tr("Вход")}
          </Link>
          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? tr("Закрыть меню") : tr("Открыть меню")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={tr("Мобильная навигация")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-paper md:top-20 xl:hidden"
          >
            <ul className="container-site flex flex-col py-6">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={lp(locale, item.href)} className="block py-5 font-display text-2xl font-light">
                    {tr(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="container-site space-y-6 pb-10">
              <Link href={lp(locale, "/booking")} className="btn btn-primary w-full">
                {tr("Забронировать ведущего")}
              </Link>
              <Link href="/admin" rel="nofollow" className="block text-center text-sm text-muted hover:text-ink">
                {tr("Вход")}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
