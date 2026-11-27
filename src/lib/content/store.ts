import { prisma } from "@/lib/db";
import { SECTIONS, type SectionKey } from "./sections";

/**
 * Хранение «Настроек сайта» в базе (таблица SiteSetting, ключи content:<раздел>).
 * Предыдущая версия каждого раздела сохраняется в content:<раздел>:prev — её можно вернуть.
 *
 * ensureContent() вызывается в начале страниц: подгружает изменения из базы
 * (не чаще раза в 10 секунд) и применяет их к сайту.
 */
const KEY = (k: SectionKey) => `content:${k}`;
const PREV = (k: SectionKey) => `content:${k}:prev`;

const applied = new Map<SectionKey, number>(); // раздел → время версии, которая применена
let checkedAt = 0;

export async function ensureContent(force = false): Promise<void> {
  if (!force && Date.now() - checkedAt < 10_000) return;
  checkedAt = Date.now();
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: (Object.keys(SECTIONS) as SectionKey[]).map(KEY) } },
    });
    for (const k of Object.keys(SECTIONS) as SectionKey[]) {
      const row = rows.find((r) => r.key === KEY(k));
      const ver = row ? row.updatedAt.getTime() : 0;
      if (applied.get(k) === ver) continue;
      let value: unknown = null;
      if (row) {
        try {
          value = JSON.parse(row.value);
        } catch {
          value = null;
        }
      }
      (SECTIONS[k].apply as (v: unknown) => void)(value);
      applied.set(k, ver);
    }
  } catch (error) {
    console.error("[content] не удалось загрузить настройки сайта", error);
  }
}

/** Текущие данные раздела для редактора (из базы или исходные) */
export async function getSectionValue(k: SectionKey) {
  const row = await prisma.siteSetting.findUnique({ where: { key: KEY(k) } }).catch(() => null);
  const prev = await prisma.siteSetting.findUnique({ where: { key: PREV(k) } }).catch(() => null);
  let value: unknown = null;
  if (row) {
    try {
      value = JSON.parse(row.value);
    } catch {
      value = null;
    }
  }
  return {
    value: value ?? SECTIONS[k].getDefault(),
    changed: Boolean(row),
    updatedAt: row?.updatedAt ?? null,
    hasPrev: Boolean(prev),
  };
}

export async function saveSection(k: SectionKey, value: unknown): Promise<string | null> {
  const err = (SECTIONS[k].validate as (v: unknown) => string | null)(value);
  if (err) return err;
  const json = JSON.stringify(value);
  if (json.length > 900_000) return "Слишком много данных";
  const old = await prisma.siteSetting.findUnique({ where: { key: KEY(k) } });
  await prisma.$transaction([
    ...(old ? [prisma.siteSetting.upsert({ where: { key: PREV(k) }, update: { value: old.value }, create: { key: PREV(k), value: old.value } })] : []),
    prisma.siteSetting.upsert({ where: { key: KEY(k) }, update: { value: json }, create: { key: KEY(k), value: json } }),
  ]);
  await ensureContent(true);
  return null;
}

/** Вернуть предыдущую версию раздела */
export async function undoSection(k: SectionKey): Promise<string | null> {
  const prev = await prisma.siteSetting.findUnique({ where: { key: PREV(k) } });
  if (!prev) return "Предыдущей версии нет";
  const cur = await prisma.siteSetting.findUnique({ where: { key: KEY(k) } });
  await prisma.$transaction([
    prisma.siteSetting.upsert({ where: { key: KEY(k) }, update: { value: prev.value }, create: { key: KEY(k), value: prev.value } }),
    cur
      ? prisma.siteSetting.update({ where: { key: PREV(k) }, data: { value: cur.value } })
      : prisma.siteSetting.delete({ where: { key: PREV(k) } }),
  ]);
  await ensureContent(true);
  return null;
}

/** Вернуть раздел к исходному виду (как в коде сайта) */
export async function resetSection(k: SectionKey): Promise<void> {
  const cur = await prisma.siteSetting.findUnique({ where: { key: KEY(k) } });
  if (cur) {
    await prisma.$transaction([
      prisma.siteSetting.upsert({ where: { key: PREV(k) }, update: { value: cur.value }, create: { key: PREV(k), value: cur.value } }),
      prisma.siteSetting.delete({ where: { key: KEY(k) } }),
    ]);
  }
  await ensureContent(true);
}

/** Анкета бронирования из базы (или null) — для браузера посетителя */
export async function getBookingOverride() {
  const row = await prisma.siteSetting.findUnique({ where: { key: KEY("booking") } }).catch(() => null);
  if (!row) return null;
  try {
    return JSON.parse(row.value);
  } catch {
    return null;
  }
}
