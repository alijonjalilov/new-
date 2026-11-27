import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isVenueSlot } from "@/lib/home-design";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

type Ctx = { params: Promise<{ slot: string }> };

/** Загрузить фото площадки (тело запроса — сама картинка, уже уменьшенная в браузере) */
export async function POST(request: Request, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false, message: "Требуется вход" }, { status: 401 });
  const { slot } = await params;
  if (!isVenueSlot(slot)) return NextResponse.json({ ok: false, message: "Неизвестный формат" }, { status: 404 });
  const mime = (request.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!TYPES.includes(mime)) return NextResponse.json({ ok: false, message: "Нужна картинка JPG, PNG или WebP" }, { status: 415 });
  const buf = Buffer.from(await request.arrayBuffer());
  if (buf.length === 0 || buf.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, message: "Файл слишком большой (максимум 4 МБ)" }, { status: 413 });
  }
  await prisma.venuePhoto.upsert({ where: { slot }, update: { mime, data: buf }, create: { slot, mime, data: buf } });
  return NextResponse.json({ ok: true });
}

/** Удалить фото — вернётся иллюстрация */
export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false, message: "Требуется вход" }, { status: 401 });
  const { slot } = await params;
  if (!isVenueSlot(slot)) return NextResponse.json({ ok: false, message: "Неизвестный формат" }, { status: 404 });
  await prisma.venuePhoto.deleteMany({ where: { slot } });
  return NextResponse.json({ ok: true });
}
