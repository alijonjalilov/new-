"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { StageTexts } from "@/components/stage/stage-home";
import { VENUE_ART } from "@/components/stage/venue-art";
import { STAGE_CSS } from "@/components/stage/stage-css";

/**
 * Главная в дизайне «Сцена с микрофоном».
 *
 * Страница никогда не прокручивается: экран один, микрофон всегда в центре.
 * Колесо, свайп, клавиши и кнопки меняют только «прогресс» T от 0 до 1,
 * а по нему вокруг микрофона появляются и исчезают сцены (см. таблицу в render()).
 * Все тексты всех сцен всегда лежат в странице — для поисковиков; невидимые слои просто прозрачные.
 */

export type StageData = {
  locale: Locale;
  preview: boolean;
  texts: StageTexts;
  hostName: string;
  parts: [string, string, string][];
  formats: { slot: string; title: string; text: string; side: number; photo: string | null; photoAlt: string }[];
  steps: { title: string; text: string }[];
  stats: { subtitle: string; items: { n: number; inf: boolean; label: string }[] };
  clients: { slug: string; name: string; alt: string; ratio: number; round: boolean }[];
  links: { home: string; whatsapp: string; telegram: string; booking: string; langs: { code: string; short: string; name: string; href: string }[] };
};

/* Детали разобранного микрофона: границы в процентах высоты exp.webp; i — номер подписи */
const PARTS: { a: number; b: number; label?: number }[] = [
  { a: 0, b: 19.5, label: 0 },
  { a: 19.5, b: 26.5, label: 1 },
  { a: 26.5, b: 34 },
  { a: 34, b: 44.5, label: 2 },
  { a: 44.5, b: 50.5, label: 3 },
  { a: 50.5, b: 58.4 },
  { a: 58.4, b: 93.5, label: 4 },
  { a: 93.5, b: 100 },
];

const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => cl((p - a) / (b - a));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const pad2 = (n: number) => String(n).padStart(2, "0");

/** Размер логотипа внутри кружка: «одинаковый» по площади, как в бегущих строках */
function logoBox(ratio: number, round: boolean) {
  if (round) return { width: "100%", height: "100%" };
  let w = Math.min(80, 52 * Math.sqrt(ratio));
  let h = w / ratio;
  if (h > 78) {
    h = 78;
    w = h * ratio;
  }
  return { width: `${w}%`, height: `${h}%` };
}

/** Кнопка-глобус: по нажатию раскрывается список из трёх языков */
function LangMenu({ langs, current, label }: { langs: StageData["links"]["langs"]; current: string; label: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("pointerdown", onDown);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("pointerdown", onDown);
      removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className="lang" ref={box}>
      <button type="button" className="globe" aria-label={label} aria-expanded={open} aria-controls="stage-langs" onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
      </button>
      {open && (
        <ul id="stage-langs" className="lang-list">
          {langs.map((l) => (
            <li key={l.code}>
              <a href={l.href} lang={l.code} aria-current={l.code === current ? "true" : undefined}>
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StageClient({ data }: { data: StageData }) {
  const root = useRef<HTMLDivElement>(null);
  const tx = data.texts;
  const F = data.formats;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const $ = <T extends Element = HTMLElement>(s: string) => el.querySelector(s) as T;
    const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(el.querySelectorAll(s)) as T[];

    // Страница не прокручивается: закрываем прокрутку на время показа «Сцены»
    const html = document.documentElement;
    html.classList.add("stage-lock");

    let T = 0;
    // Темп: вся страница ≈ 8 экранов прокрутки; один «щелчок» колеса заметно двигает сцену,
    // а резкий рывок колесом или тачпадом не перескакивает через несколько сцен
    const LEN = 8;
    const MAX_STEP = 110; // px за одно событие колеса
    const push = (d: number) => {
      T = cl(T + d);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 16;
      if (e.deltaMode === 2) d *= innerHeight;
      d = Math.max(-MAX_STEP, Math.min(MAX_STEP, d));
      push(d / (innerHeight * LEN));
    };
    let ty: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      ty = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (ty === null) return;
      const y = e.touches[0].clientY;
      push(((ty - y) * 1.6) / (innerHeight * LEN));
      ty = y;
      if (e.cancelable) e.preventDefault();
    };
    const onTouchEnd = () => {
      ty = null;
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const onControl = tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const k = e.key;
      if (k === "ArrowDown" || k === "PageDown" || (k === " " && !onControl)) {
        e.preventDefault();
        push(0.04);
      }
      if (k === "ArrowUp" || k === "PageUp") {
        e.preventDefault();
        push(-0.04);
      }
      if (k === "Home") T = 0;
      if (k === "End") T = 1;
    };
    // Фокус с клавиатуры на скрытом слое — переходим к его сцене, чтобы кнопку было видно
    const onFocus = (e: FocusEvent) => {
      const ly = (e.target as HTMLElement).closest<HTMLElement>(".ly");
      if (!ly) return;
      const a = +ly.dataset.a!;
      const b = +ly.dataset.b!;
      if (cur < a || cur > b) T = a === 0 ? 0 : b >= 1 ? 1 : (a + b) / 2;
    };

    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("touchend", onTouchEnd);
    addEventListener("keydown", onKey);
    el.addEventListener("focusin", onFocus);

    const upBtn = $("[data-up]");
    const downBtn = $("[data-down]");
    const onUp = () => push(-0.05);
    const onDown = () => push(0.05);
    upBtn.addEventListener("click", onUp);
    downBtn.addEventListener("click", onDown);
    const goers = $$<HTMLAnchorElement>("[data-go]");
    const onGo = (e: Event) => {
      e.preventDefault();
      T = +(e.currentTarget as HTMLElement).dataset.go!;
    };
    goers.forEach((a) => a.addEventListener("click", onGo));

    const mks = $$(".mk");
    const lys = $$(".ly");
    const labs = $$(".lab");
    const labTexts = $$(".lab-t");
    const pEls = $$(".part");
    const orbs = $$(".orb");
    const nums = $$("[data-n]");
    const infs = $$("[data-inf]");
    const bigs = $$(".nums .big");
    const sts = $$(".st");
    const venues = $$(".venue");
    const mic = $(".micbox");
    const asm = $(".asm");
    const fpanel = $(".F");
    const vwrap = $(".venues");
    const pct = $("[data-pct]");
    const pbar = $("[data-pbar]");
    const hudtxt = $("[data-hudtxt]");
    const fcount = $("[data-fcount]");
    const ftitle = $("[data-ftitle]");
    const ftext = $("[data-ftext]");

    let lastF = -1;
    let lastK = -1;
    let cur = 0;
    let raf = 0;
    // Кольцо логотипов: за сцену «Спасибо за доверие» делает ровно один оборот,
    // пока мышь на логотипе — стоит, потом плавно догоняет
    let phase = 0;

    let hovered: HTMLElement | null = null;
    const zoom = new Map<HTMLElement, number>(); // плавное увеличение логотипа под мышью
    const onOrbEnter = (e: Event) => {
      hovered = e.currentTarget as HTMLElement;
      hovered.classList.add("hot");
    };
    const onOrbLeave = (e: Event) => {
      (e.currentTarget as HTMLElement).classList.remove("hot");
      hovered = null;
    };

    function render(p: number) {
      const narrow = innerWidth < 760;
      const H = innerHeight;
      const W = innerWidth;
      pct.textContent = Math.round(p * 100) + " %";
      pbar.style.width = p * 100 + "%";
      hudtxt.textContent = p > 0.97 ? tx.hudEnd : tx.hudScroll;

      // Разборка микрофона: 0.12–0.20 раскрывается, 0.29–0.335 собирается
      const e = Math.min(seg(p, 0.12, 0.2), 1 - seg(p, 0.29, 0.335));
      // Микрофон не реагирует на прокрутку: стоит под углом и меняется только по сценам
      const ang = mix(-16, -3, ease(cl(e * 1.4)));
      const sc = mix(1 + seg(p, 0.91, 1) * 0.05, 0.86, e);

      // Форматы: микрофон уезжает вправо/влево вместе с площадкой
      const fpos = seg(p, 0.44, 0.68) * 5;
      const f = Math.min(4, Math.floor(fpos));
      const fr = fpos - f;
      // Микрофон никогда не «висит» посередине: на смене формата он гаснет на одной
      // стороне и появляется на другой (то же при входе и выходе из сцены форматов)
      const env = Math.min(seg(p, 0.43, 0.455), 1 - seg(p, 0.665, 0.69));
      const tr = f < 4 ? seg(fr, 0.7, 1) : 0;
      const shown = tr < 0.5 ? f : f + 1; // какой формат показан: меняется, когда микрофон невидим
      const side = tr < 0.5 ? F[f].side : F[f + 1].side;
      const fade = Math.min(Math.abs(1 - 2 * tr), Math.abs(1 - 2 * env));
      const dx = env < 0.5 ? 0 : side * W * 0.2;
      mic.style.opacity = String(fade);
      fpanel.style.setProperty("--cf", String(Math.abs(1 - 2 * tr)));
      // В «Спасибо за доверие» микрофон и кольцо поднимаются, чтобы текст их не закрывал
      const lv = Math.min(seg(p, 0.675, 0.7), 1 - seg(p, 0.76, 0.785));
      const lift = ease(lv) * (narrow ? 0 : -9);
      const cy = (narrow ? mix(20, 8, e) : 0) + lift;
      mic.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${cy}vh)) rotate(${ang}deg) scale(${sc})`;
      asm.style.opacity = String(1 - seg(e, 0, 0.3));
      const spread = mix(-0.32, 0.04, ease(e));
      pEls.forEach((pe, i) => {
        const c = (PARTS[i].a + PARTS[i].b) / 200;
        pe.style.opacity = String(seg(e, 0, 0.3));
        pe.style.transform = `translateY(${(c - 0.5) * spread * 100}%)`;
      });
      const showL = e > 0.95 && p < 0.32;
      // Точка и линия стоят напротив детали; если тексты подписей налезают друг на друга,
      // сдвигаем только текст (переменная --shift), чтобы всё читалось
      let prevBottom = -Infinity;
      labs.forEach((l, i) => {
        const on = showL && p > 0.19 + i * 0.02;
        l.classList.toggle("on", on);
        const r = mks[i].getBoundingClientRect();
        const y = Math.max(70, Math.min(H - 30, r.top));
        l.style.left = r.left + (narrow ? 12 : 40) + "px";
        l.style.top = y + "px";
        const h = labTexts[i].offsetHeight;
        const top = Math.max(y - h / 2, prevBottom + 8);
        l.style.setProperty("--shift", `${top - (y - h / 2)}px`);
        prevBottom = top + h;
      });

      // Текстовые слои: плавно появляются и исчезают на краях своего отрезка
      lys.forEach((ly) => {
        const a = +ly.dataset.a!;
        const b = +ly.dataset.b!;
        const d = +ly.dataset.d!;
        const fi = a <= 0 ? 1 : seg(p, a, a + 0.022);
        const fo = b >= 1 ? 1 : 1 - seg(p, b - 0.022, b);
        const v = Math.min(fi, fo);
        const out = p > (a + b) / 2 ? -1 : 1;
        const isT = ly.classList.contains("T");
        ly.style.opacity = String(v);
        ly.classList.toggle("live", v > 0.6);
        ly.style.transform = narrow
          ? `translateY(${(1 - v) * 30 * out}px)`
          : isT
            ? `translate(-50%,${(1 - v) * -30}px)`
            : `translate(${(1 - v) * 60 * d}px,-50%)`;
        ly.style.filter = v < 1 ? `blur(${(1 - v) * 8}px)` : "none";
      });

      // Цифры досчитываются от нуля
      const c = seg(p, 0.355, 0.41);
      nums.forEach((n) => (n.textContent = Math.round(+n.dataset.n! * c).toLocaleString("ru-RU")));
      infs.forEach((n) => {
        n.style.opacity = String(c);
        n.style.transform = `scale(${0.6 + 0.4 * c})`;
      });

      vwrap.style.opacity = String(env);
      if (shown !== lastF) {
        const f = shown;
        lastF = f;
        venues.forEach((x, i) => x.classList.toggle("on", i === f));
        fcount.textContent = `${pad2(f + 1)} / ${pad2(F.length)}`;
        ftitle.textContent = F[f].title;
        ftext.textContent = F[f].text;
        const mR = F[f].side > 0;
        fpanel.style.left = narrow ? "" : mR ? "max(5vw,16px)" : "calc(100% - max(5vw,16px) - min(420px,34vw))";
        venues[f].style.setProperty("--mx", mR ? "70%" : "30%");
        venues[f].style.setProperty("--dir", mR ? "90deg" : "270deg");
      }

      // «Спасибо за доверие»: одно кольцо логотипов вокруг микрофона
      // один полный оборот, пока сцена видна (0.695 → 0.765); в начале и в конце логотипы на своих местах
      const target = Math.PI * 2 * ease(seg(p, 0.695, 0.765));
      if (!hovered) phase += (target - phase) * 0.2;
      if (lv > 0) {
        const mr = mic.getBoundingClientRect();
        const oy = (mr.top + mr.bottom) / 2 - H / 2;
        const R = { rx: narrow ? W * 0.45 : Math.min(W * 0.42, 620), ry: narrow ? H * 0.17 : H * 0.15, y: narrow ? H * 0.06 : -H * 0.01 };
        const n = orbs.length;
        orbs.forEach((o, j) => {
          const t = Math.PI / 2 + (j / n) * Math.PI * 2 + phase;
          const s = Math.sin(t);
          const hot = o === hovered;
          const z = (zoom.get(o) ?? 1) + ((hot ? 1.45 : 1) - (zoom.get(o) ?? 1)) * 0.25;
          zoom.set(o, z);
          o.style.transform = `translate(${Math.cos(t) * R.rx}px,${oy + R.y + s * R.ry}px) scale(${(0.8 + s * 0.2) * z})`;
          o.style.opacity = String(hot ? 1 : lv * (s > 0 ? 1 : 0.3));
          o.style.zIndex = hot ? "9" : s > 0 ? "5" : "1";
          o.classList.toggle("live", lv > 0.6);
        });
      } else if (orbs[0]?.style.opacity !== "0") {
        orbs.forEach((o) => {
          o.style.opacity = "0";
          o.classList.remove("live", "hot");
        });
        hovered = null;
      }

      // Как мы работаем: большая цифра 1→4 и подсветка шагов
      const k = Math.min(3, Math.floor(seg(p, 0.78, 0.91) * 4));
      if (k !== lastK) {
        lastK = k;
        bigs.forEach((b, i) => b.classList.toggle("on", i === k));
        sts.forEach((s, i) => {
          s.classList.toggle("on", i <= k);
          s.classList.toggle("cur", i === k);
        });
      }
    }

    const onResize = () => {
      lastF = -1;
    };
    addEventListener("resize", onResize);

    orbs.forEach((o) => {
      o.addEventListener("pointerenter", onOrbEnter);
      o.addEventListener("pointerleave", onOrbLeave);
    });

    function tick() {
      cur = cur + (T - cur) * 0.07;
      if (Math.abs(T - cur) < 0.0003) cur = T;
      render(cur);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("stage-lock");
      removeEventListener("wheel", onWheel);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("touchend", onTouchEnd);
      removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
      el.removeEventListener("focusin", onFocus);
      upBtn.removeEventListener("click", onUp);
      downBtn.removeEventListener("click", onDown);
      goers.forEach((a) => a.removeEventListener("click", onGo));
      orbs.forEach((o) => {
        o.removeEventListener("pointerenter", onOrbEnter);
        o.removeEventListener("pointerleave", onOrbLeave);
      });
    };
  }, [F, tx.hudEnd, tx.hudScroll]);

  return (
    <div ref={root} className="stage-root" data-locale={data.locale}>
      <style>{STAGE_CSS}</style>
      <main id="main" className="stage">
        {/* Фон-площадки для сцены форматов */}
        <div className="venues" aria-hidden>
          {F.map((f) => (
            <div key={f.slot} className="venue">
              {f.photo ? (
                <Image src={f.photo} alt={f.photoAlt} fill sizes="100vw" className="object-cover" />
              ) : (
                <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={{ __html: VENUE_ART[f.slot] }} />
              )}
            </div>
          ))}
        </div>
        <div className="halo" />

        {/* Логотипы на двух орбитах */}
        <div className="orbit" aria-hidden>
          {data.clients.map((c) => (
            <span key={c.slug} className="orb">
              <span className="orb-c">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/clients/${c.slug}.png`} alt={c.alt} style={logoBox(c.ratio, c.round)} loading="lazy" decoding="async" />
              </span>
              <span className="orb-n">{c.name}</span>
            </span>
          ))}
        </div>

        {/* Микрофон: целый и разобранный */}
        <div className="micbox" role="img" aria-label={tx.mic}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="asm" src="/images/stage/mic.webp" alt={tx.micAlt} fetchPriority="high" />
          <div className="exp">
            {PARTS.map((p, i) => (
              <div key={i} className="part" style={{ clipPath: `inset(${p.a}% 0 ${100 - p.b}% 0)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/stage/exp.webp" alt="" />
                {p.label !== undefined && <i className="mk" style={{ left: "82%", top: `${(p.a + p.b) / 2}%` }} />}
              </div>
            ))}
          </div>
        </div>
        <div className="labs">
          {data.parts.map((l, i) => (
            <div key={i} className="lab">
              <div className="lab-t">
                <small>{l[0]}</small>
                <b>{l[1]}</b>
                <span>{l[2]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 0–0.10: имя */}
        <div className="ly L" data-a="0" data-b=".1" data-d="-1">
          <h1>
            <span className="kicker">{tx.kicker}</span>
            <span className="sr-only"> — </span>
            {data.hostName}
          </h1>
        </div>
        <div className="ly R" data-a="0" data-b=".1" data-d="1">
          <p>{tx.heroText}</p>
          <div className="row">
            <a className="sbtn" href={data.links.booking} data-go=".95">
              {tx.book}
            </a>
            <a className="sbtn ghost" href="#formats" data-go=".47">
              {tx.works}
            </a>
          </div>
        </div>

        {/* 0.10–0.34: больше, чем микрофон */}
        <div className="ly L" data-a=".1" data-b=".34" data-d="-1">
          <span className="kicker">{tx.partsKicker}</span>
          <h2>{tx.partsTitle}</h2>
          <p>{tx.partsText}</p>
        </div>

        {/* 0.34–0.44: цифры */}
        <div className="ly L" data-a=".34" data-b=".44" data-d="-1">
          <h2>{tx.statsTitle}</h2>
          <p>{data.stats.subtitle}</p>
        </div>
        <div className="ly R" data-a=".34" data-b=".44" data-d="1">
          {data.stats.items.map((s, i) => (
            <div key={i} className="stat">
              {s.inf ? (
                <div className="big inf" data-inf>
                  ∞
                </div>
              ) : (
                <div className="big" data-n={s.n}>
                  {s.n.toLocaleString("ru-RU")}
                </div>
              )}
              <small>{s.label}</small>
            </div>
          ))}
        </div>

        {/* 0.44–0.68: пять форматов */}
        <div id="formats" className="ly F" data-a=".44" data-b=".68" data-d="0">
          <span className="count" data-fcount>
            01 / {pad2(F.length)}
          </span>
          <h2 data-ftitle style={{ marginTop: 10 }}>
            {F[0].title}
          </h2>
          <p data-ftext>{F[0].text}</p>
          {/* Для поисковиков — все форматы списком */}
          <ul className="sr-only">
            {F.map((f) => (
              <li key={f.slot}>
                {f.title}: {f.text}
              </li>
            ))}
          </ul>
        </div>

        {/* 0.68–0.78: мне доверяют */}
        <div className="ly T" data-a=".68" data-b=".78" data-d="0">
          <h2>{tx.trustTitle}</h2>
          <p>{tx.trustText}</p>
          <p className="thanks">{tx.trustThanks}</p>
          <ul className="sr-only" aria-label={tx.clientsList}>
            {data.clients.map((c) => (
              <li key={c.slug}>{c.name}</li>
            ))}
          </ul>
        </div>

        {/* 0.78–0.91: как мы работаем */}
        <div className="ly L" data-a=".78" data-b=".91" data-d="-1">
          <span className="kicker">{tx.processKicker}</span>
          <div className="nums" aria-hidden>
            {data.steps.map((_, i) => (
              <div key={i} className="big">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <ol className="ly R" data-a=".78" data-b=".91" data-d="1">
          {data.steps.map((s) => (
            <li key={s.title} className="st">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        {/* 0.91–1: финал */}
        <div className="ly L" data-a=".91" data-b="1" data-d="-1">
          <h2 className="final">{tx.finalTitle}</h2>
          <p className="seo-note">{tx.seoNote}</p>
        </div>
        <div className="ly R" data-a=".91" data-b="1" data-d="1">
          <p>{tx.finalText}</p>
          <div className="row">
            <a className="sbtn" href={data.links.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a className="sbtn ghost" href={data.links.telegram} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
            <a className="sbtn ghost" href={data.links.booking}>
              {tx.finalForm}
            </a>
          </div>
        </div>
      </main>

      <nav className="snav">
        <a className="logo" href={data.links.home} data-go="0">
          ROVI.TJ
        </a>
        <div className="snav-r">
          <a className="globe" href="/admin" aria-label={tx.admin} title={tx.admin}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
              <path d="M10 16l4-4-4-4" />
              <path d="M14 12H4" />
            </svg>
          </a>
          <LangMenu langs={data.links.langs} current={data.locale} label={tx.languages} />
          <a className="sbtn" href={data.links.booking} data-go=".95">
            {tx.navBook}
          </a>
        </div>
      </nav>
      <div className="arrows">
        <button type="button" data-up aria-label={tx.back}>
          ↑
        </button>
        <button type="button" data-down aria-label={tx.next}>
          ↓
        </button>
      </div>
      <div className="hud" aria-hidden>
        <b data-pct>0 %</b>
        <span className="bar">
          <i data-pbar />
        </span>
        <span data-hudtxt>{tx.hudScroll}</span>
      </div>
      {data.preview && <p className="spreview">Предпросмотр — этот дизайн видите только вы</p>}
    </div>
  );
}
