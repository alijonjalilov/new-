"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function EmptyTrashButton({ count }: { count: number }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function empty() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/bookings/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "emptyTrash" }),
      });
      if (res.status === 401) return router.replace("/admin/login");
      if (!res.ok) throw new Error();
      setConfirm(false);
      router.refresh();
    } catch {
      setError("Не удалось очистить корзину.");
    } finally {
      setBusy(false);
    }
  }

  if (!confirm) {
    return (
      <button type="button" onClick={() => setConfirm(true)} className="btn btn-outline min-h-11 text-danger">
        <Trash2 aria-hidden className="size-4" /> Очистить корзину
      </button>
    );
  }
  return (
    <div role="alertdialog" aria-label="Очистить корзину" className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3">
      <span className="text-sm">Удалить навсегда все заявки в корзине ({count})? Это нельзя отменить.</span>
      <button type="button" onClick={empty} disabled={busy} autoFocus className="btn min-h-10 bg-danger px-4 text-white hover:bg-danger/90">
        {busy ? "Удаляем…" : "Да, удалить"}
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="btn btn-outline min-h-10 px-4">
        Отмена
      </button>
      {error && <span className="text-sm text-danger">{error}</span>}
    </div>
  );
}
