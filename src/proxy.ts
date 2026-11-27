import { NextResponse, type NextRequest } from "next/server";

/**
 * Определяет язык страницы по адресу (/tg..., /en..., иначе русский)
 * и передаёт его в корневой layout — чтобы в <html lang> сразу стоял верный язык
 * (поисковики читают его из кода страницы).
 */
export function proxy(request: NextRequest) {
  const p = request.nextUrl.pathname;
  const lang = p === "/tg" || p.startsWith("/tg/") ? "tg" : p === "/en" || p.startsWith("/en/") ? "en" : "ru";
  const headers = new Headers(request.headers);
  headers.set("x-site-lang", lang);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/|api/|images/|og/|favicon|icon|robots.txt|sitemap.xml).*)"],
};
