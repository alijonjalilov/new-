import Link from "next/link";
import { SECTIONS, type SectionKey } from "@/lib/content/sections";
import { getSectionValue } from "@/lib/content/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Настройки сайта" };

const fmt = (d: Date) => d.toLocaleString("ru-RU", { timeZone: "Asia/Dushanbe", dateStyle: "medium", timeStyle: "short" });

export default async function SettingsPage() {
  const keys = Object.keys(SECTIONS) as SectionKey[];
  const info = await Promise.all(keys.map((k) => getSectionValue(k)));
  const more = [
    { href: "/admin/design", title: "Один вечер в цифрах", text: "Три числа с подписями — в разделе «Дизайн»" },
    { href: "/admin/design", title: "Фото площадок", text: "Фон для форматов на «Сцене» — в разделе «Дизайн»" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-light tracking-tight">Настройки сайта</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Тексты и вопросы сайта на трёх языках. Изменения появляются на сайте сразу после сохранения. Если что-то пошло не так — в
          каждом разделе можно вернуть предыдущую версию.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((k, i) => (
          <li key={k}>
            <Link href={`/admin/settings/${k}`} className="flex h-full flex-col gap-2 rounded-2xl bg-white p-6 transition-colors hover:bg-paper">
              <span className="font-medium">{SECTIONS[k].title}</span>
              <span className="text-sm text-muted">{SECTIONS[k].description}</span>
              <span className="mt-auto pt-3 text-xs text-muted">
                {info[i].updatedAt ? `Изменено: ${fmt(info[i].updatedAt!)}` : "Исходный вариант"}
              </span>
            </Link>
          </li>
        ))}
        {more.map((m) => (
          <li key={m.title}>
            <Link href={m.href} className="flex h-full flex-col gap-2 rounded-2xl bg-white p-6 transition-colors hover:bg-paper">
              <span className="font-medium">{m.title}</span>
              <span className="text-sm text-muted">{m.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
