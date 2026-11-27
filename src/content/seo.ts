import type { Locale } from "@/i18n/config";

/**
 * Тексты для поисковиков: заголовок вкладки (title) и описание (description)
 * для каждой страницы на трёх языках. Главное слово — в начале, бренд Rovi — в конце.
 * Title — до ~60 символов, description — до ~155.
 */
type Seo = { title: string; description: string };
type PageSeo = Record<Locale, Seo>;

export const SEO_PAGES: Record<string, PageSeo> = {
  "/": {
    ru: {
      title: "Ведущий в Душанбе — Субхон Джалилов | свадьбы, конференции | Rovi",
      description:
        "Субхон Джалилов — ведущий свадеб, тоев, конференций и корпоративов в Душанбе и по всему Таджикистану. Журналист, теле- и радиоведущий. Забронируйте дату.",
    },
    tg: {
      title: "Барандаи тӯй ва чорабиниҳо дар Душанбе — Субҳон Ҷалилов | Ровӣ",
      description:
        "Субҳон Ҷалилов — барандаи тӯй, конфронс ва маросимҳо дар Душанбе ва тамоми Тоҷикистон. Рӯзноманигор, барандаи телевизион ва радио. Санаро банд кунед.",
    },
    en: {
      title: "Event Host & MC in Dushanbe — Subhon Jalilov | Rovi",
      description:
        "Subhon Jalilov is a wedding host, conference moderator and MC in Dushanbe and across Tajikistan. Journalist, TV and radio presenter. Book your date.",
    },
  },
  "/events/weddings": {
    ru: {
      title: "Ведущий на свадьбу в Душанбе — той, никах | Rovi",
      description:
        "Ведущий таджикской свадьбы и тоя в Душанбе: сценарий, тайминг, работа с гостями. Свадьбы по всему Таджикистану. Узнайте свободные даты.",
    },
    tg: {
      title: "Барандаи тӯй дар Душанбе — тӯйи арусӣ | Ровӣ",
      description:
        "Барандаи тӯйи арусӣ ва никоҳ дар Душанбе ва тамоми Тоҷикистон: барнома, вақт ва кор бо меҳмонон. Санаи холиро фаҳмед.",
    },
    en: {
      title: "Wedding Host in Dushanbe, Tajikistan | Rovi",
      description:
        "Wedding MC for Tajik weddings in Dushanbe and across Tajikistan: scenario, timing and guests. Check available dates.",
    },
  },
  "/events/conferences": {
    ru: {
      title: "Модератор конференций и форумов в Душанбе | Rovi",
      description:
        "Ведущий и модератор конференций, форумов и международных мероприятий в Душанбе. Работал с UNDP, UNICEF, банками и СМИ. Обсудим ваше мероприятие.",
    },
    tg: {
      title: "Модератори конфронс ва форум дар Душанбе | Ровӣ",
      description:
        "Баранда ва модератори конфронсҳо, форумҳо ва чорабиниҳои байналмилалӣ дар Душанбе. Бо UNDP, UNICEF, бонкҳо ва ВАО кор кардааст.",
    },
    en: {
      title: "Conference Moderator & Forum MC in Dushanbe | Rovi",
      description:
        "Host and moderator for conferences, forums and international events in Dushanbe. Has worked with UNDP, UNICEF, banks and media.",
    },
  },
  "/events/corporate": {
    ru: {
      title: "Ведущий корпоратива в Душанбе — новогодний, юбилей компании | Rovi",
      description:
        "Ведущий корпоративов в Душанбе: новогодние вечера, юбилеи компаний, награждения сотрудников. Программа под вашу команду. Забронируйте дату.",
    },
    tg: {
      title: "Барандаи базми корпоративӣ дар Душанбе | Ровӣ",
      description:
        "Барандаи шабнишиниҳои корпоративӣ дар Душанбе: Соли нав, солгарди ширкат, тақдири кормандон. Санаро банд кунед.",
    },
    en: {
      title: "Corporate Event Host in Dushanbe | Rovi",
      description:
        "Host for corporate events in Dushanbe: New Year parties, company anniversaries and staff awards. Book your date.",
    },
  },
  "/events/private": {
    ru: {
      title: "Ведущий на юбилей и день рождения в Душанбе | Rovi",
      description:
        "Ведущий юбилеев, дней рождения и семейных праздников в Душанбе и по Таджикистану. Тёплая программа для ваших гостей. Узнайте свободные даты.",
    },
    tg: {
      title: "Барандаи зодрӯз ва солгард дар Душанбе | Ровӣ",
      description:
        "Барандаи зодрӯз, солгард ва идҳои оилавӣ дар Душанбе ва тамоми Тоҷикистон. Санаи холиро фаҳмед.",
    },
    en: {
      title: "Host for Birthdays & Anniversaries in Dushanbe | Rovi",
      description:
        "Host for birthdays, anniversaries and family celebrations in Dushanbe and across Tajikistan. Check available dates.",
    },
  },
  "/events/official": {
    ru: {
      title: "Ведущий официальных мероприятий и церемоний в Душанбе | Rovi",
      description:
        "Ведущий официальных церемоний, презентаций, открытий и награждений в Душанбе. Протокол, тайминг и уверенная подача. Обсудим ваше мероприятие.",
    },
    tg: {
      title: "Барандаи маросимҳои расмӣ дар Душанбе | Ровӣ",
      description:
        "Барандаи маросимҳои расмӣ, муаррифиҳо, ифтитоҳ ва тақдирот дар Душанбе. Протокол ва вақт дақиқ.",
    },
    en: {
      title: "Official Ceremony Host in Dushanbe, Tajikistan | Rovi",
      description:
        "Host for official ceremonies, presentations, openings and award events in Dushanbe. Protocol, timing and confident delivery.",
    },
  },
  "/events": {
    ru: {
      title: "Форматы мероприятий — ведущий Субхон Джалилов, Душанбе | Rovi",
      description:
        "Свадьбы, конференции, корпоративы, юбилеи и официальные церемонии в Душанбе и по всему Таджикистану. Выберите формат и забронируйте дату.",
    },
    tg: {
      title: "Намудҳои чорабинӣ — барандаи Субҳон Ҷалилов, Душанбе | Ровӣ",
      description:
        "Тӯй, конфронс, базми корпоративӣ, солгард ва маросимҳои расмӣ дар Душанбе ва тамоми Тоҷикистон. Формат интихоб кунед.",
    },
    en: {
      title: "Event Formats — Host Subhon Jalilov, Dushanbe | Rovi",
      description:
        "Weddings, conferences, corporate events, anniversaries and official ceremonies in Dushanbe and across Tajikistan.",
    },
  },
  "/about": {
    ru: {
      title: "Субхон Джалилов — журналист, теле- и радиоведущий | Rovi",
      description:
        "Субхон Джалилов — журналист, теле- и радиоведущий, программный директор «Азия-Плюс», ведущий программы «Имкон». Ведёт мероприятия в Душанбе.",
    },
    tg: {
      title: "Субҳон Ҷалилов — рӯзноманигор, барандаи телевизион ва радио | Ровӣ",
      description:
        "Субҳон Ҷалилов — рӯзноманигор, барандаи телевизион ва радио, директори барномаҳои «Азия-Плюс», барандаи «Имкон».",
    },
    en: {
      title: "Subhon Jalilov — Journalist, TV & Radio Presenter | Rovi",
      description:
        "Subhon Jalilov is a journalist, TV and radio presenter, programme director at Asia-Plus and host of the morning show Imkon.",
    },
  },
  "/booking": {
    ru: {
      title: "Заказать ведущего в Душанбе — свободные даты | Rovi",
      description:
        "Оставьте заявку на ведущего: несколько вопросов о дате, площадке и формате. Свадьбы, конференции и праздники по всему Таджикистану.",
    },
    tg: {
      title: "Барандаро фармоиш диҳед — Душанбе | Ровӣ",
      description:
        "Барои фармоиши баранда ба чанд савол дар бораи сана, макон ва формат ҷавоб диҳед. Тӯй, конфронс ва идҳо дар тамоми Тоҷикистон.",
    },
    en: {
      title: "Book an MC in Dushanbe | Rovi",
      description:
        "Request a host: a few questions about the date, venue and format. Weddings, conferences and celebrations across Tajikistan.",
    },
  },
  "/contacts": {
    ru: {
      title: "Контакты — ведущий Субхон Джалилов, Душанбе | Rovi",
      description:
        "Телефон, WhatsApp, Telegram и Instagram ведущего Субхона Джалилова. Душанбе, выезд по всему Таджикистану. Напишите дату и формат.",
    },
    tg: {
      title: "Тамос — барандаи Субҳон Ҷалилов, Душанбе | Ровӣ",
      description:
        "Телефон, WhatsApp, Telegram ва Instagram-и барандаи Субҳон Ҷалилов. Душанбе ва тамоми Тоҷикистон.",
    },
    en: {
      title: "Contacts — Host Subhon Jalilov, Dushanbe | Rovi",
      description: "Phone, WhatsApp, Telegram and Instagram of host Subhon Jalilov. Dushanbe and across Tajikistan.",
    },
  },
  "/portfolio": {
    ru: { title: "Портфолио — ведущий Субхон Джалилов, Душанбе | Rovi", description: "Фото и видео с мероприятий ведущего Субхона Джалилова в Душанбе." },
    tg: { title: "Корҳо — барандаи Субҳон Ҷалилов, Душанбе | Ровӣ", description: "Акс ва видео аз чорабиниҳои барандаи Субҳон Ҷалилов дар Душанбе." },
    en: { title: "Portfolio — Host Subhon Jalilov, Dushanbe | Rovi", description: "Photos and videos from events hosted by Subhon Jalilov in Dushanbe." },
  },
  "/reviews": {
    ru: { title: "Отзывы — ведущий Субхон Джалилов, Душанбе | Rovi", description: "Отзывы клиентов о ведущем Субхоне Джалилове." },
    tg: { title: "Фикрҳо — барандаи Субҳон Ҷалилов, Душанбе | Ровӣ", description: "Фикри мизоҷон дар бораи барандаи Субҳон Ҷалилов." },
    en: { title: "Reviews — Host Subhon Jalilov, Dushanbe | Rovi", description: "Client reviews of host Subhon Jalilov." },
  },
};

/** Ключевые слова (Google их не учитывает, Яндекс — почти; оставлены как подсказка) */
export const SEO_KEYWORDS: Record<Locale, string[]> = {
  ru: [
    "Рови", "Rovi", "rovi.tj", "Субхон Джалилов", "Субхон Жалилов", "Subhon Jalilov",
    "ведущий Душанбе", "ведущий в Душанбе", "ведущий мероприятий Душанбе", "ведущий мероприятий Таджикистан",
    "ведущий на свадьбу Душанбе", "ведущий свадеб Душанбе", "ведущий на той", "ведущий таджикской свадьбы",
    "тамада Душанбе", "шоумен Душанбе", "конферансье Душанбе", "MC Душанбе",
    "модератор конференции Душанбе", "модератор форума Таджикистан", "ведущий корпоратива Душанбе",
    "ведущий юбилея Душанбе", "ведущий официальных мероприятий", "телеведущий Таджикистан",
    "радиоведущий Душанбе", "журналист Таджикистан", "Азия-Плюс", "Имкон",
  ],
  tg: [
    "Ровӣ", "Рови", "Rovi", "Субҳон Ҷалилов", "Субхон Чалилов", "баранда", "баранда Душанбе",
    "барандаи тӯй", "барандаи туй", "барандаи тӯй дар Душанбе", "барандаи чорабиниҳо", "барандаи маросимҳо",
    "беҳтарин баранда", "тӯйи арусӣ", "тӯй Душанбе", "туй Душанбе", "никоҳ", "зодрӯз", "солгард", "базм",
    "барандаи конфронс", "модератори форум", "барандаи телевизион", "барандаи радио", "рӯзноманигор",
  ],
  en: [
    "Rovi", "rovi.tj", "Subhon Jalilov", "Subkhon Dzhalilov", "event host Dushanbe", "wedding host Dushanbe",
    "MC Dushanbe", "master of ceremonies Tajikistan", "conference moderator Dushanbe",
    "forum moderator Tajikistan", "TV presenter Tajikistan", "radio host Dushanbe", "journalist Tajikistan",
  ],
};

/** Название сайта для превью ссылок */
export const SITE_NAME: Record<Locale, string> = {
  ru: "Rovi — Субхон Джалилов",
  tg: "Ровӣ — Субҳон Ҷалилов",
  en: "Rovi — Subhon Jalilov",
};
