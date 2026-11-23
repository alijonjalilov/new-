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
            <Link href="/admin" className="font-display text-base tracking-tight">
              {site.hostName}
            </Link>
            <span className="hidden text-sm text-muted sm:inline">Заявки</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-muted hover:text-ink" target="_blank">
              Открыть сайт
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
