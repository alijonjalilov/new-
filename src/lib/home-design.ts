import { prisma } from "@/lib/db";

/**
 * Дизайн главной страницы и его настройки (хранятся в базе, меняются в админке):
 *  - classic — обычный дизайн;
 *  - stage — «Сцена с микрофоном».
 * Если база недоступна, показываем classic.
 */
export const HOME_DESIGNS = ["classic", "stage"] as const;
export type HomeDesign = (typeof HOME_DESIGNS)[number];
export const isHomeDesign = (v: unknown): v is HomeDesign => v === "classic" || v === "stage";

/** Слоты фото площадок = форматы мероприятий, в порядке показа на «Сцене» */
export const VENUE_SLOTS = ["weddings", "conferences", "corporate", "private", "official"] as const;
export type VenueSlot = (typeof VENUE_SLOTS)[number];
export const isVenueSlot = (v: unknown): v is VenueSlot => (VENUE_SLOTS as readonly string[]).includes(v as string);

export type Tr = { ru: string; tg: string; en: string };
/** inf — вместо числа показывается «∞» */
export type StageStats = { subtitle: Tr; items: { n: number; inf?: boolean; label: Tr }[] };

export const DEFAULT_STATS: StageStats = {
  subtitle: { ru: "Пример: свадьба на 150 гостей.", tg: "Мисол: тӯй барои 150 меҳмон.", en: "Example: a wedding for 150 guests." },
  items: [
    { n: 150, label: { ru: "гостей", tg: "меҳмон", en: "guests" } },
    { n: 0, label: { ru: "неловких пауз", tg: "таваққуфи ногувор", en: "awkward pauses" } },
    { n: 0, inf: true, label: { ru: "эмоций", tg: "эҳсосот", en: "emotions" } },
  ],
};

const DESIGN_KEY = "homeDesign";
const STATS_KEY = "stageStats";

export async function getHomeDesign(): Promise<HomeDesign> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: DESIGN_KEY } });
    return isHomeDesign(row?.value) ? row.value : "classic";
  } catch {
    return "classic";
  }
}

export async function setHomeDesign(design: HomeDesign): Promise<void> {
  await prisma.siteSetting.upsert({ where: { key: DESIGN_KEY }, update: { value: design }, create: { key: DESIGN_KEY, value: design } });
}

export async function getStageStats(): Promise<StageStats> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: STATS_KEY } });
    if (!row) return DEFAULT_STATS;
    const v = JSON.parse(row.value) as StageStats;
    if (!v?.items || v.items.length !== 3) return DEFAULT_STATS;
    return v;
  } catch {
    return DEFAULT_STATS;
  }
}

export async function setStageStats(stats: StageStats): Promise<void> {
  const value = JSON.stringify(stats);
  await prisma.siteSetting.upsert({ where: { key: STATS_KEY }, update: { value }, create: { key: STATS_KEY, value } });
}

/** Какие фото площадок загружены: slot → версия (время изменения), для адреса картинки */
export async function getVenueVersions(): Promise<Partial<Record<VenueSlot, number>>> {
  try {
    const rows = await prisma.venuePhoto.findMany({ select: { slot: true, updatedAt: true } });
    const out: Partial<Record<VenueSlot, number>> = {};
    for (const r of rows) if (isVenueSlot(r.slot)) out[r.slot] = r.updatedAt.getTime();
    return out;
  } catch {
    return {};
  }
}

/** Адрес фото площадки. Версия в пути — чтобы после замены фото браузер сразу взял новое */
export const venuePhotoUrl = (slot: VenueSlot, version: number) => `/api/venue/${slot}/${version}`;
