"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { LoaderCircle, Plus, X } from "lucide-react";
import { contactSchema, makeContactSchema, MAX_EXTRA_PHONES, type ContactInput } from "@/lib/booking/validation";
import { t } from "@/i18n/t";
import type { Locale } from "@/i18n/config";

export const CONTACT_FORM_ID = "booking-contact-form";

export function ContactStep({
  defaultValues,
  submitting,
  serverError,
  onSubmit,
  onDraftChange,
  locale,
}: {
  locale: Locale;
  defaultValues?: Partial<ContactInput>;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (data: ContactInput) => void;
  /** Сохраняет введённое, чтобы данные не терялись при переходе назад */
  onDraftChange: (data: Partial<ContactInput>) => void;
}) {
  const tr = (s: string, v?: Record<string, string | number>) => t(locale, s, v);
  const schema = useMemo(() => makeContactSchema(locale), [locale]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<z.input<typeof contactSchema>, unknown, ContactInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      extraPhones: [],
      sameWhatsapp: true,
      whatsapp: "",
      comment: "",
      website: "",
      ...defaultValues,
      // Старые черновики могли не содержать доп. номеров
      ...(Array.isArray(defaultValues?.extraPhones) ? {} : { extraPhones: [] }),
    },
    mode: "onTouched",
  });

  const sameWhatsapp = watch("sameWhatsapp");
  const extraPhones = watch("extraPhones") ?? [];

  useEffect(() => {
    const sub = watch((values) => onDraftChange(values as Partial<ContactInput>));
    return () => sub.unsubscribe();
  }, [watch, onDraftChange]);

  const setExtra = (next: string[]) => setValue("extraPhones", next, { shouldDirty: true, shouldValidate: isSubmitted });

  return (
    <form id={CONTACT_FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="c-name" className="field-label">
          {tr("Имя и фамилия")}
        </label>
        <input
          id="c-name"
          className="field"
          autoComplete="name"
          aria-required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "c-name-err" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="c-name-err" className="field-error">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="c-phone" className="field-label">
          {tr("Номер телефона")}
        </label>
        <input
          id="c-phone"
          type="tel"
          inputMode="tel"
          className="field"
          autoComplete="tel"
          placeholder="+992 XX XXX XX XX"
          aria-required
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "c-phone-err" : undefined}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="c-phone-err" className="field-error">
            {errors.phone.message}
          </p>
        )}

        {extraPhones.map((value, i) => {
          const err = errors.extraPhones?.[i]?.message;
          return (
            <div key={i} className="mt-3">
              <label htmlFor={`c-phone-${i}`} className="sr-only">
                {tr("Дополнительный номер {n}", { n: i + 1 })}
              </label>
              <div className="flex gap-2">
                <input
                  id={`c-phone-${i}`}
                  type="tel"
                  inputMode="tel"
                  className="field"
                  placeholder={tr("Дополнительный номер")}
                  value={value}
                  aria-invalid={!!err}
                  onChange={(e) => setExtra(extraPhones.map((p, j) => (j === i ? e.target.value : p)))}
                />
                <button
                  type="button"
                  onClick={() => setExtra(extraPhones.filter((_, j) => j !== i))}
                  className="inline-flex size-[3.25rem] shrink-0 items-center justify-center rounded-[0.875rem] border border-line text-muted hover:text-ink"
                  aria-label={tr("Убрать дополнительный номер {n}", { n: i + 1 })}
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
              {err && <p className="field-error">{err}</p>}
            </div>
          );
        })}

        {extraPhones.length < MAX_EXTRA_PHONES && (
          <button
            type="button"
            onClick={() => setExtra([...extraPhones, ""])}
            className="mt-3 inline-flex items-center gap-2 rounded-full py-1 text-[0.95rem] text-brass-deep hover:text-ink"
          >
            <Plus aria-hidden className="size-4" />
            {tr("Добавить ещё один номер")}
          </button>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-center gap-3 py-1">
          <input type="checkbox" className="size-5 accent-velvet" {...register("sameWhatsapp")} />
          <span>{tr("WhatsApp на основном номере")}</span>
        </label>
        {!sameWhatsapp && (
          <div className="mt-3">
            <label htmlFor="c-wa" className="field-label">
              {tr("Номер WhatsApp")}
            </label>
            <input
              id="c-wa"
              type="tel"
              inputMode="tel"
              className="field"
              placeholder="+992 XX XXX XX XX"
              aria-invalid={!!errors.whatsapp}
              aria-describedby={errors.whatsapp ? "c-wa-err" : undefined}
              {...register("whatsapp")}
            />
            {errors.whatsapp && (
              <p id="c-wa-err" className="field-error">
                {errors.whatsapp.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="c-comment" className="field-label">
          {tr("Дополнительный комментарий")} <span className="font-normal text-muted">({tr("необязательно")})</span>
        </label>
        <textarea
          id="c-comment"
          className="field min-h-28 resize-y"
          placeholder={tr("Всё, что важно знать заранее")}
          maxLength={2000}
          aria-invalid={!!errors.comment}
          {...register("comment")}
        />
        {errors.comment && <p className="field-error">{errors.comment.message}</p>}
      </div>

      {/* Ловушка для ботов — скрыта от людей и скринридеров */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c-website">Сайт</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {serverError && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-danger">
          {serverError}
        </p>
      )}

      <p className="text-sm text-muted">
        {tr("Нажимая «Отправить заявку», вы соглашаетесь, что мы свяжемся с вами по указанным номерам для обсуждения мероприятия.")}
      </p>

      {submitting && (
        <p className="flex items-center gap-2 text-muted" aria-live="polite">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> {tr("Отправляем заявку…")}
        </p>
      )}
    </form>
  );
}
