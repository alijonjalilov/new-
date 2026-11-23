"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeId } from "@/content/portfolio";
import { cn } from "@/lib/utils";

/**
 * «Ленивое» видео YouTube: до клика показывается только обложка,
 * плеер загружается по нажатию — страница остаётся быстрой.
 * Без ссылки показывается заглушка.
 */
export function YouTubeEmbed({ url, title, className }: { url?: string; title: string; className?: string }) {
  const [active, setActive] = useState(false);
  const id = youtubeId(url);

  if (!id) {
    return (
      <div className={cn("velvet-texture flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl text-paper/60", className)}>
        <span className="flex size-14 items-center justify-center rounded-full border border-paper/30">
          <Play aria-hidden className="size-5 translate-x-0.5" />
        </span>
        <span className="text-sm">Место для видео YouTube</span>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-2xl bg-velvet", className)}>
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 size-full" aria-label={`Смотреть видео: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/95 text-velvet shadow-lg transition-transform group-hover:scale-105">
            <Play aria-hidden className="size-6 translate-x-0.5 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
