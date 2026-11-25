import { prisma } from "@/lib/db";

/**
 * Режим «Сайт закрыт» (технические работы).
 * Включается и выключается кнопкой в админ-панели, хранится в базе (таблица SiteSetting).
 * Если база недоступна — считаем, что сайт открыт, чтобы не закрыть его случайно.
 */
const KEY = "maintenance";

export async function isSiteClosed(): Promise<boolean> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: KEY } });
    return row?.value === "on";
  } catch {
    return false;
  }
}

export async function setSiteClosed(closed: boolean): Promise<void> {
  const value = closed ? "on" : "off";
  await prisma.siteSetting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
}
