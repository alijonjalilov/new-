import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomePage, homeMetadata } from "@/components/pages/home-page";
import { StageHome } from "@/components/stage/stage-home";
import { getAdminSession } from "@/lib/auth";
import { getHomeDesign, isHomeDesign } from "@/lib/home-design";
import type { Locale } from "@/i18n/config";

export { homeMetadata };

/**
 * Главная страница: выбирает дизайн по настройке из админки.
 * Администратор может посмотреть любой дизайн по ссылке ?design=stage или ?design=classic.
 */
export async function HomeRoute({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<{ design?: string | string[] }>;
}) {
  const sp = await searchParams;
  const asked = Array.isArray(sp.design) ? sp.design[0] : sp.design;
  let design = await getHomeDesign();
  let preview = false;
  if (isHomeDesign(asked) && asked !== design && (await getAdminSession())) {
    design = asked;
    preview = true;
  }

  if (design === "stage") return <StageHome locale={locale} preview={preview} />;

  return (
    <>
      {preview && <PreviewBadge />}
      <SiteHeader locale={locale} />
      <main id="main">
        <HomePage locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function PreviewBadge() {
  return (
    <p className="fixed left-1/2 top-3 z-[70] -translate-x-1/2 rounded-full bg-brass px-4 py-1.5 text-sm text-velvet shadow">
      Предпросмотр — этот дизайн видите только вы
    </p>
  );
}
