"use client";

import { Award, Briefcase, Cake, Heart, Mic, Sparkles, type LucideIcon } from "lucide-react";
import { EVENT_TYPES } from "@/lib/booking/event-types";
import type { EventTypeKey } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import { OPTION_MOTION } from "./question-field";

const ICONS: Record<EventTypeKey, LucideIcon> = {
  WEDDING: Heart,
  CONFERENCE: Mic,
  CORPORATE: Briefcase,
  BIRTHDAY: Cake,
  OFFICIAL: Award,
  OTHER: Sparkles,
};

export function EventTypeStep({
  value,
  hasAnswers,
  onSelect,
}: {
  value: EventTypeKey | null;
  hasAnswers: boolean;
  onSelect: (key: EventTypeKey) => void;
}) {
  return (
    <div>
      <div role="radiogroup" aria-label="Тип мероприятия" className="opt-group grid grid-cols-2 gap-3 md:grid-cols-3">
        {EVENT_TYPES.map((t) => {
          const Icon = ICONS[t.key];
          const selected = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(t.key)}
              className={cn(
                "flex min-h-36 flex-col justify-between gap-4 rounded-2xl border p-4 text-left md:min-h-44 md:p-5",
                OPTION_MOTION,
                selected ? "border-velvet bg-velvet text-paper" : "border-line bg-white hover:border-ink/40",
                // Выбран другой тип — эта карточка слегка тускнеет
                value && !selected && "opt-dim",
              )}
            >
              <Icon aria-hidden className={cn("size-6", selected ? "text-brass" : "text-brass-deep")} strokeWidth={1.5} />
              <span>
                <span className="block font-medium leading-snug md:text-lg">{t.label}</span>
                <span className={cn("mt-1 hidden text-sm sm:block", selected ? "text-paper/70" : "text-muted")}>{t.description}</span>
              </span>
            </button>
          );
        })}
      </div>
      {value && hasAnswers && (
        <p className="mt-5 text-sm text-muted">
          Если выбрать другой тип мероприятия, ответы на следующие вопросы будут сброшены — у каждого формата свои вопросы.
        </p>
      )}
    </div>
  );
}
