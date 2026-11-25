import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Действия над несколькими заявками сразу:
 *  - trash      — переместить в корзину;
 *  - restore    — вернуть из корзины;
 *  - delete     — удалить навсегда (только то, что уже в корзине);
 *  - emptyTrash — очистить корзину целиком (ids не нужны).
 */
const schema = z.union([
  z.object({ action: z.enum(["trash", "restore", "delete"]), ids: z.array(z.string().min(1).max(64)).min(1).max(500) }),
  z.object({ action: z.literal("emptyTrash") }),
]);

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Требуется вход" }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Некорректные данные" }, { status: 400 });
  }

  const body = parsed.data;
  try {
    let count = 0;
    if (body.action === "trash") {
      ({ count } = await prisma.booking.updateMany({
        where: { id: { in: body.ids }, deletedAt: null },
        data: { deletedAt: new Date() },
      }));
    } else if (body.action === "restore") {
      ({ count } = await prisma.booking.updateMany({
        where: { id: { in: body.ids }, deletedAt: { not: null } },
        data: { deletedAt: null },
      }));
    } else if (body.action === "delete") {
      // Навсегда удаляем только заявки из корзины — защита от случайного удаления
      ({ count } = await prisma.booking.deleteMany({ where: { id: { in: body.ids }, deletedAt: { not: null } } }));
    } else {
      ({ count } = await prisma.booking.deleteMany({ where: { deletedAt: { not: null } } }));
    }
    return NextResponse.json({ ok: true, count });
  } catch (error) {
    console.error("[admin/bulk]", error);
    return NextResponse.json({ ok: false, message: "Ошибка базы данных" }, { status: 500 });
  }
}
