/**
 * Основные данные сайта. Замените значения-заглушки на реальные —
 * они автоматически подставятся во все страницы, футер и SEO.
 */
export const site = {
  hostName: "Субхон Джалилов",
  /** Имя латиницей — для превью ссылок в соцсетях */
  hostNameLatin: "Subhon Jalilov",
  /** Короткая роль для заголовков и SEO */
  role: "Журналист, ведущий ТВ-программ, свадеб и мероприятий",
  tagline: "События, которые становятся воспоминаниями",
  subtitle: "Профессиональный ведущий свадеб, конференций, корпоративных и международных мероприятий",
  description:
    "Веду мероприятия на таджикском языке. Помогаю собрать вечер в цельную историю: от первого слова до финального аккорда.",
  city: "Душанбе, Таджикистан",
  /** География выездов */
  travel: "Выезжаю в любой город Таджикистана",

  /** Пути к фотографиям в /public. null — показывается аккуратная заглушка. */
  photos: {
    hero: "/images/subhon-jalilov.jpg" as string | null, // вертикальный портрет
    about: "/images/subhon-jalilov.jpg" as string | null,
    aboutSecondary: null as string | null,
  },

  contacts: {
    phone: "+992 88 888 76 88",
    /** Номер для WhatsApp — только цифры, с кодом страны */
    whatsapp: "992888887688",
    telegram: "jalilovsubhon", // без @
    instagram: "subhon_jalilov", // без @
    /** Пусто — почта нигде не показывается */
    email: "",
  },
} as const;

export const nav = [
  { href: "/about", label: "Обо мне" },
  { href: "/events", label: "Мероприятия" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const contactLinks = {
  phone: `tel:${site.contacts.phone.replace(/[^\d+]/g, "")}`,
  whatsapp: `https://wa.me/${site.contacts.whatsapp}`,
  telegram: `https://t.me/${site.contacts.telegram}`,
  instagram: `https://instagram.com/${site.contacts.instagram}`,
  email: site.contacts.email ? `mailto:${site.contacts.email}` : "",
};
