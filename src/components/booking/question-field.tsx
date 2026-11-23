"use client";

import { Check } from "lucide-react";
import { todayISO } from "@/lib/booking/engine";
import { otherKey, type Answers, type AnswerValue, type ChoiceQuestion, type Question } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  answers: Answers;
  error: string | null;
  onChange: (id: string, value: AnswerValue) => void;
  /** Выбор одиночного варианта, после которого можно сразу идти дальше */
  onPicked: () => void;
  onEnter: () => void;
}

const errorId = (id: string) => `q-${id}-error`;

export function QuestionField({ question: q, answers, error, onChange, onPicked, onEnter }: Props) {
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
      control = <Choice q={q} answers={answers} onChange={onChange} onPicked={onPicked} onEnter={onEnter} describedBy={describedBy} />;
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
        <input
          id={`q-${q.id}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="field max-w-48 text-lg"
          value={typeof value === "string" ? value : ""}
          placeholder={q.placeholder}
          maxLength={3}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-labelledby="question-title"
          onChange={(e) => onChange(q.id, e.target.value.replace(/\D/g, ""))}
          onKeyDown={onKeyDown}
        />
      );
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
}: {
  q: ChoiceQuestion;
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
        className={cn("grid gap-2.5", many && "sm:grid-cols-2")}
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
                "flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                isOn ? "border-velvet bg-velvet text-paper" : "border-line bg-white hover:border-ink/40",
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
            Уточните, пожалуйста
          </label>
          <input
            id={`q-${q.id}-other`}
            type="text"
            className="field"
            autoFocus
            maxLength={300}
            placeholder={q.otherPlaceholder ?? "Ваш вариант"}
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
