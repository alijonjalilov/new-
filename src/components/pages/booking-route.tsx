import { BookingWizard } from "@/components/booking/booking-wizard";
import { stageFontVars } from "@/components/stage/fonts";
import { PreviewBadge } from "@/components/pages/home-route";
import { getAdminSession } from "@/lib/auth";
import { eventTypeFromSlug } from "@/lib/booking/event-types";
import { getHomeDesign, isHomeDesign } from "@/lib/home-design";
import type { Locale } from "@/i18n/config";

type SP = { type?: string | string[]; design?: string | string[] };

/**
 * Страница бронирования в том же дизайне, что и главная:
 * «Сцена» — чёрная анкета с микрофоном, «Классический» — как раньше.
 * Администратор может посмотреть любой вариант: /booking?design=stage или ?design=classic.
 */
export async function BookingRoute({ locale, searchParams }: { locale: Locale; searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const one = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const initialType = eventTypeFromSlug(one(sp.type));
  let design = await getHomeDesign();
  let preview = false;
  const asked = one(sp.design);
  if (isHomeDesign(asked) && asked !== design && (await getAdminSession())) {
    design = asked;
    preview = true;
  }
  if (design === "stage") {
    return (
      <div className={stageFontVars}>
        <BookingWizard initialType={initialType} locale={locale} variant="stage" />
        {preview && <PreviewBadge />}
      </div>
    );
  }
  return (
    <>
      {preview && <PreviewBadge />}
      <BookingWizard initialType={initialType} locale={locale} />
    </>
  );
}
