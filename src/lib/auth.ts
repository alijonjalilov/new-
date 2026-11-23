import { cookies } from "next/headers";

/**
 * Простая и надёжная авторизация администратора:
 *  - логин и пароль берутся из переменных окружения (ADMIN_USERNAME / ADMIN_PASSWORD);
 *  - после входа выдаётся httpOnly-cookie с токеном, подписанным HMAC-SHA256 (SESSION_SECRET);
 *  - никаких секретов в коде и в репозитории.
 */

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 дней

const encoder = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Buffer.from(arr).toString("base64url");
}

export function getAuthConfig() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  let secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV !== "production") secret = "dev-only-insecure-secret-change-me-please";

  const problems: string[] = [];
  if (!username) problems.push("ADMIN_USERNAME");
  if (!password) problems.push("ADMIN_PASSWORD");
  if (!secret || secret.length < 32) problems.push("SESSION_SECRET (минимум 32 символа)");

  return { username, password, secret, configured: problems.length === 0, problems };
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  return b64url(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

/** Сравнение строк за постоянное время (через хэши одинаковой длины). */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

export async function checkCredentials(username: string, password: string): Promise<boolean> {
  const cfg = getAuthConfig();
  if (!cfg.configured) return false;
  const [u, p] = await Promise.all([safeEqual(username, cfg.username!), safeEqual(password, cfg.password!)]);
  return u && p;
}

export async function createSessionToken(username: string): Promise<string> {
  const cfg = getAuthConfig();
  const payload = b64url(encoder.encode(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })));
  return `${payload}.${await hmac(cfg.secret!, payload)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<{ username: string } | null> {
  if (!token) return null;
  const cfg = getAuthConfig();
  if (!cfg.configured) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!(await safeEqual(sig, await hmac(cfg.secret!, payload)))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u: string; exp: number };
    if (typeof data.exp !== "number" || data.exp < Date.now() / 1000) return null;
    if (data.u !== cfg.username) return null; // логин сменили — старые сессии недействительны
    return { username: data.u };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

/** Текущая сессия администратора (в серверных компонентах и route handlers). */
export async function getAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
