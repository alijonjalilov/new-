/**
 * Компании, с которыми работал ведущий (блок «С кем я работал» на главной).
 *
 * Логотипы лежат в public/images/clients/<slug>.png — прозрачный фон, одинаковая обработка.
 * name — название на русской версии, nameTg — на таджикской (если не указано, берётся name),
 * nameEn — на английской.
 * ratio — ширина/высота логотипа, чтобы все логотипы выглядели одного размера.
 * round — круглый знак (эмблема), занимает весь кружок.
 *
 * Порядок перемешан, чтобы компании разных групп чередовались.
 * Чтобы добавить компанию: положите PNG в public/images/clients и добавьте строку сюда.
 */
export type Client = { slug: string; name: string; nameTg?: string; nameEn: string; ratio: number; round?: boolean };

/** Название компании на нужном языке */
export const clientName = (c: Client, locale: string) =>
  locale === "en" ? c.nameEn : locale === "tg" ? (c.nameTg ?? c.name) : c.name;

export const clients: Client[] = [
  { slug: "safina", name: "ТВ Сафина", nameEn: "Safina TV", ratio: 1.091 },
  { slug: "unicef", name: "UNICEF", nameEn: "UNICEF", ratio: 3.750 },
  { slug: "somon", name: "Somon.tj", nameEn: "Somon.tj", ratio: 3.871 },
  { slug: "tojikfilm", name: "МД Тоҷикфилм", nameEn: "Tojikfilm", ratio: 1.885 },
  { slug: "unhcr", name: "UNHCR", nameEn: "UNHCR", ratio: 0.919 },
  { slug: "avesto", name: "Авесто Груп", nameEn: "Avesto Group", ratio: 3.103 },
  { slug: "marmari", name: "Мармарӣ", nameEn: "Marmari", ratio: 6.207 },
  { slug: "dilpur", name: "Дилпур", nameEn: "Dilpur", ratio: 1.277 },
  { slug: "furuz", name: "Фурӯз", nameEn: "Furuz", ratio: 1.607 },
  { slug: "azam", name: "AZAM", nameEn: "AZAM", ratio: 0.889 },
  { slug: "neru", name: "Неру", nameEn: "NERU", ratio: 1.314 },
  { slug: "unesco", name: "UNESCO", nameEn: "UNESCO", ratio: 1.000 },
  { slug: "yovar", name: "Ёвар", nameEn: "Yovar", ratio: 3.462 },
  { slug: "sakina", name: "Sakina", nameEn: "Sakina", ratio: 1.579 },
  { slug: "alif", name: "Алиф", nameEn: "Alif", ratio: 2.483 },
  { slug: "sardor", name: "Сардор", nameEn: "Sardor", ratio: 1.818 },
  { slug: "ssb", name: "СС Бонк", nameEn: "SSB", ratio: 4.138 },
  { slug: "youth-sports", name: "Кумитаи кор бо ҷавонон ва варзиш", nameEn: "Committee for Youth and Sports", ratio: 1.003, round: true },
  { slug: "istiklol", name: "ФК Истиқлол", nameEn: "FC Istiklol", ratio: 1.000, round: true },
  { slug: "dov-films", name: "DOV Films", nameEn: "DOV Films", ratio: 2.022 },
  { slug: "amiri", name: "AMIRI", nameEn: "AMIRI", ratio: 1.818 },
  { slug: "vatan", name: "ТРК Ватан", nameEn: "Vatan TV & Radio", ratio: 3.711 },
  { slug: "women-family", name: "Кумитаи кор бо занон ва оилаи назди Ҳукумати Ҷумҳурии Тоҷикистон", nameEn: "Committee on Women and Family Affairs under the Government of Tajikistan", ratio: 0.914, round: true },
  { slug: "bonuvon", name: "Маҷаллаи Бонувони Тоҷикистон", nameEn: "Bonuvoni Tojikiston Magazine", ratio: 4.737 },
  { slug: "development-bank", name: "Бонки Рушди Тоҷикистон", nameEn: "Development Bank of Tajikistan", ratio: 4.337 },
  { slug: "amonatbonk", name: "Амонатбонк", nameEn: "Amonatbonk", ratio: 1.118 },
  { slug: "spitamen", name: "Спитамен Бонк", nameEn: "Spitamen Bank", ratio: 1.348 },
  { slug: "chint", name: "CHINT", nameEn: "CHINT", ratio: 4.235 },
  { slug: "asia-plus", name: "Азия+", nameEn: "Asia-Plus", ratio: 3.025 },
  { slug: "air-baby", name: "Air Baby", nameEn: "Air Baby", ratio: 0.956 },
  { slug: "tcell", name: "Tcell", nameEn: "Tcell", ratio: 2.628 },
  { slug: "gazpromneft", name: "Газпром нефть", nameEn: "Gazprom Neft", ratio: 3.077 },
  { slug: "paykar", name: "Пайкар", nameEn: "Paykar", ratio: 3.711 },
  { slug: "avrang", name: "Авранг", nameEn: "Avrang", ratio: 4.675 },
  { slug: "undp", name: "UNDP", nameEn: "UNDP", ratio: 0.497 },
  { slug: "eu", name: "Евросоюз", nameEn: "European Union", ratio: 1.722 },
  { slug: "bloggers", name: "Ассотсиатсияи Блогерони Тоҷикистон", nameEn: "Association of Bloggers of Tajikistan", ratio: 1.006, round: true },
  { slug: "megafon", name: "МегаФон Тоҷикистон", nameEn: "MegaFon Tajikistan", ratio: 4.557 },
  { slug: "national-bank", name: "Бонки Миллии Тоҷикистон", nameEn: "National Bank of Tajikistan", ratio: 2.748 },
  { slug: "harmony", name: "Harmony Sleep", nameEn: "Harmony Sleep", ratio: 2.449 },
  { slug: "laklak", name: "LakLak", nameEn: "LakLak", ratio: 1.682 },
  { slug: "international-bank", name: "Бонки Байналмилалии Тоҷикистон", nameEn: "International Bank of Tajikistan", ratio: 3.711 },
  { slug: "paradise-wall", name: "Paradise Wall", nameEn: "Paradise Wall", ratio: 6.429 },
  { slug: "beta-tea", name: "Бета Чай", nameEn: "Beta Tea", ratio: 1.714 },
  { slug: "freedom-bank", name: "Freedom Bank", nameEn: "Freedom Bank", ratio: 3.564 },
  { slug: "siyoma", name: "Сиёма", nameEn: "Siyoma", ratio: 1.837 },
  { slug: "nerui-oftob", name: "Неруи Офтоб", nameEn: "Nerui Oftob", ratio: 1.208 },
  { slug: "ministry-culture", name: "Вазорати фарҳанг", nameEn: "Ministry of Culture", ratio: 1.020, round: true },
];
