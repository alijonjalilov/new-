import type { EventTypeKey } from "./types";

export interface EventTypeMeta {
  key: EventTypeKey;
  /** Значение для URL: /booking?type=wedding */
  slug: string;
  label: string;
  /** Короткая подпись для статистики */
  short: string;
  description: string;
}

export const EVENT_TYPES: EventTypeMeta[] = [
  {
    key: "WEDDING",
    slug: "wedding",
    label: "Свадьба",
    short: "Свадьбы",
    description: "Торжество, в котором важна каждая минута",
  },
  {
    key: "CONFERENCE",
    slug: "conference",
    label: "Конференция / Форум",
    short: "Конференции",
    description: "Деловая программа, спикеры, модерация",
  },
  {
    key: "CORPORATE",
    slug: "corporate",
    label: "Корпоратив",
    short: "Корпоративы",
    description: "Праздник команды и компании",
  },
  {
    key: "BIRTHDAY",
    slug: "birthday",
    label: "День рождения / Юбилей",
    short: "Дни рождения",
    description: "Тёплый праздник для близких",
  },
  {
    key: "OFFICIAL",
    slug: "official",
    label: "Презентация / Официальное мероприятие",
    short: "Официальные",
    description: "Церемонии, открытия, протокол",
  },
  {
    key: "OTHER",
    slug: "other",
    label: "Другое",
    short: "Другое",
    description: "Расскажите о вашем формате",
  },
];

export const EVENT_TYPE_BY_KEY = Object.fromEntries(EVENT_TYPES.map((e) => [e.key, e])) as Record<
  EventTypeKey,
  EventTypeMeta
>;

export function eventTypeFromSlug(slug: string | null | undefined): EventTypeKey | null {
  if (!slug) return null;
  return EVENT_TYPES.find((e) => e.slug === slug)?.key ?? null;
}

export const BOOKING_STATUSES = [
  { key: "NEW", label: "Новая" },
  { key: "IN_PROGRESS", label: "В обработке" },
  { key: "CONTACTED", label: "Связались с клиентом" },
  { key: "CONFIRMED", label: "Подтверждена" },
  { key: "REJECTED", label: "Отклонена" },
] as const;

export type BookingStatusKey = (typeof BOOKING_STATUSES)[number]["key"];

export const STATUS_LABEL = Object.fromEntries(BOOKING_STATUSES.map((s) => [s.key, s.label])) as Record<
  BookingStatusKey,
  string
>;
