import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/logout-button";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-6">
            {/* Название сайта — ссылка на главную страницу */}
            <Link href="/" className="font-display text-base tracking-tight hover:text-brass-deep" title="На главную страницу сайта">
              {site.hostName}
            </Link>
            <Link href="/admin" className="text-sm text-muted hover:text-ink">
              Заявки
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="hidden text-muted hover:text-ink sm:inline">
              На сайт
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-7xl px-5 py-8 md:py-10">
        {children}
      </main>
    </>
  );
}
