"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Photo } from "@/components/photo";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { portfolioFilters, portfolioItems, type PortfolioCategory } from "@/content/portfolio";
import { cn } from "@/lib/utils";

const aspectClass = { portrait: "aspect-[4/5]", landscape: "aspect-video", square: "aspect-square" } as const;

export function PortfolioGrid() {
  const [filter, setFilter] = useState<PortfolioCategory | "all">("all");
  const items = useMemo(
    () => (filter === "all" ? portfolioItems : portfolioItems.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <>
      <div role="group" aria-label="Фильтр по типу мероприятия" className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {portfolioFilters.map((f) => {
          const count = f.value === "all" ? portfolioItems.length : portfolioItems.filter((i) => i.category === f.value).length;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-[0.95rem] transition-colors",
                filter === f.value ? "border-velvet bg-velvet text-paper" : "border-line hover:border-ink/40",
              )}
            >
              {f.label}
              <span className={cn("ml-2 text-sm", filter === f.value ? "text-paper/60" : "text-muted")}>{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              
            >
              <figure>
                {item.kind === "video" ? (
                  <YouTubeEmbed url={item.youtube} title={item.title} />
                ) : (
                  <Photo
                    src={item.src}
                    alt={item.title}
                    placeholder={item.caption}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={cn("rounded-2xl", aspectClass[item.aspect ?? "square"])}
                  />
                )}
                <figcaption className="mt-3 text-sm">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-muted">{item.kind === "video" ? ", видео" : ", фото"}</span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {items.length === 0 && <p className="text-muted">В этой категории пока нет работ.</p>}
    </>
  );
}
