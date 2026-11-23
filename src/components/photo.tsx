import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src?: string | null;
  alt: string;
  /** Подпись заглушки — что сюда нужно поставить */
  placeholder?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Фотография с оптимизацией next/image. Если файла ещё нет —
 * показывается «бархатная» заглушка с подсказкой, что сюда загрузить.
 * Родитель задаёт размеры/пропорции (например, aspect-[4/5]).
 */
export function Photo({ src, alt, placeholder, className, priority, sizes = "100vw" }: PhotoProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-velvet", className)}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (фото будет добавлено)`}
      className={cn("velvet-texture relative flex items-end overflow-hidden text-paper/60", className)}
    >
      <svg aria-hidden viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 w-1/4 max-w-24 -translate-x-1/2 -translate-y-1/2 opacity-20">
        <circle cx="50" cy="36" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 92c4-20 17-30 32-30s28 10 32 30" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {placeholder && <span className="relative m-4 text-sm leading-snug">{placeholder}</span>}
    </div>
  );
}
