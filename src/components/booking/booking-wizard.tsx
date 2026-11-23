"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, LoaderCircle, X } from "lucide-react";
import {
  buildSummary,
  getVisibleQuestions,
  isEmptyAnswer,
  pruneAnswers,
  validateAllAnswers,
  validateAnswer,
} from "@/lib/booking/engine";
import { EVENT_TYPE_BY_KEY } from "@/lib/booking/event-types";
import type { Answers, AnswerValue, EventTypeKey, Question } from "@/lib/booking/types";
import type { ContactInput } from "@/lib/booking/validation";
import { site } from "@/content/site";
import { EventTypeStep } from "./event-type-step";
import { QuestionField } from "./question-field";
import { SummaryStep } from "./summary-step";
import { CONTACT_FORM_ID, ContactStep } from "./contact-step";

type StepKey = "type" | "summary" | "contact" | `q:${string}`;

const DRAFT_KEY = "booking-draft-v1";

interface Draft {
  eventType: EventTypeKey | null;
  answers: Answers;
  current: StepKey;
  contact?: Partial<ContactInput>;
  savedAt: number;
}

function readDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    // Черновики старше 14 дней не восстанавливаем
    if (!d || Date.now() - d.savedAt > 14 * 24 * 3600 * 1000) return null;
    return d;
  } catch {
    return null;
  }
}
function writeDraft(d: Draft | null) {
  try {
    if (d) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* хранилище недоступно — просто работаем без черновика */
  }
}

/** Первый вопрос с некорректным ответом (или null, если всё заполнено). */
function firstInvalid(type: EventTypeKey, a: Answers): StepKey | null {
  const errs = validateAllAnswers(type, a);
  const q = getVisibleQuestions(type, a).find((x) => errs[x.id]);
  return q ? `q:${q.id}` : null;
}

export function BookingWizard({ initialType }: { initialType: EventTypeKey | null }) {
  const reduceMotion = useReducedMotion();
  const [eventType, setEventType] = useState<EventTypeKey | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [current, setCurrent] = useState<StepKey>("type");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [error, setError] = useState<string | null>(null);
  const [returnToSummary, setReturnToSummary] = useState(false);
  const [contactDraft, setContactDraft] = useState<Partial<ContactInput>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [bookingNumber, setBookingNumber] = useState<number | null>(null);
  const [restored, setRestored] = useState(false);
  const [ready, setReady] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── производные данные ── */
  const visible: Question[] = eventType ? getVisibleQuestions(eventType, answers) : [];
  const steps: StepKey[] = ["type", ...visible.map((q) => `q:${q.id}` as StepKey), ...(eventType ? (["summary", "contact"] as StepKey[]) : [])];
  const safeCurrent: StepKey = steps.includes(current) ? current : "type";
  const idx = steps.indexOf(safeCurrent);
  const question = safeCurrent.startsWith("q:") ? visible.find((q) => `q:${q.id}` === safeCurrent) ?? null : null;

  // Актуальное состояние для отложенных действий (автопереход после выбора)
  const latest = useRef({ eventType, answers, current: safeCurrent, steps, visible, returnToSummary });
  latest.current = { eventType, answers, current: safeCurrent, steps, visible, returnToSummary };

  /* ── восстановление черновика ── */
  useEffect(() => {
    const draft = readDraft();
    if (initialType && (!draft || draft.eventType !== initialType)) {
      setEventType(initialType);
      const first = getVisibleQuestions(initialType, {})[0];
      setCurrent(first ? `q:${first.id}` : "type");
    } else if (draft?.eventType) {
      const pruned = pruneAnswers(draft.eventType, draft.answers ?? {});
      setEventType(draft.eventType);
      setAnswers(pruned);
      setCurrent(draft.current ?? "type");
      setContactDraft(draft.contact ?? {});
      setRestored(Object.keys(pruned).length > 0);
    }
    setReady(true);
  }, [initialType]);

  /* ── сохранение черновика ── */
  useEffect(() => {
    if (!ready || status === "success") return;
    if (!eventType) return writeDraft(null);
    writeDraft({ eventType, answers, current: safeCurrent, contact: { ...contactDraft, website: "" }, savedAt: Date.now() });
  }, [ready, status, eventType, answers, safeCurrent, contactDraft]);

  /* ── фокус и прокрутка при смене шага ── */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [safeCurrent, status === "success", reduceMotion]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  /* ── навигация ── */
  const goTo = useCallback((key: StepKey, dir: 1 | -1) => {
    setDirection(dir);
    setError(null);
    setServerError(null);
    setCurrent(key);
  }, []);

  const next = useCallback(() => {
    const s = latest.current;
    const i = s.steps.indexOf(s.current);

    if (s.current === "type") {
      if (!s.eventType) return setError("Выберите тип мероприятия");
      if (s.returnToSummary && !firstInvalid(s.eventType, s.answers)) {
        setReturnToSummary(false);
        return goTo("summary", 1);
      }
      return goTo(s.steps[1], 1);
    }

    if (s.current.startsWith("q:")) {
      const q = s.visible.find((x) => `q:${x.id}` === s.current);
      if (!q || !s.eventType) return;
      const err = validateAnswer(q, s.answers);
      if (err) return setError(err);
      if (s.returnToSummary) {
        const invalid = firstInvalid(s.eventType, s.answers);
        if (invalid && invalid !== s.current) return goTo(invalid, 1);
        setReturnToSummary(false);
        return goTo("summary", 1);
      }
      return goTo(s.steps[i + 1], 1);
    }

    if (s.current === "summary" && s.eventType) {
      const invalid = firstInvalid(s.eventType, s.answers);
      if (invalid) {
        setReturnToSummary(true);
        return goTo(invalid, -1);
      }
      return goTo("contact", 1);
    }
  }, [goTo]);

  const back = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (returnToSummary) {
      setReturnToSummary(false);
      return goTo("summary", -1);
    }
    if (idx > 0) goTo(steps[idx - 1], -1);
  };

  const selectType = (key: EventTypeKey) => {
    if (key !== eventType) {
      // Смена типа — у нового сценария свои вопросы, старые ответы сбрасываем
      setAnswers({});
      setReturnToSummary(false);
      setRestored(false);
    }
    setEventType(key);
    setError(null);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(next, 220);
  };

  const setAnswer = (id: string, value: AnswerValue) => {
    if (!eventType) return;
    setError(null);
    setAnswers((prev) => pruneAnswers(eventType, { ...prev, [id]: value }));
  };

  const onPicked = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(next, 260);
  };

  const skip = () => {
    if (!question) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[question.id];
      return eventType ? pruneAnswers(eventType, copy) : copy;
    });
    setError(null);
    // ответ пустой и вопрос необязательный — next() пропустит его
    setTimeout(next, 0);
  };

  const editFromSummary = (id: string) => {
    setReturnToSummary(true);
    goTo(`q:${id}`, -1);
  };

  const startOver = () => {
    writeDraft(null);
    setEventType(null);
    setAnswers({});
    setContactDraft({});
    setRestored(false);
    setReturnToSummary(false);
    goTo("type", -1);
  };

  /* ── отправка ── */
  const submit = async (contact: ContactInput) => {
    if (!eventType) return;
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, answers: pruneAnswers(eventType, answers), contact }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        number?: number;
        message?: string;
        fieldErrors?: Record<string, string>;
      };
      if (res.ok && data.ok) {
        writeDraft(null);
        setBookingNumber(data.number ?? null);
        setStatus("success");
        return;
      }
      setStatus("idle");
      const answerErr = Object.entries(data.fieldErrors ?? {}).find(([k]) => k.startsWith("answers."));
      if (answerErr) {
        setReturnToSummary(true);
        goTo(`q:${answerErr[0].slice("answers.".length)}`, -1);
        setError(answerErr[1]);
        return;
      }
      setServerError(data.message ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
    } catch {
      setStatus("idle");
      setServerError("Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз.");
    }
  };

  /* ── экран успеха ── */
  if (status === "success") {
    return (
      <Shell progress={1}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="py-10 md:py-16"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-velvet text-brass">
            <Check aria-hidden className="size-8" strokeWidth={2} />
          </span>
          <h1 ref={headingRef} tabIndex={-1} className="t-h1 mt-8 outline-none">
            Спасибо! Ваша заявка успешно отправлена
          </h1>
          <p className="t-lead mt-5">
            Мы свяжемся с вами для обсуждения деталей.
            {bookingNumber ? ` Номер заявки: №${bookingNumber}.` : ""}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              На главную
            </Link>
            <Link href="/portfolio" className="btn btn-outline">
              Посмотреть работы
            </Link>
          </div>
        </motion.div>
      </Shell>
    );
  }

  /* ── заголовок шага ── */
  let title = "";
  let description: string | undefined;
  if (safeCurrent === "type") {
    title = "Какое мероприятие вы планируете?";
    description = "Выберите формат — следующие вопросы подстроятся под него.";
  } else if (question) {
    title = question.title;
    description = question.description;
  } else if (safeCurrent === "summary") {
    title = "Ваша заявка почти готова!";
    description = "Проверьте ответы. Любой пункт можно изменить.";
  } else if (safeCurrent === "contact") {
    title = "Как с вами связаться?";
    description = "Оставьте контакты — я перезвоню или напишу, чтобы обсудить детали.";
  }

  const progress = steps.length > 1 ? idx / (steps.length - 1) : 0;
  const canSkip = !!question?.optional && isEmptyAnswer(question, answers);

  const variants = {
    enter: (d: number) => (reduceMotion ? { opacity: 0 } : { opacity: 0, x: d * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduceMotion ? { opacity: 0 } : { opacity: 0, x: d * -32 }),
  };

  return (
    <Shell progress={progress} stepLabel={eventType ? `Шаг ${idx + 1} из ${steps.length}` : undefined}>
      {restored && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper-2 px-4 py-3 text-sm">
          <span>Мы сохранили ваши ответы с прошлого раза.</span>
          <button type="button" onClick={startOver} className="link-underline">
            Начать заново
          </button>
        </div>
      )}

      {!ready ? (
        <div className="flex justify-center py-24 text-muted">
          <LoaderCircle aria-label="Загрузка" className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="pb-10">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={safeCurrent}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {eventType && safeCurrent !== "type" && (
              <p className="mb-3 text-sm text-brass-deep">{EVENT_TYPE_BY_KEY[eventType].label}</p>
            )}
            <h1 id="question-title" ref={headingRef} tabIndex={-1} className="font-display text-[1.65rem] leading-tight font-light tracking-tight outline-none md:text-4xl">
              {title}
              {question?.optional && <span className="sr-only"> (необязательно)</span>}
            </h1>
            {description && <p className="mt-3 text-muted md:text-lg">{description}</p>}

            <div className="mt-8 md:mt-10">
              {safeCurrent === "type" && (
                <>
                  <EventTypeStep value={eventType} hasAnswers={Object.keys(answers).length > 0} onSelect={selectType} />
                  {error && (
                    <p role="alert" className="field-error">
                      {error}
                    </p>
                  )}
                </>
              )}
              {question && (
                <QuestionField
                  key={question.id}
                  question={question}
                  answers={answers}
                  error={error}
                  onChange={setAnswer}
                  onPicked={onPicked}
                  onEnter={next}
                />
              )}
              {safeCurrent === "summary" && eventType && (
                <SummaryStep
                  eventLabel={EVENT_TYPE_BY_KEY[eventType].label}
                  items={buildSummary(eventType, answers)}
                  onEdit={editFromSummary}
                  onEditType={() => {
                    setReturnToSummary(true);
                    goTo("type", -1);
                  }}
                />
              )}
              {safeCurrent === "contact" && (
                <ContactStep
                  defaultValues={contactDraft}
                  submitting={status === "submitting"}
                  serverError={serverError}
                  onSubmit={submit}
                  onDraftChange={setContactDraft}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      )}

      {/* Нижняя панель: на телефоне закреплена у края экрана — под большим пальцем */}
      <div className="sticky bottom-0 z-10 -mx-5 mt-auto border-t border-line bg-paper/95 px-5 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <div className="flex items-center gap-3">
          {idx > 0 && (
            <button type="button" onClick={back} className="btn btn-outline min-h-12 px-4 md:px-6" aria-label="Назад">
              <ArrowLeft aria-hidden className="size-4" />
              <span className="hidden sm:inline">Назад</span>
            </button>
          )}
          <div className="flex-1" />
          {canSkip && (
            <button type="button" onClick={skip} className="btn min-h-12 px-4 text-muted hover:text-ink">
              Пропустить
            </button>
          )}
          {safeCurrent === "contact" ? (
            <button type="submit" form={CONTACT_FORM_ID} className="btn btn-primary min-h-12" disabled={status === "submitting"}>
              {status === "submitting" ? "Отправляем…" : "Отправить заявку"}
            </button>
          ) : (
            <button type="button" onClick={next} className="btn btn-primary min-h-12" disabled={!ready}>
              {safeCurrent === "summary" ? "Всё верно, дальше" : returnToSummary && question ? "Сохранить" : "Продолжить"}
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}

/** Каркас страницы бронирования: логотип, прогресс, кнопка закрытия. */
function Shell({ children, progress, stepLabel }: { children: React.ReactNode; progress: number; stepLabel?: string }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-5">
          <Link href="/" className="font-display text-base tracking-tight">
            {site.hostName}
          </Link>
          <div className="flex items-center gap-4">
            {stepLabel && <span className="text-sm text-muted tabular-nums">{stepLabel}</span>}
            <Link href="/" aria-label="Закрыть и вернуться на сайт" className="-mr-2 inline-flex size-10 items-center justify-center rounded-full hover:bg-paper-2">
              <X aria-hidden className="size-5" />
            </Link>
          </div>
        </div>
        <div
          className="h-0.5 bg-line"
          role="progressbar"
          aria-label="Прогресс заполнения"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className="h-full bg-brass-deep transition-[width] duration-500 ease-out" style={{ width: `${Math.max(progress, 0.02) * 100}%` }} />
        </div>
      </header>
      <main id="main" className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-8 pb-0 md:pt-14 md:pb-16">
        {children}
      </main>
    </div>
  );
}
