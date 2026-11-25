import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { setSiteClosed } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Закрыть или открыть сайт для посетителей: { closed: true | false } */
const schema = z.object({ closed: z.boolean() });

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Требуется вход" }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Некорректные данные" }, { status: 400 });
  try {
    await setSiteClosed(parsed.data.closed);
    return NextResponse.json({ ok: true, closed: parsed.data.closed });
  } catch (error) {
    console.error("[admin/site] не удалось сохранить", error);
    return NextResponse.json({ ok: false, message: "Не удалось сохранить. Попробуйте ещё раз." }, { status: 500 });
  }
}
