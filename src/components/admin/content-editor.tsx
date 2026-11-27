"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingData, QData, Tr3 } from "@/lib/content/booking-data";
import type { FaqData, FormatData, StepsData } from "@/lib/content/sections";

/* ───────────────────────── Общие элементы ───────────────────────── */

const LANGS: { k: keyof Tr3; label: string }[] = [
  { k: "ru", label: "RU" },
  { k: "tg", label: "ТҶ" },
  { k: "en", label: "EN" },
];
const empty3 = (): Tr3 => ({ ru: "", tg: "", en: "" });
const rid = (p: string) => `${p}${Math.random().toString(36).slice(2, 8)}`;

function Tr3Input({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string;
  value: Tr3 | undefined;
  onChange: (v: Tr3) => void;
  multiline?: boolean;
  hint?: string;
}) {
  const v = value ?? empty3();
  return (
    <div className="space-y-1.5">
      <span className="field-label">{label}</span>
      {hint && <p className="-mt-1 text-xs text-muted">{hint}</p>}
      {LANGS.map((l) => (
        <label key={l.k} className="grid grid-cols-[2.25rem_1fr] items-start gap-2">
          <span className="pt-3 text-xs font-semibold text-muted">{l.label}</span>
          {multiline ? (
            <textarea className="field min-h-20 resize-y" value={v[l.k]} onChange={(e) => onChange({ ...v, [l.k]: e.target.value })} />
          ) : (
            <input className="field" value={v[l.k]} onChange={(e) => onChange({ ...v, [l.k]: e.target.value })} />
          )}
        </label>
      ))}
    </div>
  );
}

function RowTools({ onUp, onDown, onDelete, first, last }: { onUp: () => void; onDown: () => void; onDelete: () => void; first: boolean; last: boolean }) {
  const b = "inline-grid size-9 place-items-center rounded-full border border-line bg-white text-muted hover:text-ink disabled:opacity-30";
  return (
    <span className="flex shrink-0 gap-1.5">
      <button type="button" className={b} onClick={onUp} disabled={first} aria-label="Выше" title="Выше">
        ↑
      </button>
      <button type="button" className={b} onClick={onDown} disabled={last} aria-label="Ниже" title="Ниже">
        ↓
      </button>
      <button
        type="button"
        className={`${b} hover:text-danger`}
        onClick={() => {
          if (confirm("Удалить?")) onDelete();
        }}
        aria-label="Удалить"
        title="Удалить"
      >
        ✕
      </button>
    </span>
  );
}

function move<T>(arr: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
const setAt = <T,>(arr: T[], i: number, v: T) => arr.map((x, j) => (j === i ? v : x));

function ListEditor<T>({
  items,
  onChange,
  render,
  titleOf,
  addLabel,
  newItem,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  render: (item: T, set: (v: T) => void) => React.ReactNode;
  titleOf: (item: T, i: number) => string;
  addLabel: string;
  newItem: () => T;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-3 p-3 pl-4">
            <button type="button" className="flex-1 text-left" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span className="mr-2 text-sm text-muted">{i + 1}.</span>
              {titleOf(it, i) || <span className="text-muted">Без названия</span>}
              <span className="ml-2 text-sm text-brass-deep">{open === i ? "свернуть" : "изменить"}</span>
            </button>
            <RowTools
              first={i === 0}
              last={i === items.length - 1}
              onUp={() => {
                onChange(move(items, i, -1));
                setOpen(null);
              }}
              onDown={() => {
                onChange(move(items, i, 1));
                setOpen(null);
              }}
              onDelete={() => {
                onChange(items.filter((_, j) => j !== i));
                setOpen(null);
              }}
            />
          </div>
          {open === i && <div className="space-y-5 border-t border-line p-4">{render(it, (v) => onChange(setAt(items, i, v)))}</div>}
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-2xl border-2 border-dashed border-line p-3 text-muted hover:text-ink"
        onClick={() => {
          onChange([...items, newItem()]);
          setOpen(items.length);
        }}
      >
        + {addLabel}
      </button>
    </div>
  );
}

function Tabs({ tabs, value, onChange }: { tabs: { key: string; label: string }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          type="button"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full border px-4 py-1.5 text-sm ${value === t.key ? "border-ink bg-ink text-paper" : "border-line bg-white hover:bg-paper"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ───────────────────────── Анкета бронирования ───────────────────────── */

const TYPES: { v: QData["type"]; label: string }[] = [
  { v: "single", label: "Один вариант" },
  { v: "multi", label: "Несколько вариантов" },
  { v: "text", label: "Короткий текст" },
  { v: "textarea", label: "Длинный текст" },
  { v: "date", label: "Дата" },
  { v: "time", label: "Время" },
  { v: "number", label: "Число" },
  { v: "list", label: "Список (несколько полей)" },
  { v: "consent", label: "Галочка-согласие" },
];
const typeLabel = (v: string) => TYPES.find((t) => t.v === v)?.label ?? v;

function QuestionForm({ q, set, earlier }: { q: QData; set: (q: QData) => void; earlier: QData[] }) {
  const choice = q.type === "single" || q.type === "multi";
  const condQ = earlier.find((e) => e.id === q.showIf?.q);
  return (
    <>
      <Tr3Input label="Текст вопроса" value={q.title} onChange={(title) => set({ ...q, title })} />
      <Tr3Input label="Пояснение под вопросом (необязательно)" value={q.description} onChange={(description) => set({ ...q, description })} multiline />
      <Tr3Input
        label="Как подписан ответ в заявке"
        hint="Короткая подпись в проверке ответов, в админке и в Telegram"
        value={q.summaryLabel}
        onChange={(summaryLabel) => set({ ...q, summaryLabel })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Тип ответа</span>
          <select className="field" value={q.type} onChange={(e) => set({ ...q, type: e.target.value as QData["type"], options: q.options ?? [] })}>
            {TYPES.map((t) => (
              <option key={t.v} value={t.v}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 pt-7">
          <input type="checkbox" className="size-5 accent-velvet" checked={!q.optional} onChange={(e) => set({ ...q, optional: !e.target.checked })} />
          Обязательный вопрос
        </label>
      </div>

      {choice && (
        <div className="space-y-2">
          <span className="field-label">Варианты ответа</span>
          {(q.options ?? []).map((o, i, arr) => (
            <div key={o.value} className="flex items-start gap-2 rounded-xl border border-line p-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-3">
                {LANGS.map((l) => (
                  <input
                    key={l.k}
                    className="field"
                    placeholder={l.label}
                    aria-label={`Вариант ${i + 1}, ${l.label}`}
                    value={o.label[l.k]}
                    onChange={(e) => set({ ...q, options: setAt(arr, i, { ...o, label: { ...o.label, [l.k]: e.target.value } }) })}
                  />
                ))}
              </div>
              <RowTools
                first={i === 0}
                last={i === arr.length - 1}
                onUp={() => set({ ...q, options: move(arr, i, -1) })}
                onDown={() => set({ ...q, options: move(arr, i, 1) })}
                onDelete={() => set({ ...q, options: arr.filter((_, j) => j !== i), otherValue: q.otherValue === o.value ? undefined : q.otherValue })}
              />
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-xl border-2 border-dashed border-line p-2 text-sm text-muted hover:text-ink"
            onClick={() => set({ ...q, options: [...(q.options ?? []), { value: rid("o"), label: empty3() }] })}
          >
            + Добавить вариант
          </button>
          <label className="block pt-2">
            <span className="field-label">Вариант, после которого нужно уточнить текстом (например «Другое»)</span>
            <select className="field" value={q.otherValue ?? ""} onChange={(e) => set({ ...q, otherValue: e.target.value || undefined })}>
              <option value="">— нет —</option>
              {(q.options ?? []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label.ru || "(без текста)"}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {(q.type === "text" || q.type === "textarea" || q.type === "number" || q.type === "list") && (
        <Tr3Input label="Подсказка в поле (необязательно)" value={q.placeholder} onChange={(placeholder) => set({ ...q, placeholder })} />
      )}
      {q.type === "number" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="field-label">Минимум</span>
            <input className="field" inputMode="numeric" value={q.min ?? 0} onChange={(e) => set({ ...q, min: Number(e.target.value.replace(/\D/g, "") || 0) })} />
          </label>
          <label className="block">
            <span className="field-label">Максимум</span>
            <input className="field" inputMode="numeric" value={q.max ?? 1000000} onChange={(e) => set({ ...q, max: Number(e.target.value.replace(/\D/g, "") || 0) })} />
          </label>
          <div className="sm:col-span-3">
            <Tr3Input label="Подпись после числа (например «сомони»)" value={q.suffix} onChange={(suffix) => set({ ...q, suffix })} />
          </div>
        </div>
      )}
      {q.type === "list" && <Tr3Input label="Текст кнопки «Добавить»" value={q.addLabel} onChange={(addLabel) => set({ ...q, addLabel })} />}
      {q.type === "consent" && <Tr3Input label="Текст рядом с галочкой" value={q.label} onChange={(label) => set({ ...q, label })} multiline />}

      <div className="space-y-2 rounded-xl bg-paper p-4">
        <span className="field-label">Когда показывать вопрос</span>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="field"
            value={q.showIf?.q ?? ""}
            onChange={(e) => set({ ...q, showIf: e.target.value ? { q: e.target.value, op: "is", values: [] } : null })}
          >
            <option value="">Всегда</option>
            {earlier
              .filter((e) => e.type === "single")
              .map((e) => (
                <option key={e.id} value={e.id}>
                  Если «{e.title.ru}»…
                </option>
              ))}
          </select>
          {q.showIf?.q && (
            <select className="field" value={q.showIf.op} onChange={(e) => set({ ...q, showIf: { ...q.showIf!, op: e.target.value as "is" | "isNot" } })}>
              <option value="is">…равно одному из:</option>
              <option value="isNot">…не равно ни одному из:</option>
            </select>
          )}
        </div>
        {condQ && q.showIf && (
          <div className="flex flex-wrap gap-3 pt-1">
            {(condQ.options ?? []).map((o) => (
              <label key={o.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-velvet"
                  checked={q.showIf!.values.includes(o.value)}
                  onChange={(e) =>
                    set({
                      ...q,
                      showIf: {
                        ...q.showIf!,
                        values: e.target.checked ? [...q.showIf!.values, o.value] : q.showIf!.values.filter((v) => v !== o.value),
                      },
                    })
                  }
                />
                {o.label.ru}
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function BookingEditor({ value, onChange, eventTypes }: { value: BookingData; onChange: (v: BookingData) => void; eventTypes: { key: string; label: string }[] }) {
  const [tab, setTab] = useState(eventTypes[0].key);
  const list = value[tab as keyof BookingData] ?? [];
  const setList = (l: QData[]) => onChange({ ...value, [tab]: l });
  return (
    <div className="space-y-4">
      <Tabs tabs={eventTypes} value={tab} onChange={setTab} />
      <p className="text-sm text-muted">
        Вопросы идут в этом порядке. Вопрос с условием показывается, только если на вопрос выше ответили нужным образом.
      </p>
      <ListEditor
        key={tab}
        items={list}
        onChange={setList}
        addLabel="Добавить вопрос"
        newItem={(): QData => ({ id: rid("q"), type: "single", title: empty3(), summaryLabel: empty3(), options: [], showIf: null })}
        titleOf={(q) => {
          const tags = [typeLabel(q.type), q.optional ? "можно пропустить" : "обязательный"];
          if (q.showIf?.q) tags.push("с условием");
          return `${q.title.ru}  ·  ${tags.join(" · ")}`;
        }}
        render={(q, set) => <QuestionForm q={q} set={set} earlier={list.slice(0, list.indexOf(q))} />}
      />
    </div>
  );
}

/* ───────────────────────── Форматы, вопросы, шаги ───────────────────────── */

function FormatsEditor({ value, onChange }: { value: FormatData[]; onChange: (v: FormatData[]) => void }) {
  const [tab, setTab] = useState(value[0]?.slug ?? "");
  const i = value.findIndex((f) => f.slug === tab);
  const f = value[i];
  const set = (nf: FormatData) => onChange(setAt(value, i, nf));
  if (!f) return null;
  return (
    <div className="space-y-6">
      <Tabs tabs={value.map((x) => ({ key: x.slug, label: x.title.ru }))} value={tab} onChange={setTab} />
      <div className="space-y-5 rounded-2xl bg-white p-6">
        <Tr3Input label="Название" value={f.title} onChange={(title) => set({ ...f, title })} />
        <Tr3Input label="Коротко (в списке форматов)" value={f.short} onChange={(short) => set({ ...f, short })} multiline />
        <Tr3Input label="Вступление на странице формата" value={f.intro} onChange={(intro) => set({ ...f, intro })} multiline />
      </div>
      <div className="space-y-3 rounded-2xl bg-white p-6">
        <h3 className="font-medium">Что входит в работу</h3>
        <ListEditor
          key={`inc-${tab}`}
          items={f.includes}
          onChange={(includes) => set({ ...f, includes })}
          addLabel="Добавить пункт"
          newItem={empty3}
          titleOf={(x) => x.ru}
          render={(x, s) => <Tr3Input label="Текст пункта" value={x} onChange={s} />}
        />
      </div>
      <div className="space-y-3 rounded-2xl bg-white p-6">
        <h3 className="font-medium">Как идёт подготовка</h3>
        <ListEditor
          key={`pr-${tab}`}
          items={f.process}
          onChange={(process) => set({ ...f, process })}
          addLabel="Добавить этап"
          newItem={() => ({ title: empty3(), text: empty3() })}
          titleOf={(x) => x.title.ru}
          render={(x, s) => (
            <>
              <Tr3Input label="Название этапа" value={x.title} onChange={(title) => s({ ...x, title })} />
              <Tr3Input label="Описание" value={x.text} onChange={(text) => s({ ...x, text })} multiline />
            </>
          )}
        />
      </div>
      <div className="space-y-2 rounded-2xl bg-white p-6">
        <h3 className="font-medium">Видео YouTube</h3>
        <p className="text-sm text-muted">По одной ссылке в строке. Когда есть видео, на странице формата появится блок «Фото и видео».</p>
        <textarea
          className="field min-h-24"
          value={f.youtube.join("\n")}
          onChange={(e) => set({ ...f, youtube: e.target.value.split("\n") })}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </div>
    </div>
  );
}

function FaqEditor({ value, onChange, formats }: { value: FaqData; onChange: (v: FaqData) => void; formats: { slug: string; title: string }[] }) {
  const [tab, setTab] = useState(value[0]?.slug ?? "");
  const i = value.findIndex((f) => f.slug === tab);
  const f = value[i];
  if (!f) return null;
  return (
    <div className="space-y-4">
      <Tabs tabs={formats.map((x) => ({ key: x.slug, label: x.title }))} value={tab} onChange={setTab} />
      <ListEditor
        key={tab}
        items={f.items}
        onChange={(items) => onChange(setAt(value, i, { ...f, items }))}
        addLabel="Добавить вопрос"
        newItem={() => ({ q: empty3(), a: empty3() })}
        titleOf={(x) => x.q.ru}
        render={(x, s) => (
          <>
            <Tr3Input label="Вопрос" value={x.q} onChange={(q) => s({ ...x, q })} />
            <Tr3Input label="Ответ" value={x.a} onChange={(a) => s({ ...x, a })} multiline />
          </>
        )}
      />
    </div>
  );
}

function StepsEditor({ value, onChange }: { value: StepsData; onChange: (v: StepsData) => void }) {
  return (
    <ListEditor
      items={value}
      onChange={onChange}
      addLabel="Добавить шаг"
      newItem={() => ({ title: empty3(), text: empty3() })}
      titleOf={(x) => x.title.ru}
      render={(x, s) => (
        <>
          <Tr3Input label="Название шага" value={x.title} onChange={(title) => s({ ...x, title })} />
          <Tr3Input label="Описание" value={x.text} onChange={(text) => s({ ...x, text })} multiline />
        </>
      )}
    />
  );
}

/* ───────────────────────── Каркас редактора ───────────────────────── */

export function ContentEditor({
  section,
  title,
  initial,
  changed,
  hasPrev,
  formats,
  eventTypes,
}: {
  section: string;
  title: string;
  initial: unknown;
  changed: boolean;
  hasPrev: boolean;
  formats: { slug: string; title: string }[];
  eventTypes: { key: string; label: string }[];
}) {
  const router = useRouter();
  const [value, setValue] = useState<unknown>(initial);
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<"idle" | "saving">("idle");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const change = (v: unknown) => {
    setValue(v);
    setDirty(true);
    setMsg(null);
  };

  async function send(action: "save" | "undo" | "reset") {
    if (action === "reset" && !confirm("Вернуть раздел к исходному виду? Текущую версию можно будет вернуть кнопкой «Предыдущая версия».")) return;
    setState("saving");
    const res = await fetch(`/api/admin/content/${section}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action === "save" ? { action, value } : { action }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => null) : null;
    setState("idle");
    if (res?.ok && data?.ok) {
      setMsg({ ok: true, text: action === "save" ? "Сохранено — уже на сайте" : "Готово" });
      setDirty(false);
      if (action !== "save") window.location.reload();
      else router.refresh();
    } else {
      setMsg({ ok: false, text: data?.message ?? "Не удалось сохранить" });
    }
  }

  const editor = useMemo(() => {
    switch (section) {
      case "booking":
        return <BookingEditor value={value as BookingData} onChange={change} eventTypes={eventTypes} />;
      case "formats":
        return <FormatsEditor value={value as FormatData[]} onChange={change} />;
      case "faq":
        return <FaqEditor value={value as FaqData} onChange={change} formats={formats} />;
      case "steps":
        return <StepsEditor value={value as StepsData} onChange={change} />;
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, value]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-light tracking-tight">{title}</h1>
        <div className="flex flex-wrap gap-2 text-sm">
          {hasPrev && (
            <button type="button" className="rounded-full border border-line bg-white px-4 py-2 hover:bg-paper" onClick={() => send("undo")}>
              Предыдущая версия
            </button>
          )}
          {changed && (
            <button type="button" className="rounded-full border border-line bg-white px-4 py-2 hover:bg-paper" onClick={() => send("reset")}>
              Вернуть исходный вариант
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted">Тексты заполняются на трёх языках: RU — русский, ТҶ — таджикский, EN — английский. Пустой перевод заменяется русским текстом.</p>
      {editor}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <span role="status" className={`text-sm ${msg ? (msg.ok ? "text-success" : "text-danger") : "text-muted"}`}>
            {msg?.text ?? (dirty ? "Есть несохранённые изменения" : "Изменений нет")}
          </span>
          <button type="button" className="btn btn-primary min-h-11" disabled={!dirty || state === "saving"} onClick={() => send("save")}>
            {state === "saving" ? "Сохраняю…" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
