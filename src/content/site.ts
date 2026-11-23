/**
 * Основные данные сайта. Замените значения-заглушки на реальные —
 * они автоматически подставятся во все страницы, футер и SEO.
 */
export const site = {
  hostName: "HOST NAME",
  /** Короткая роль для заголовков и SEO */
  role: "Ведущий мероприятий",
  tagline: "События, которые становятся воспоминаниями",
  subtitle: "Профессиональный ведущий свадеб, конференций, корпоративных и международных мероприятий",
  description:
    "Веду мероприятия на таджикском, русском и английском языках. Помогаю собрать вечер в цельную историю: от первого слова до финального аккорда.",
  city: "Душанбе",

  /** Пути к фотографиям в /public. null — показывается аккуратная заглушка. */
  photos: {
    hero: null as string | null, // например "/images/host-hero.jpg" (вертикальный портрет 4:5)
    about: null as string | null,
    aboutSecondary: null as string | null,
  },

  contacts: {
    phone: "+992 00 000 00 00",
    /** Номер для WhatsApp — только цифры, с кодом страны */
    whatsapp: "992000000000",
    telegram: "username", // без @
    instagram: "username", // без @
    email: "hello@example.com",
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
  email: `mailto:${site.contacts.email}`,
};
