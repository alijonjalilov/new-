import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Проверка работоспособности для Railway (healthcheckPath). */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "up" });
  } catch (error) {
    console.error("[health] База данных недоступна:", error);
    return NextResponse.json({ ok: false, db: "down" }, { status: 503 });
  }
}
