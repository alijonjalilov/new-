import { redirect } from "next/navigation";
import { getAdminSession, getAuthConfig } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "Вход" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  const cfg = getAuthConfig();

  return (
    <main id="main" className="flex min-h-svh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="font-display text-lg">{site.hostName}</p>
        <h1 className="mt-2 font-display text-3xl font-light tracking-tight">Вход в админ-панель</h1>

        {cfg.configured ? (
          <LoginForm />
        ) : (
          <div role="alert" className="mt-8 rounded-2xl border border-danger/30 bg-white p-5 text-sm leading-relaxed">
            <p className="font-medium text-danger">Админ-панель не настроена</p>
            <p className="mt-2 text-muted">
              Задайте переменные окружения: <strong className="text-ink">{cfg.problems.join(", ")}</strong>. Локально — в файле
              .env, на Railway — во вкладке Variables. Затем перезапустите приложение.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
