import { NextResponse } from "next/server";
import { z } from "zod";
import { checkCredentials, createSessionToken, getAuthConfig, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const cfg = getAuthConfig();
  if (!cfg.configured) {
    return NextResponse.json(
      { ok: false, message: `Админ-панель не настроена. Задайте переменные окружения: ${cfg.problems.join(", ")}.` },
      { status: 503 },
    );
  }

  const limit = rateLimit(`login:${clientIp(request.headers)}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: `Слишком много попыток. Повторите через ${Math.ceil(limit.retryAfter / 60)} мин.` },
      { status: 429 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Введите логин и пароль" }, { status: 400 });
  }

  const valid = await checkCredentials(parsed.data.username, parsed.data.password);
  if (!valid) {
    return NextResponse.json({ ok: false, message: "Неверный логин или пароль" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(parsed.data.username), sessionCookieOptions);
  return res;
}
