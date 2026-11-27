import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/admin/logout-button";
import { site } from "@/content/site";
import { SiteSwitch } from "@/components/admin/site-switch";
import { isSiteClosed } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const [trashCount, closed] = await Promise.all([
    prisma.booking.count({ where: { deletedAt: { not: null } } }).catch(() => 0),
    isSiteClosed(),
  ]);

  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-6">
            {/* Название сайта — ссылка на главную страницу */}
            <Link href="/" className="font-display text-base tracking-tight hover:text-brass-deep" title="На главную страницу сайта">
              {site.hostName}
            </Link>
            <Link href="/admin" className="text-sm text-muted hover:text-ink">
              Заявки
            </Link>
            <Link href="/admin/calendar" className="text-sm text-muted hover:text-ink">
              Календарь
            </Link>
            <Link href="/admin/design" className="text-sm text-muted hover:text-ink">
              Дизайн
            </Link>
            <Link href="/admin/settings" className="text-sm text-muted hover:text-ink">
              Настройки сайта
            </Link>
            <Link href="/admin/trash" className="text-sm text-muted hover:text-ink">
              Корзина{trashCount > 0 ? ` (${trashCount})` : ""}
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <SiteSwitch closed={closed} />
            <Link href="/" className="hidden text-muted hover:text-ink sm:inline">
              На сайт
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      {closed && (
        <p className="bg-danger px-5 py-2.5 text-center text-sm text-white">
          Сайт сейчас закрыт: посетители видят страницу «технические работы», новые заявки не принимаются. Вы, как
          администратор, видите сайт как обычно.
        </p>
      )}
      <main id="main" className="mx-auto max-w-7xl px-5 py-8 md:py-10">
        {children}
      </main>
    </>
  );
}
