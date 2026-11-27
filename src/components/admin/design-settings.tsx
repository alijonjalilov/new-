"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomeDesign, StageStats, Tr } from "@/lib/home-design";

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  const data = res ? await res.json().catch(() => null) : null;
  return { ok: Boolean(res?.ok && data?.ok), message: data?.message as string | undefined };
}

/* ── Выбор дизайна ─────────────────────────────────────────── */
export function DesignSwitch({ current }: { current: HomeDesign }) {
  const router = useRouter();
  const [value, setValue] = useState<HomeDesign>(current);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

  const options: { v: HomeDesign; title: string; text: string }[] = [
    { v: "classic", title: "Классический", text: "Текущий дизайн: светлые блоки, страница прокручивается вниз." },
    { v: "stage", title: "Сцена с микрофоном", text: "Чёрная сцена, микрофон в центре, сцены меняются колесом мыши." },
  ];

  async function save() {
    setState("saving");
    const r = await post("/api/admin/design", { design: value });
    setState(r.ok ? "saved" : "error");
    setMsg(r.ok ? "Сохранено — посетители уже видят этот дизайн" : r.message ?? "Не удалось сохранить");
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-4">
      <fieldset className="grid gap-3 md:grid-cols-2">
        <legend className="sr-only">Дизайн главной страницы</legend>
        {options.map((o) => (
          <label
            key={o.v}
            className={`flex cursor-pointer gap-3 rounded-2xl border p-5 ${value === o.v ? "border-ink bg-paper" : "border-line hover:bg-paper"}`}
          >
            <input type="radio" name="design" value={o.v} checked={value === o.v} onChange={() => setValue(o.v)} className="mt-1 size-4 accent-velvet" />
            <span>
              <span className="block font-medium">
                {o.title}
                {current === o.v && <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">сейчас на сайте</span>}
              </span>
              <span className="mt-1 block text-sm text-muted">{o.text}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={state === "saving" || value === current} className="btn btn-primary disabled:opacity-40">
          {state === "saving" ? "Сохраняю…" : "Сохранить"}
        </button>
        <a href="/?design=stage" target="_blank" rel="noopener" className="link-underline text-sm">
          Посмотреть «Сцену»
        </a>
        <a href="/?design=classic" target="_blank" rel="noopener" className="link-underline text-sm">
          Посмотреть классический
        </a>
        {msg && (
          <span role="status" className={`text-sm ${state === "error" ? "text-danger" : "text-success"}`}>
            {msg}
          </span>
        )}
      </div>
      <p className="text-sm text-muted">Ссылки «Посмотреть» показывают дизайн только вам (вы вошли как администратор), посетители его не видят.</p>
    </div>
  );
}

/* ── Фото площадки ─────────────────────────────────────────── */

/** Уменьшаем фото в браузере до 1920 px по длинной стороне и сжимаем в JPEG */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/jpeg", 0.84));
}

export function VenueUploader({ slot, title, url }: { slot: string; title: string; url: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const blob = await shrink(file);
      const res = await fetch(`/api/admin/venue/${slot}`, { method: "POST", headers: { "content-type": "image/jpeg" }, body: blob });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.message ?? "Не удалось загрузить");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error && e.message !== "toBlob" ? e.message : "Не удалось обработать фото. Попробуйте другой файл.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/admin/venue/${slot}`, { method: "DELETE" }).catch(() => null);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="relative aspect-[16/9] bg-ink">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={`Площадка: ${title}`} className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-paper/70">Фото не загружено — показывается рисунок</span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="font-medium">{title}</p>
        <div className="flex flex-wrap gap-2">
          <label className={`btn btn-primary min-h-10 cursor-pointer px-4 py-2 text-sm ${busy ? "pointer-events-none opacity-50" : ""}`}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void upload(f);
              }}
            />
            {busy ? "Загружаю…" : url ? "Заменить фото" : "Загрузить фото"}
          </label>
          {url && (
            <button type="button" onClick={remove} disabled={busy} className="rounded-full border border-line px-4 py-2 text-sm hover:bg-paper">
              Удалить
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Цифры ─────────────────────────────────────────────────── */
const LANGS: { k: keyof Tr; label: string }[] = [
  { k: "ru", label: "Русский" },
  { k: "tg", label: "Таджикский" },
  { k: "en", label: "Английский" },
];

export function StatsForm({ initial }: { initial: StageStats }) {
  const router = useRouter();
  const [stats, setStats] = useState<StageStats>(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

  const setItem = (i: number, patch: Partial<StageStats["items"][number]>) =>
    setStats((s) => ({ ...s, items: s.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) }));

  async function save() {
    setState("saving");
    const r = await post("/api/admin/design", { stats });
    setState(r.ok ? "saved" : "error");
    setMsg(r.ok ? "Сохранено" : r.message ?? "Не удалось сохранить");
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {LANGS.map((l) => (
          <label key={l.k} className="block">
            <span className="field-label">Пояснение под заголовком — {l.label}</span>
            <input
              className="field"
              value={stats.subtitle[l.k]}
              maxLength={80}
              onChange={(e) => setStats((s) => ({ ...s, subtitle: { ...s.subtitle, [l.k]: e.target.value } }))}
            />
          </label>
        ))}
      </div>
      {stats.items.map((it, i) => (
        <fieldset key={i} className="grid gap-3 rounded-2xl border border-line p-4 md:grid-cols-[8rem_1fr_1fr_1fr]">
          <legend className="px-1 text-sm text-muted">Цифра {i + 1}</legend>
          <div className="block">
            <label className="block">
              <span className="field-label">Число</span>
              <input
                className="field tabular-nums disabled:opacity-40"
                inputMode="numeric"
                disabled={it.inf}
                value={it.inf ? "∞" : String(it.n)}
                onChange={(e) => setItem(i, { n: Number(e.target.value.replace(/\D/g, "").slice(0, 7) || 0) })}
              />
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(it.inf)} onChange={(e) => setItem(i, { inf: e.target.checked })} className="size-4 accent-velvet" />
              ∞ вместо числа
            </label>
          </div>
          {LANGS.map((l) => (
            <label key={l.k} className="block">
              <span className="field-label">Подпись — {l.label}</span>
              <input
                className="field"
                value={it.label[l.k]}
                maxLength={80}
                onChange={(e) => setItem(i, { label: { ...it.label, [l.k]: e.target.value } })}
              />
            </label>
          ))}
        </fieldset>
      ))}
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={state === "saving"} className="btn btn-primary">
          {state === "saving" ? "Сохраняю…" : "Сохранить цифры"}
        </button>
        {msg && (
          <span role="status" className={`text-sm ${state === "error" ? "text-danger" : "text-success"}`}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
