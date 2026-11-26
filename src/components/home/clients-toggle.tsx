"use client";

import { useState } from "react";

/**
 * Шапка блока «С кем я работал» с кнопкой «Посмотреть все».
 * Нажатие показывает весь список логотипов сеткой вместо бегущих строк.
 */
export function ClientsToggle({
  title,
  lead,
  showLabel,
  hideLabel,
  marquee,
  grid,
  srList,
}: {
  title: string;
  lead: string;
  showLabel: string;
  hideLabel: string;
  marquee: React.ReactNode;
  grid: React.ReactNode;
  srList: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="container-site mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="clients-title" className="t-h2 max-w-3xl">
            {title}
          </h2>
          <p className="t-lead measure mt-4">{lead}</p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="clients-all"
          onClick={() => setOpen((v) => !v)}
          className="link-underline shrink-0 self-start md:self-auto"
        >
          {open ? hideLabel : showLabel}
        </button>
      </div>
      <div id="clients-all">{open ? grid : <>{srList}{marquee}</>}</div>
    </>
  );
}
