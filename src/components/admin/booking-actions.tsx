"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { BOOKING_STATUSES, type BookingStatusKey } from "@/lib/booking/event-types";

export function BookingActions({
  id,
  status,
  adminNote,
  deleted = false,
}: {
  id: string;
  status: BookingStatusKey;
  adminNote: string;
  /** Заявка в корзине */
  deleted?: boolean;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BookingStatusKey>(status);
  const [note, setNote] = useState(adminNote);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function patch(body: Record<string, string>, okText: string) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401) return router.replace("/admin/login");
      if (!res.ok) throw new Error();
      setMessage({ kind: "ok", text: okText });
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Не удалось сохранить. Попробуйте ещё раз." });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setDeleting(true);
    try {
      // Из обычного списка — в корзину; из корзины — навсегда
      const res = await fetch(`/api/admin/bookings/${id}${deleted ? "?permanent=1" : ""}`, { method: "DELETE" });
      if (res.status === 401) return router.replace("/admin/login");
      if (!res.ok) throw new Error();
      router.replace(deleted ? "/admin/trash" : "/admin");
      router.refresh();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
      setMessage({ kind: "error", text: "Не удалось удалить заявку." });
    }
  }

  async function restore() {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/bookings/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", ids: [id] }),
      });
      if (res.status === 401) return router.replace("/admin/login");
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: "Не удалось восстановить заявку." });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {deleted && (
        <section className="rounded-2xl border border-brass/40 bg-brass/10 p-6">
          <p className="font-medium">Заявка в корзине</p>
          <p className="mt-1 text-sm text-muted">Она не видна в списке заявок и в календаре.</p>
          <button type="button" onClick={restore} disabled={deleting} className="btn btn-primary mt-4 min-h-11">
            Восстановить
          </button>
        </section>
      )}
      <section className="rounded-2xl bg-white p-6">
        <h2 className="mb-4 font-medium">Обработка</h2>
        <label htmlFor="status" className="field-label">
          Статус заявки
        </label>
        <select
          id="status"
          className="field"
          value={currentStatus}
          disabled={saving}
          onChange={(e) => {
            const value = e.target.value as BookingStatusKey;
            setCurrentStatus(value);
            void patch({ status: value }, "Статус обновлён");
          }}
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        <label htmlFor="note" className="field-label mt-5">
          Заметка (видна только администратору)
        </label>
        <textarea id="note" className="field min-h-28" value={note} maxLength={5000} onChange={(e) => setNote(e.target.value)} />
        <button
          type="button"
          className="btn btn-outline mt-3 min-h-11"
          disabled={saving || note === adminNote}
          onClick={() => patch({ adminNote: note }, "Заметка сохранена")}
        >
          Сохранить заметку
        </button>

        <p aria-live="polite" className={message?.kind === "error" ? "field-error" : "mt-3 text-sm text-success"}>
          {message?.text}
        </p>
      </section>

      <section className="rounded-2xl border border-danger/20 bg-white p-6">
        {!confirmDelete ? (
          <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-danger hover:underline">
            <Trash2 aria-hidden className="size-4" />
            {deleted ? "Удалить навсегда" : "Переместить в корзину"}
          </button>
        ) : (
          <div role="alertdialog" aria-labelledby="del-title" aria-describedby="del-desc">
            <p id="del-title" className="font-medium">
              {deleted ? "Удалить заявку навсегда?" : "Переместить заявку в корзину?"}
            </p>
            <p id="del-desc" className="mt-1 text-sm text-muted">
              {deleted
                ? "Заявка и все ответы будут удалены без возможности восстановления."
                : "Её можно будет восстановить из раздела «Корзина»."}
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={remove} disabled={deleting} className="btn min-h-11 bg-danger text-white hover:bg-danger/90">
                {deleting ? "Выполняем…" : deleted ? "Да, удалить" : "Да, в корзину"}
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} autoFocus className="btn btn-outline min-h-11">
                Отмена
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
