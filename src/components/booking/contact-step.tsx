"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/booking/validation";

export const CONTACT_FORM_ID = "booking-contact-form";

export function ContactStep({
  defaultValues,
  submitting,
  serverError,
  onSubmit,
  onDraftChange,
}: {
  defaultValues?: Partial<ContactInput>;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (data: ContactInput) => void;
  /** Сохраняет введённое, чтобы данные не терялись при переходе назад */
  onDraftChange: (data: Partial<ContactInput>) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof contactSchema>, unknown, ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      sameWhatsapp: true,
      whatsapp: "",
      email: "",
      comment: "",
      website: "",
      ...defaultValues,
    },
    mode: "onTouched",
  });

  const sameWhatsapp = watch("sameWhatsapp");

  useEffect(() => {
    const sub = watch((values) => onDraftChange(values as Partial<ContactInput>));
    return () => sub.unsubscribe();
  }, [watch, onDraftChange]);

  return (
    <form id={CONTACT_FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="c-name" className="field-label">
          Имя и фамилия
        </label>
        <input
          id="c-name"
          className="field"
          autoComplete="name"
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
          Номер телефона
        </label>
        <input
          id="c-phone"
          type="tel"
          inputMode="tel"
          className="field"
          autoComplete="tel"
          placeholder="+992 XX XXX XX XX"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "c-phone-err" : undefined}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="c-phone-err" className="field-error">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-center gap-3 py-1">
          <input type="checkbox" className="size-5 accent-velvet" {...register("sameWhatsapp")} />
          <span>WhatsApp на этом же номере</span>
        </label>
        {!sameWhatsapp && (
          <div className="mt-3">
            <label htmlFor="c-wa" className="field-label">
              Номер WhatsApp
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
        <label htmlFor="c-email" className="field-label">
          Электронная почта <span className="font-normal text-muted">(необязательно)</span>
        </label>
        <input
          id="c-email"
          type="email"
          inputMode="email"
          className="field"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "c-email-err" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="c-email-err" className="field-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="c-comment" className="field-label">
          Дополнительный комментарий <span className="font-normal text-muted">(необязательно)</span>
        </label>
        <textarea
          id="c-comment"
          className="field min-h-28 resize-y"
          placeholder="Всё, что важно знать заранее"
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
        Нажимая «Отправить заявку», вы соглашаетесь, что мы свяжемся с вами по указанным контактам для обсуждения мероприятия.
      </p>

      {submitting && (
        <p className="flex items-center gap-2 text-muted" aria-live="polite">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Отправляем заявку…
        </p>
      )}
    </form>
  );
}
