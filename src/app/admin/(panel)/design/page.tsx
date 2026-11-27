import { getHomeDesign, getStageStats, getVenueVersions, VENUE_SLOTS, venuePhotoUrl } from "@/lib/home-design";
import { getEventCategory } from "@/content/events";
import { DesignSwitch, StatsForm, VenueUploader } from "@/components/admin/design-settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Дизайн главной" };

export default async function DesignPage() {
  const [design, stats, versions] = await Promise.all([getHomeDesign(), getStageStats(), getVenueVersions()]);
  const venues = VENUE_SLOTS.map((slot) => ({
    slot,
    title: getEventCategory(slot)?.title ?? slot,
    url: versions[slot] ? venuePhotoUrl(slot, versions[slot]!) : null,
  }));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-light tracking-tight">Дизайн главной страницы</h1>

      <section aria-labelledby="d-design" className="rounded-2xl bg-white p-6 md:p-8">
        <h2 id="d-design" className="font-display text-xl">Какой дизайн видят посетители</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Переключение срабатывает сразу после сохранения. Меняется только главная страница, остальные страницы остаются как есть.
        </p>
        <DesignSwitch current={design} />
      </section>

      <section aria-labelledby="d-venues" className="rounded-2xl bg-white p-6 md:p-8">
        <h2 id="d-venues" className="font-display text-xl">Фото площадок для «Сцены»</h2>
        <p className="mt-2 max-w-2xl text-muted">
          По одному фото на формат — оно становится фоном, пока посетитель листает форматы. Лучше горизонтальное фото зала
          без людей крупным планом. Без фото показывается рисунок.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <li key={v.slot}>
              <VenueUploader slot={v.slot} title={v.title} url={v.url} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="d-stats" className="rounded-2xl bg-white p-6 md:p-8">
        <h2 id="d-stats" className="font-display text-xl">Блок «Один вечер в цифрах»</h2>
        <p className="mt-2 max-w-2xl text-muted">Три числа с подписями на трёх языках. Числа досчитываются от нуля, когда блок появляется.</p>
        <StatsForm initial={stats} />
      </section>
    </div>
  );
}
