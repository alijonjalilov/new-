"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Кнопка «Закрыть сайт / Открыть сайт» в шапке админ-панели. */
export function SiteSwitch({ closed }: { closed: boolean }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function apply(next: boolean) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/site", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ closed: next }),
    }).catch(() => null);
    setBusy(false);
    setConfirming(false);
    if (!res?.ok) {
      setError("Не получилось. Попробуйте ещё раз.");
      return;
    }
    router.refresh();
  }

  if (closed) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-danger">
          <span aria-hidden className="size-2 rounded-full bg-danger" />
          Сайт закрыт
        </span>
        <button type="button" disabled={busy} onClick={() => apply(false)} className="rounded-full bg-ink px-4 py-1.5 font-medium text-paper hover:bg-velvet-2">
          {busy ? "Открываю…" : "Открыть сайт"}
        </button>
        {error && <span role="alert" className="text-danger">{error}</span>}
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2" role="group" aria-label="Подтверждение">
        <span className="text-ink">
          <span className="hidden md:inline">Закрыть сайт для всех посетителей?</span>
          <span className="md:hidden">Закрыть сайт?</span>
        </span>
        <button type="button" disabled={busy} onClick={() => apply(true)} className="rounded-full bg-danger px-4 py-1.5 font-medium text-white">
          {busy ? "Закрываю…" : "Да, закрыть"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="rounded-full px-3 py-1.5 hover:bg-paper-2">
          Отмена
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 text-success sm:inline-flex">
        <span aria-hidden className="size-2 rounded-full bg-success" />
        Сайт работает
      </span>
      <button type="button" onClick={() => setConfirming(true)} className="rounded-full border border-line px-3 py-1.5 hover:bg-paper-2">
        Закрыть сайт
      </button>
      {error && <span role="alert" className="text-danger">{error}</span>}
    </div>
  );
}
