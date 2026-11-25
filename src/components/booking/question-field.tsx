"use client";

import { Check, Plus, X } from "lucide-react";
import { todayISO } from "@/lib/booking/engine";
import { otherKey, type Answers, type AnswerValue, type ChoiceQuestion, type ListQuestion, type Question } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/t";
import type { Locale } from "@/i18n/config";

interface Props {
  question: Question;
  answers: Answers;
  error: string | null;
  onChange: (id: string, value: AnswerValue) => void;
  /** Выбор одиночного варианта, после которого можно сразу идти дальше */
  onPicked: () => void;
  onEnter: () => void;
  locale: Locale;
}

const errorId = (id: string) => `q-${id}-error`;

/**
 * Карточки-варианты: при наведении мышью карточка чуть увеличивается,
 * остальные слегка тускнеют; после выбора тускнеют невыбранные.
 * Стили — классы .opt-group / .opt / .opt-dim в globals.css.
 */
export const OPTION_MOTION = "opt";

export function QuestionField({ question: q, answers, error, onChange, onPicked, onEnter, locale }: Props) {
  const value = answers[q.id];
  const describedBy = error ? errorId(q.id) : undefined;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  };

  let control: React.ReactNode;

  switch (q.type) {
    case "single":
    case "multi":
      control = (
        <Choice q={q} answers={answers} onChange={onChange} onPicked={onPicked} onEnter={onEnter} describedBy={describedBy} locale={locale} />
      );
      break;
    case "text":
      control = (
        <input
          id={`q-${q.id}`}
          type="text"
          className="field text-lg"
          value={typeof value === "string" ? value : ""}
          placeholder={q.placeholder}
          maxLength={q.maxLength ?? 200}
          autoComplete={q.autoComplete ?? "off"}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-labelledby="question-title"
          onChange={(e) => onChange(q.id, e.target.value)}
          onKeyDown={onKeyDown}
        />
      );
      break;
    case "textarea":
      control = (
        <textarea
          id={`q-${q.id}`}
          className="field min-h-36 resize-y text-lg"
          value={typeof value === "string" ? value : ""}
          placeholder={q.placeholder}
          maxLength={q.maxLength ?? 1000}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-labelledby="question-title"
          onChange={(e) => onChange(q.id, e.target.value)}
        />
      );
      break;
    case "number":
      control = (
        <div className="flex items-center gap-3">
          <input
            id={`q-${q.id}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="field max-w-56 text-lg tabular-nums"
            value={typeof value === "string" ? value : ""}
            placeholder={q.placeholder}
            maxLength={String(q.max).length}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            aria-labelledby="question-title"
            onChange={(e) => onChange(q.id, e.target.value.replace(/\D/g, ""))}
            onKeyDown={onKeyDown}
          />
          {q.suffix && <span className="text-lg text-muted">{q.suffix}</span>}
        </div>
      );
      break;
    case "consent":
      control = (
        <label
          htmlFor={`q-${q.id}`}
          className={cn(
            "flex cursor-pointer items-start gap-4 rounded-2xl border bg-white p-5 transition-colors",
            value === "yes" ? "border-velvet" : error ? "border-danger" : "border-line hover:border-ink/40",
          )}
        >
          <input
            id={`q-${q.id}`}
            type="checkbox"
            className="mt-0.5 size-6 shrink-0 accent-velvet"
            checked={value === "yes"}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            onChange={(e) => onChange(q.id, e.target.checked ? "yes" : "")}
          />
          <span className="text-lg leading-snug">{q.label}</span>
        </label>
      );
      break;
    case "list":
      control = <ListField q={q} answers={answers} onChange={onChange} describedBy={describedBy} locale={locale} />;
      break;
    case "date":
      control = (
        <input
          id={`q-${q.id}`}
          type="date"
          className="field max-w-xs text-lg"
          value={typeof value === "string" ? value : ""}
          min={todayISO()}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-labelledby="question-title"
          onChange={(e) => onChange(q.id, e.target.value)}
          onKeyDown={onKeyDown}
        />
      );
      break;
    case "time":
      control = (
        <input
          id={`q-${q.id}`}
          type="time"
          step={300}
          className="field max-w-48 text-lg"
          value={typeof value === "string" ? value : ""}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-labelledby="question-title"
          onChange={(e) => onChange(q.id, e.target.value)}
          onKeyDown={onKeyDown}
        />
      );
      break;
  }

  return (
    <div>
      {control}
      {error && (
        <p id={errorId(q.id)} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function Choice({
  q,
  answers,
  onChange,
  onPicked,
  onEnter,
  describedBy,
  locale,
}: {
  q: ChoiceQuestion;
  locale: Locale;
  answers: Answers;
  onChange: Props["onChange"];
  onPicked: () => void;
  onEnter: () => void;
  describedBy?: string;
}) {
  const multi = q.type === "multi";
  const raw = answers[q.id];
  const selected: string[] = multi ? (Array.isArray(raw) ? raw : []) : typeof raw === "string" && raw ? [raw] : [];
  const otherSelected = !!q.otherValue && selected.includes(q.otherValue);
  const otherVal = answers[otherKey(q.id)];
  const many = q.options.length > 4;

  const toggle = (v: string) => {
    if (multi) {
      onChange(q.id, selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    } else {
      onChange(q.id, v);
      if (v !== q.otherValue) onPicked();
    }
  };

  return (
    <div>
      <div
        role={multi ? "group" : "radiogroup"}
        aria-labelledby="question-title"
        aria-describedby={describedBy}
        className={cn("opt-group grid gap-2.5", many && "sm:grid-cols-2")}
      >
        {q.options.map((o) => {
          const isOn = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={isOn}
              onClick={() => toggle(o.value)}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left",
                OPTION_MOTION,
                isOn ? "border-velvet bg-velvet text-paper" : "border-line bg-white hover:border-ink/40",
                // Выбран другой вариант — этот слегка тускнеет
                selected.length > 0 && !isOn && !multi && "opt-dim",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center border transition-colors",
                  multi ? "rounded-md" : "rounded-full",
                  isOn ? "border-brass bg-brass text-velvet" : "border-ink/25",
                )}
              >
                {isOn && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="flex-1">
                <span className="block leading-snug">{o.label}</span>
                {o.hint && <span className={cn("block text-sm", isOn ? "text-paper/65" : "text-muted")}>{o.hint}</span>}
              </span>
            </button>
          );
        })}
      </div>

      {otherSelected && (
        <div className="mt-4">
          <label htmlFor={`q-${q.id}-other`} className="field-label">
            {t(locale, "Уточните, пожалуйста")}
          </label>
          <input
            id={`q-${q.id}-other`}
            type="text"
            className="field"
            autoFocus
            maxLength={300}
            placeholder={q.otherPlaceholder ?? t(locale, "Ваш вариант")}
            value={typeof otherVal === "string" ? otherVal : ""}
            onChange={(e) => onChange(otherKey(q.id), e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEnter();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

function ListField({
  q,
  answers,
  onChange,
  describedBy,
  locale,
}: {
  q: ListQuestion;
  locale: Locale;
  answers: Answers;
  onChange: Props["onChange"];
  describedBy?: string;
}) {
  const raw = answers[q.id];
  const stored = Array.isArray(raw) ? raw : [];
  const count = Math.min(Math.max(q.initialCount, stored.length), q.maxItems);
  const items = Array.from({ length: count }, (_, i) => stored[i] ?? "");

  return (
    <div className="space-y-2.5" role="group" aria-labelledby="question-title" aria-describedby={describedBy}>
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <label htmlFor={`q-${q.id}-${i}`} className="sr-only">
            {q.summaryLabel} {i + 1}
          </label>
          <input
            id={`q-${q.id}-${i}`}
            type="text"
            className="field"
            value={v}
            maxLength={100}
            placeholder={`${q.placeholder ?? ""}${q.placeholder ? " " : ""}${i + 1}`}
            onChange={(e) => onChange(q.id, items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          {i >= q.initialCount && (
            <button
              type="button"
              onClick={() => onChange(q.id, items.filter((_, j) => j !== i))}
              className="inline-flex size-[3.25rem] shrink-0 items-center justify-center rounded-[0.875rem] border border-line text-muted hover:text-ink"
              aria-label={t(locale, "Убрать поле {n}", { n: i + 1 })}
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>
      ))}
      {count < q.maxItems && (
        <button
          type="button"
          onClick={() => onChange(q.id, [...items, ""])}
          className="inline-flex items-center gap-2 rounded-full py-1 text-[0.95rem] text-brass-deep hover:text-ink"
        >
          <Plus aria-hidden className="size-4" />
          {q.addLabel}
        </button>
      )}
    </div>
  );
}
