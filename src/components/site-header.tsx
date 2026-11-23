"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // На главной шапка прозрачная поверх тёмного первого экрана
  const overHero = pathname === "/" && !scrolled && !open;

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
        Перейти к содержанию
      </a>
      <div className="container-site flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href="/" className="font-display text-base tracking-tight md:text-lg" aria-label={`${site.hostName} — на главную`}>
          {site.hostName}
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[0.95rem] transition-opacity hover:opacity-100",
                  active ? "opacity-100 underline decoration-brass underline-offset-8" : "opacity-75",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/booking" className={cn("btn hidden min-h-11 px-5 sm:inline-flex", overHero ? "btn-brass" : "btn-primary")}>
            Забронировать ведущего
          </Link>
          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
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
            aria-label="Мобильная навигация"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-paper md:top-20 lg:hidden"
          >
            <ul className="container-site flex flex-col py-6">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} className="block py-5 font-display text-2xl font-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="container-site pb-10">
              <Link href="/booking" className="btn btn-primary w-full">
                Забронировать ведущего
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
