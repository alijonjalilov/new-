"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { EVENT_TYPE_BY_KEY, type BookingStatusKey } from "@/lib/booking/event-types";
import type { EventTypeKey } from "@/lib/booking/types";
import { BusyBadge, StatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

export interface BookingRow {
  id: string;
  number: number;
  eventType: EventTypeKey;
  status: BookingStatusKey;
  clientName: string;
  phone: string;
  city: string | null;
  guests: string | null;
  /** Дата мероприятия, уже отформатированная */
  eventDate: string | null;
  createdAt: string;
  busy?: string | null;
  /** Для корзины: когда удалена */
  deletedAt?: string | null;
}

type Action = "trash" | "restore" | "delete";

const plural = (n: number) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "заявку";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "заявки";
  return "заявок";
};

/**
 * Список заявок с выбором нескольких строк.
 * mode="active" — обычный список: выбранные можно переместить в корзину.
 * mode="trash"  — корзина: выбранные можно восстановить или удалить навсегда.
 */
export function BookingList({ rows, mode = "active" }: { rows: BookingRow[]; mode?: "active" | "trash" }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ids = useMemo(() => rows.map((r) => r.id), [rows]);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const count = [...selected].filter((id) => ids.includes(id)).length;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(ids));

  async function run(action: Action) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/bookings/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: [...selected].filter((id) => ids.includes(id)) }),
      });
      if (res.status === 401) return router.replace("/admin/login");
      if (!res.ok) throw new Error();
      setSelected(new Set());
      setConfirming(null);
      router.refresh();
    } catch {
      setError("Не удалось выполнить действие. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  const confirmText: Record<Action, string> = {
    trash: `Переместить ${count} ${plural(count)} в корзину? Их можно будет восстановить.`,
    restore: `Восстановить ${count} ${plural(count)}?`,
    delete: `Удалить ${count} ${plural(count)} навсегда? Это действие нельзя отменить.`,
  };

  const Checkbox = ({ id }: { id: string }) => (
    <input
      type="checkbox"
      className="size-5 cursor-pointer accent-velvet"
      checked={selected.has(id)}
      onChange={() => toggle(id)}
      aria-label={`Выбрать заявку №${rows.find((r) => r.id === id)?.number}`}
    />
  );

  return (
    <div className="space-y-3">
      {/* Панель действий: видна, когда что-то выбрано */}
      <div
        className={cn(
          "sticky top-2 z-10 flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 transition-colors",
          count > 0 ? "bg-velvet text-paper shadow-lg" : "bg-white",
        )}
      >
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="size-5 accent-brass" checked={allSelected} onChange={toggleAll} />
          {count > 0 ? `Выбрано: ${count}` : "Выбрать все на странице"}
        </label>

        {count > 0 && !confirming && (
          <div className="ml-auto flex flex-wrap gap-2">
            {mode === "active" ? (
              <button type="button" onClick={() => setConfirming("trash")} className="btn min-h-10 bg-paper px-4 text-velvet hover:bg-paper-2">
                <Trash2 aria-hidden className="size-4" /> В корзину
              </button>
            ) : (
              <>
                <button type="button" onClick={() => run("restore")} disabled={busy} className="btn min-h-10 bg-paper px-4 text-velvet hover:bg-paper-2">
                  <RotateCcw aria-hidden className="size-4" /> Восстановить
                </button>
                <button type="button" onClick={() => setConfirming("delete")} className="btn min-h-10 bg-danger px-4 text-white hover:bg-danger/90">
                  <Trash2 aria-hidden className="size-4" /> Удалить навсегда
                </button>
              </>
            )}
            <button type="button" onClick={() => setSelected(new Set())} className="btn min-h-10 px-3 text-paper/80 hover:text-paper">
              Снять выбор
            </button>
          </div>
        )}

        {count > 0 && confirming && (
          <div role="alertdialog" aria-label="Подтверждение" className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
            <span className="text-sm">{confirmText[confirming]}</span>
            <button
              type="button"
              onClick={() => run(confirming)}
              disabled={busy}
              autoFocus
              className={cn("btn min-h-10 px-4", confirming === "delete" ? "bg-danger text-white" : "bg-paper text-velvet")}
            >
              {busy ? "Выполняем…" : "Да"}
            </button>
            <button type="button" onClick={() => setConfirming(null)} className="btn min-h-10 px-3 text-paper/80 hover:text-paper">
              Отмена
            </button>
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {/* Таблица — на больших экранах */}
      <div className="hidden overflow-hidden rounded-2xl bg-white lg:block">
        <table className="w-full text-left text-[0.95rem]">
          <thead className="border-b border-line text-sm text-muted">
            <tr>
              <th className="w-12 px-5 py-3 font-normal">
                <span className="sr-only">Выбор</span>
              </th>
              <th className="px-3 py-3 font-normal">№</th>
              <th className="px-5 py-3 font-normal">Клиент</th>
              <th className="px-5 py-3 font-normal">Мероприятие</th>
              <th className="px-5 py-3 font-normal">Дата</th>
              <th className="px-5 py-3 font-normal">Город</th>
              <th className="px-5 py-3 font-normal">Статус</th>
              <th className="px-5 py-3 font-normal">{mode === "trash" ? "Удалена" : "Получена"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={cn("border-b border-line last:border-0 hover:bg-paper", selected.has(r.id) && "bg-brass/10")}>
                <td className="px-5 py-4">
                  <Checkbox id={r.id} />
                </td>
                <td className="px-3 py-4 text-muted tabular-nums">
                  <Link href={`/admin/bookings/${r.id}`} className="hover:text-ink">
                    {r.number}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/admin/bookings/${r.id}`} className="font-medium hover:underline">
                    {r.clientName}
                  </Link>
                  <span className="block text-sm text-muted">{r.phone}</span>
                </td>
                <td className="px-5 py-4">{EVENT_TYPE_BY_KEY[r.eventType]?.label}</td>
                <td className="px-5 py-4 whitespace-nowrap">{r.eventDate ?? "—"}</td>
                <td className="px-5 py-4">{r.city ?? "—"}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={r.status} />
                    {r.busy && <BusyBadge title={r.busy} />}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">{mode === "trash" ? r.deletedAt : r.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Карточки — на телефонах и планшетах */}
      <ul className="space-y-3 lg:hidden">
        {rows.map((r) => (
          <li key={r.id} className={cn("flex gap-3 rounded-2xl bg-white p-4", selected.has(r.id) && "ring-2 ring-brass")}>
            <div className="pt-1">
              <Checkbox id={r.id} />
            </div>
            <Link href={`/admin/bookings/${r.id}`} className="block min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{r.clientName}</p>
                  <p className="text-sm text-muted">
                    №{r.number}, {EVENT_TYPE_BY_KEY[r.eventType]?.label}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={r.status} />
                  {r.busy && <BusyBadge />}
                </div>
              </div>
              {r.busy && <p className="mt-3 text-sm text-danger">{r.busy}</p>}
              <p className="mt-3 text-sm text-muted">
                {[r.eventDate, r.city, r.guests ? `${r.guests} гостей` : null].filter(Boolean).join(", ") || "Детали в заявке"}
                {mode === "trash" && r.deletedAt ? `. Удалена ${r.deletedAt}` : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
