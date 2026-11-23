import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { BookingStatus } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z
  .object({
    status: z.enum(BookingStatus).optional(),
    adminNote: z.string().max(5000).optional(),
  })
  .refine((d) => d.status !== undefined || d.adminNote !== undefined, "Нечего обновлять");

const unauthorized = () => NextResponse.json({ ok: false, message: "Требуется вход" }, { status: 401 });

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Некорректные данные" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.adminNote !== undefined ? { adminNote: parsed.data.adminNote.trim() || null } : {}),
      },
      select: { id: true, status: true, adminNote: true },
    });
    return NextResponse.json({ ok: true, booking });
  } catch {
    return NextResponse.json({ ok: false, message: "Заявка не найдена" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  try {
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Заявка не найдена" }, { status: 404 });
  }
}
