/**
 * Портфолио. Добавляйте элементы в массив:
 *  - фото:  { kind: "photo", src: "/images/portfolio/xxx.jpg", ... }
 *  - видео: { kind: "video", youtube: "https://youtu.be/XXXXXXXXXXX", ... }
 * Пока реальных материалов нет, элементы без src/youtube показываются как заглушки.
 */
export type PortfolioCategory = "weddings" | "conferences" | "corporate" | "other";

export interface PortfolioItem {
  id: string;
  kind: "photo" | "video";
  category: PortfolioCategory;
  title: string;
  caption?: string;
  /** Путь к фото в /public */
  src?: string;
  /** Ссылка или ID YouTube */
  youtube?: string;
  /** Пропорции карточки */
  aspect?: "portrait" | "landscape" | "square";
}

export const portfolioFilters: { value: PortfolioCategory | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "weddings", label: "Свадьбы" },
  { value: "conferences", label: "Конференции" },
  { value: "corporate", label: "Корпоративы" },
  { value: "other", label: "Другие мероприятия" },
];

export const portfolioItems: PortfolioItem[] = [
  { id: "w1", kind: "photo", category: "weddings", title: "Свадьба", caption: "Место для фото", aspect: "portrait" },
  { id: "c1", kind: "video", category: "conferences", title: "Конференция", caption: "Место для видео YouTube", aspect: "landscape" },
  { id: "k1", kind: "photo", category: "corporate", title: "Корпоратив", caption: "Место для фото", aspect: "square" },
  { id: "w2", kind: "video", category: "weddings", title: "Свадьба", caption: "Место для видео YouTube", aspect: "landscape" },
  { id: "o1", kind: "photo", category: "other", title: "Юбилей", caption: "Место для фото", aspect: "portrait" },
  { id: "c2", kind: "photo", category: "conferences", title: "Форум", caption: "Место для фото", aspect: "landscape" },
  { id: "k2", kind: "video", category: "corporate", title: "Награждение", caption: "Место для видео YouTube", aspect: "landscape" },
  { id: "w3", kind: "photo", category: "weddings", title: "Свадьба", caption: "Место для фото", aspect: "square" },
  { id: "o2", kind: "photo", category: "other", title: "Официальная церемония", caption: "Место для фото", aspect: "portrait" },
];

/** Извлекает ID ролика из ссылки YouTube любого вида (или возвращает сам ID). */
export function youtubeId(input: string | undefined): string | null {
  if (!input) return null;
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : null;
}
