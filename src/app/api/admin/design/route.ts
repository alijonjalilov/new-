import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { setHomeDesign, setStageStats } from "@/lib/home-design";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tr = z.object({ ru: z.string().trim().max(80), tg: z.string().trim().max(80), en: z.string().trim().max(80) });
const schema = z.object({
  design: z.enum(["classic", "stage"]).optional(),
  stats: z
    .object({
      subtitle: tr,
      items: z.array(z.object({ n: z.number().int().min(0).max(1_000_000), label: tr })).length(3),
    })
    .optional(),
});

export async function POST(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ ok: false, message: "Требуется вход" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Проверьте поля: числа — целые, подписи — до 80 символов" }, { status: 400 });
  try {
    if (parsed.data.design) await setHomeDesign(parsed.data.design);
    if (parsed.data.stats) await setStageStats(parsed.data.stats);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/design]", error);
    return NextResponse.json({ ok: false, message: "Не удалось сохранить. Попробуйте ещё раз." }, { status: 500 });
  }
}
