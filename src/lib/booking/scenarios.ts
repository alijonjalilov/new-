/**
 * Сценарии анкеты бронирования.
 *
 * Чтобы изменить вопросы — правьте только этот файл:
 *  - порядок вопросов = порядок в массиве;
 *  - `showIf` — условие показа (условная логика);
 *  - `optional` — вопрос можно пропустить;
 *  - `otherValue` — вариант, после выбора которого появится поле «Уточните»;
 *  - `field` — значение также сохраняется в отдельной колонке БД (для фильтров).
 *
 * Клиент и сервер используют одни и те же сценарии, поэтому
 * сервер валидирует ровно те вопросы, которые видел пользователь.
 */
import type { Answers, ChoiceQuestion, EventTypeKey, Option, Question, Scenario } from "./types";

/* ───────────────────────── Общие наборы вариантов ───────────────────────── */

/** Валюта бюджета */
export const BUDGET_CURRENCY = "сомони";

const YES_NO_MAYBE: Option[] = [
  { value: "yes", label: "Да" },
  { value: "no", label: "Нет" },
  { value: "maybe", label: "Пока не решили" },
];

const GUESTS_PRIVATE: Option[] = [
  { value: "lt50", label: "До 50" },
  { value: "50-100", label: "50–100" },
  { value: "100-200", label: "100–200" },
  { value: "200-300", label: "200–300" },
  { value: "gt300", label: "Более 300" },
];

const GUESTS_BUSINESS: Option[] = [
  { value: "lt50", label: "До 50" },
  { value: "50-100", label: "50–100" },
  { value: "100-300", label: "100–300" },
  { value: "300-500", label: "300–500" },
  { value: "gt500", label: "Более 500" },
];

const HOSTING_STYLE: Option[] = [
  { value: "classic", label: "Классический", hint: "Элегантно и по канону" },
  { value: "modern", label: "Современный", hint: "Легко, живо, без шаблонов" },
  { value: "intelligent", label: "Интеллигентный", hint: "Тонкий юмор и такт" },
  { value: "humor", label: "Юмористический", hint: "Много смеха" },
  { value: "energetic", label: "Энергичный", hint: "Драйв и вовлечение" },
  { value: "mixed", label: "Смешанный", hint: "По ситуации" },
];

const DURATION: Option[] = [
  { value: "hours", label: "Несколько часов" },
  { value: "half", label: "Полдня" },
  { value: "day", label: "Один день" },
  { value: "days", label: "Несколько дней" },
];

const VENUE_PRIVATE: Option[] = [
  { value: "restaurant", label: "Ресторан" },
  { value: "hall", label: "Банкетный зал" },
  { value: "country", label: "Загородная площадка" },
  { value: "other", label: "Другое" },
  { value: "undecided", label: "Пока не определились" },
];

/** Для свадьбы — без варианта «Пока не определились» */
const VENUE_WEDDING: Option[] = VENUE_PRIVATE.filter((o) => o.value !== "undecided");

const MUSIC_TYPES: Option[] = [
  { value: "live", label: "Живые исполнители" },
  { value: "band", label: "Музыкальная группа" },
  { value: "dj", label: "DJ" },
  { value: "national", label: "Национальные исполнители" },
  { value: "other", label: "Другие артисты" },
];

const STATUS_LEVEL: Option[] = [
  { value: "local", label: "Локальный" },
  { value: "national", label: "Национальный" },
  { value: "international", label: "Международный" },
];

const SCRIPT_READY: Option[] = [
  { value: "yes", label: "Да, сценарий готов" },
  { value: "draft", label: "Есть черновик" },
  { value: "no", label: "Нет, нужна помощь" },
];

/* ───────────────────────── Хелперы условий ───────────────────────── */

const is = (id: string, ...values: string[]) => (a: Answers) => {
  const v = a[id];
  return typeof v === "string" && values.includes(v);
};
const isNot = (id: string, ...values: string[]) => (a: Answers) => {
  const v = a[id];
  return typeof v === "string" && !values.includes(v);
};

/* ───────────────────────── Общие блоки вопросов ───────────────────────── */

const dateQ = (title = "Дата мероприятия"): Question => ({
  id: "date",
  type: "date",
  title,
  description: "Выберите дату в календаре. Если она ещё не окончательная — укажите ориентировочную.",
  summaryLabel: "Дата",
  field: "eventDate",
});

const timeQ = (optional = false): Question => ({
  id: "time",
  type: "time",
  title: "Во сколько начинается мероприятие?",
  description: optional ? "Можно пропустить, если время ещё не известно." : undefined,
  summaryLabel: "Время начала",
  field: "eventTime",
  optional,
});

const cityQ = (title = "В каком городе пройдёт мероприятие?"): Question => ({
  id: "city",
  type: "text",
  title,
  placeholder: "Например, Душанбе",
  summaryLabel: "Город",
  field: "city",
  maxLength: 80,
  autoComplete: "address-level2",
});

const venueTypeQ = (options: Option[] = VENUE_PRIVATE, title = "Где планируется мероприятие?"): ChoiceQuestion => ({
  id: "venueType",
  type: "single",
  title,
  options,
  otherValue: "other",
  otherPlaceholder: "Опишите площадку",
  summaryLabel: "Площадка",
});

const venueNameQ = (hideFor: string[] = ["undecided"]): Question => ({
  id: "venueName",
  type: "text",
  title: "Укажите название площадки или точный адрес",
  description: "Необязательно — можно уточнить позже.",
  placeholder: "Название или адрес",
  summaryLabel: "Адрес / название",
  field: "address",
  optional: true,
  maxLength: 200,
  showIf: isNot("venueType", ...hideFor),
});

const guestsQ = (options: Option[], title = "Сколько гостей ожидается?"): Question => ({
  id: "guests",
  type: "single",
  title,
  options,
  summaryLabel: "Гостей",
  field: "guests",
});

const durationQ = (): Question => ({
  id: "duration",
  type: "single",
  title: "Какова продолжительность мероприятия?",
  options: DURATION,
  summaryLabel: "Продолжительность",
});

const styleQ = (): Question => ({
  id: "style",
  type: "single",
  title: "Какой стиль ведения вам ближе?",
  options: HOSTING_STYLE,
  summaryLabel: "Стиль ведения",
});

const budgetQ = (title = "Ваш бюджет на ведущего"): Question => ({
  id: "budget",
  type: "number",
  title,
  description: `Укажите сумму в ${BUDGET_CURRENCY}. Это помогает предложить подходящий формат и ни к чему не обязывает.`,
  placeholder: "Например, 5000",
  min: 1,
  max: 10_000_000,
  suffix: BUDGET_CURRENCY,
  summaryLabel: "Бюджет",
});

const musicBlock = (title = "Планируется ли музыкальная программа?"): Question[] => [
  {
    id: "music",
    type: "single",
    title,
    options: [
      { value: "yes", label: "Да" },
      { value: "no", label: "Нет" },
      { value: "maybe", label: "Пока не определились" },
    ],
    summaryLabel: "Музыкальная программа",
  },
  {
    id: "musicTypes",
    type: "multi",
    title: "Кто будет отвечать за музыку?",
    description: "Можно выбрать несколько вариантов.",
    options: MUSIC_TYPES,
    otherValue: "other",
    otherPlaceholder: "Каких артистов планируете?",
    summaryLabel: "Музыка",
    showIf: is("music", "yes"),
  },
];

/**
 * Второй ведущий. Сам ведущий работает на таджикском языке,
 * поэтому язык спрашиваем только для второго ведущего — и только если он нужен.
 */
const secondHostBlock = (title = "Нужен ли второй ведущий?"): Question[] => [
  {
    id: "secondHost",
    type: "single",
    title,
    description: "Я веду мероприятия на таджикском языке. Если нужен ещё один язык, его может взять на себя второй ведущий.",
    options: YES_NO_MAYBE,
    summaryLabel: "Второй ведущий",
  },
  {
    id: "secondHostLanguage",
    type: "single",
    title: "На каком языке должен вести второй ведущий?",
    options: [
      { value: "ru", label: "Русский" },
      { value: "en", label: "Английский" },
      { value: "uz", label: "Узбекский" },
      { value: "tg", label: "Таджикский" },
      { value: "other", label: "Другой язык" },
    ],
    otherValue: "other",
    otherPlaceholder: "Какой язык?",
    summaryLabel: "Язык второго ведущего",
    field: "language",
    showIf: is("secondHost", "yes"),
  },
  {
    id: "secondHostDetails",
    type: "textarea",
    title: "Есть ли пожелания ко второму ведущему?",
    description: "Необязательно. Например: роль в программе, стиль, нужен ли ведущий-женщина.",
    placeholder: "Ваши пожелания",
    summaryLabel: "Пожелания ко второму ведущему",
    optional: true,
    maxLength: 600,
    showIf: is("secondHost", "yes"),
  },
];

/* ───────────────────────── Сценарии ───────────────────────── */

const WEDDING: Scenario = {
  eventType: "WEDDING",
  questions: [
    {
      id: "weddingType",
      type: "single",
      title: "Какую свадьбу вы планируете?",
      options: [
        { value: "traditional", label: "Традиционная" },
        { value: "modern", label: "Современная" },
        { value: "national", label: "Национальная" },
        { value: "mixed", label: "Смешанная" },
        { value: "other", label: "Другая" },
      ],
      otherValue: "other",
      otherPlaceholder: "Расскажите о формате",
      summaryLabel: "Формат свадьбы",
    },
    dateQ("Дата свадьбы"),
    cityQ("В каком городе будет проходить свадьба?"),
    venueTypeQ(VENUE_WEDDING),
    venueNameQ(),
    timeQ(),
    ...secondHostBlock(),
    {
      id: "singers",
      type: "list",
      title: "Кто будут певцы?",
      description: "Если вы уже пригласили певцов или артистов, напишите их имена. Это нужно нам для информации — можно пропустить.",
      placeholder: "Имя и фамилия",
      addLabel: "Добавить певца",
      initialCount: 3,
      maxItems: 10,
      summaryLabel: "Певцы",
      optional: true,
    },
    styleQ(),
    budgetQ(),
  ],
};

const CONFERENCE: Scenario = {
  eventType: "CONFERENCE",
  questions: [
    {
      id: "conferenceType",
      type: "single",
      title: "Какой тип мероприятия?",
      options: [
        { value: "international", label: "Международная конференция" },
        { value: "business", label: "Бизнес-форум" },
        { value: "science", label: "Научная конференция" },
        { value: "education", label: "Образовательный форум" },
        { value: "government", label: "Государственное мероприятие" },
        { value: "panel", label: "Панельная дискуссия" },
        { value: "other", label: "Другое" },
      ],
      otherValue: "other",
      otherPlaceholder: "Уточните формат",
      summaryLabel: "Тип мероприятия",
    },
    {
      id: "topic",
      type: "text",
      title: "Какова основная тема конференции?",
      placeholder: "Например: цифровая трансформация в Центральной Азии",
      summaryLabel: "Тема",
      maxLength: 200,
    },
    dateQ("Дата проведения"),
    timeQ(true),
    cityQ("Город проведения"),
    venueTypeQ(
      [
        { value: "conference-hall", label: "Конференц-зал" },
        { value: "hotel", label: "Отель" },
        { value: "university", label: "Университет" },
        { value: "expo", label: "Выставочный центр" },
        { value: "online", label: "Онлайн" },
        { value: "other", label: "Другое" },
      ],
      "Место проведения",
    ),
    venueNameQ(["online"]),
    guestsQ(GUESTS_BUSINESS, "Сколько участников ожидается?"),
    {
      id: "level",
      type: "single",
      title: "Каков статус мероприятия?",
      options: STATUS_LEVEL,
      summaryLabel: "Статус",
    },
    {
      id: "interpretation",
      type: "single",
      title: "Нужен ли синхронный перевод?",
      options: [
        { value: "yes", label: "Да, нужен" },
        { value: "has", label: "Уже организован" },
        { value: "no", label: "Не нужен" },
        { value: "maybe", label: "Пока не решили" },
      ],
      summaryLabel: "Синхронный перевод",
    },
    {
      id: "speakers",
      type: "single",
      title: "Сколько спикеров планируется?",
      options: [
        { value: "1-3", label: "1–3" },
        { value: "4-10", label: "4–10" },
        { value: "11-20", label: "11–20" },
        { value: "gt20", label: "Более 20" },
        { value: "unknown", label: "Пока неизвестно" },
      ],
      summaryLabel: "Спикеров",
    },
    {
      id: "officials",
      type: "single",
      title: "Будут ли присутствовать официальные лица?",
      description: "Представители государственных органов или международных организаций.",
      options: [
        { value: "yes", label: "Да" },
        { value: "no", label: "Нет" },
        { value: "unknown", label: "Пока неизвестно" },
      ],
      summaryLabel: "Официальные лица",
    },
    {
      id: "hostingFormat",
      type: "multi",
      title: "Какой формат ведения необходим?",
      description: "Можно выбрать несколько вариантов.",
      options: [
        { value: "protocol", label: "Официальный протокол" },
        { value: "panels", label: "Модерация панельных дискуссий" },
        { value: "speakers", label: "Представление спикеров" },
        { value: "full", label: "Ведение всей программы" },
        { value: "interviews", label: "Интервью с участниками" },
      ],
      summaryLabel: "Формат ведения",
    },
    durationQ(),
    {
      id: "script",
      type: "single",
      title: "Есть ли готовый сценарий мероприятия?",
      options: SCRIPT_READY,
      summaryLabel: "Сценарий",
    },
    ...secondHostBlock("Нужен ли второй ведущий или модератор?"),
    budgetQ(),
  ],
};

const CORPORATE: Scenario = {
  eventType: "CORPORATE",
  questions: [
    {
      id: "corporateType",
      type: "single",
      title: "Какое корпоративное мероприятие вы планируете?",
      options: [
        { value: "new-year", label: "Новогодний корпоратив" },
        { value: "anniversary", label: "Юбилей / день компании" },
        { value: "awards", label: "Награждение сотрудников" },
        { value: "teambuilding", label: "Тимбилдинг" },
        { value: "party", label: "Праздничный вечер" },
        { value: "other", label: "Другое" },
      ],
      otherValue: "other",
      otherPlaceholder: "Уточните формат",
      summaryLabel: "Тип корпоратива",
    },
    {
      id: "company",
      type: "text",
      title: "Название компании",
      placeholder: "ООО «Компания»",
      summaryLabel: "Компания",
      maxLength: 120,
      autoComplete: "organization",
    },
    {
      id: "occasion",
      type: "text",
      title: "Какой повод проведения?",
      description: "Необязательно, если повод понятен из типа мероприятия.",
      placeholder: "Например: 10 лет компании",
      summaryLabel: "Повод",
      optional: true,
      maxLength: 200,
    },
    dateQ(),
    timeQ(true),
    cityQ(),
    venueTypeQ(),
    venueNameQ(),
    guestsQ(GUESTS_PRIVATE),
    ...secondHostBlock(),
    durationQ(),
    ...musicBlock("Нужен ли DJ или музыкальная программа?"),
    {
      id: "showProgram",
      type: "single",
      title: "Нужны ли артисты и шоу-программа?",
      options: YES_NO_MAYBE,
      summaryLabel: "Артисты и шоу",
    },
    styleQ(),
    budgetQ(),
  ],
};

const BIRTHDAY: Scenario = {
  eventType: "BIRTHDAY",
  questions: [
    {
      id: "birthdayType",
      type: "single",
      title: "Что планируется?",
      options: [
        { value: "birthday", label: "День рождения" },
        { value: "jubilee", label: "Юбилей" },
        { value: "family", label: "Семейный праздник" },
        { value: "other", label: "Другое" },
      ],
      otherValue: "other",
      otherPlaceholder: "Какой праздник?",
      summaryLabel: "Праздник",
    },
    {
      id: "age",
      type: "number",
      title: "Сколько лет исполняется имениннику?",
      description: "Необязательно.",
      placeholder: "Например, 50",
      min: 1,
      max: 120,
      optional: true,
      summaryLabel: "Возраст",
      showIf: isNot("birthdayType", "family"),
    },
    dateQ(),
    timeQ(true),
    cityQ(),
    venueTypeQ(),
    venueNameQ(),
    guestsQ(GUESTS_PRIVATE),
    ...secondHostBlock(),
    {
      id: "format",
      type: "single",
      title: "Какой формат мероприятия?",
      options: [
        { value: "banquet", label: "Банкет" },
        { value: "home", label: "Домашний праздник" },
        { value: "outdoor", label: "На природе / выездной" },
        { value: "themed", label: "Тематическая вечеринка" },
        { value: "other", label: "Другое" },
      ],
      otherValue: "other",
      otherPlaceholder: "Опишите формат",
      summaryLabel: "Формат",
    },
    ...musicBlock("Нужна ли музыкальная программа?"),
    {
      id: "artistsNeeded",
      type: "single",
      title: "Нужны ли артисты?",
      options: YES_NO_MAYBE,
      summaryLabel: "Артисты",
    },
    budgetQ(),
  ],
};

const OFFICIAL: Scenario = {
  eventType: "OFFICIAL",
  questions: [
    {
      id: "officialType",
      type: "single",
      title: "Какое мероприятие вы планируете?",
      options: [
        { value: "presentation", label: "Презентация продукта / проекта" },
        { value: "opening", label: "Открытие / запуск" },
        { value: "awards", label: "Церемония награждения" },
        { value: "state", label: "Государственное / протокольное" },
        { value: "culture", label: "Культурное мероприятие" },
        { value: "sport", label: "Спортивное мероприятие" },
        { value: "other", label: "Другое" },
      ],
      otherValue: "other",
      otherPlaceholder: "Уточните формат",
      summaryLabel: "Тип мероприятия",
    },
    {
      id: "organization",
      type: "text",
      title: "Организатор мероприятия",
      description: "Компания, ведомство или организация.",
      placeholder: "Название организации",
      summaryLabel: "Организатор",
      maxLength: 160,
      autoComplete: "organization",
    },
    dateQ(),
    timeQ(true),
    cityQ(),
    venueTypeQ(
      [
        { value: "conference-hall", label: "Конференц-зал" },
        { value: "hotel", label: "Отель" },
        { value: "open-air", label: "Открытая площадка" },
        { value: "expo", label: "Выставочный центр" },
        { value: "stadium", label: "Стадион / спортивная арена" },
        { value: "other", label: "Другое" },
        { value: "undecided", label: "Пока не определились" },
      ],
      "Место проведения",
    ),
    venueNameQ(),
    guestsQ(GUESTS_BUSINESS, "Сколько гостей ожидается?"),
    {
      id: "level",
      type: "single",
      title: "Каков статус мероприятия?",
      options: STATUS_LEVEL,
      summaryLabel: "Статус",
    },
    ...secondHostBlock(),
    {
      id: "officials",
      type: "single",
      title: "Будут ли присутствовать официальные лица?",
      options: [
        { value: "yes", label: "Да" },
        { value: "no", label: "Нет" },
        { value: "unknown", label: "Пока неизвестно" },
      ],
      summaryLabel: "Официальные лица",
    },
    {
      id: "hostingFormat",
      type: "multi",
      title: "Что входит в задачи ведущего?",
      description: "Можно выбрать несколько вариантов.",
      options: [
        { value: "protocol", label: "Официальный протокол" },
        { value: "full", label: "Ведение всей программы" },
        { value: "guests", label: "Представление гостей и спикеров" },
        { value: "awards", label: "Вручение наград" },
        { value: "press", label: "Работа с прессой и интервью" },
      ],
      summaryLabel: "Задачи ведущего",
    },
    durationQ(),
    {
      id: "script",
      type: "single",
      title: "Есть ли готовый сценарий?",
      options: SCRIPT_READY,
      summaryLabel: "Сценарий",
    },
    budgetQ(),
  ],
};

const OTHER: Scenario = {
  eventType: "OTHER",
  questions: [
    {
      id: "otherType",
      type: "text",
      title: "Какое мероприятие вы планируете?",
      placeholder: "Например: выпускной вечер",
      summaryLabel: "Тип мероприятия",
      maxLength: 160,
    },
    dateQ(),
    timeQ(true),
    cityQ(),
    venueTypeQ(),
    venueNameQ(),
    guestsQ(GUESTS_PRIVATE),
    ...secondHostBlock(),
    durationQ(),
    {
      id: "requirements",
      type: "textarea",
      title: "Есть ли особые требования?",
      description: "Необязательно. Дресс-код, программа, гости, тайминг — всё, что важно знать.",
      placeholder: "Расскажите подробнее",
      summaryLabel: "Особые требования",
      optional: true,
      maxLength: 1000,
    },
    budgetQ(),
  ],
};

export const SCENARIOS: Record<EventTypeKey, Scenario> = {
  WEDDING,
  CONFERENCE,
  CORPORATE,
  BIRTHDAY,
  OFFICIAL,
  OTHER,
};
