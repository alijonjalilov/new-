import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { isSectionKey } from "@/lib/content/sections";
import { resetSection, saveSection, undoSection } from "@/lib/content/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Сохранить раздел «Настроек сайта», вернуть предыдущую версию или сбросить к исходному */
export async function POST(request: Request, { params }: { params: Promise<{ section: string }> }) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false, message: "Требуется вход" }, { status: 401 });
  const { section } = await params;
  if (!isSectionKey(section)) return NextResponse.json({ ok: false, message: "Неизвестный раздел" }, { status: 404 });
  const body = (await request.json().catch(() => null)) as { action?: string; value?: unknown } | null;
  try {
    if (body?.action === "save") {
      const err = await saveSection(section, body.value);
      return err ? NextResponse.json({ ok: false, message: err }, { status: 400 }) : NextResponse.json({ ok: true });
    }
    if (body?.action === "undo") {
      const err = await undoSection(section);
      return err ? NextResponse.json({ ok: false, message: err }, { status: 400 }) : NextResponse.json({ ok: true });
    }
    if (body?.action === "reset") {
      await resetSection(section);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, message: "Некорректный запрос" }, { status: 400 });
  } catch (error) {
    console.error("[admin/content]", error);
    return NextResponse.json({ ok: false, message: "Не удалось сохранить. Попробуйте ещё раз." }, { status: 500 });
  }
}
