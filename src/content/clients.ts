/**
 * Компании, с которыми работал ведущий (блок «С кем я работал» на главной).
 *
 * Логотипы лежат в public/images/clients/<slug>.png — прозрачный фон, одинаковая обработка.
 * name — название на русской и таджикской версиях, nameEn — на английской.
 * ratio — ширина/высота логотипа, чтобы все логотипы выглядели одного размера.
 * round — круглый знак (эмблема), занимает весь кружок.
 *
 * Чтобы добавить компанию: положите PNG в public/images/clients и добавьте строку сюда.
 */
export type Client = { slug: string; name: string; nameEn: string; ratio: number; round?: boolean };

export const clients: Client[] = [
  { slug: "avesto", name: "Авесто Груп", nameEn: "Avesto Group", ratio: 3.103 },
  { slug: "asia-plus", name: "Азия+", nameEn: "Asia-Plus", ratio: 3.025 },
  { slug: "yovar", name: "Ёвар", nameEn: "Yovar", ratio: 3.462 },
  { slug: "paykar", name: "Пайкар", nameEn: "Paykar", ratio: 3.711 },
  { slug: "harmony", name: "Harmony Sleep", nameEn: "Harmony Sleep", ratio: 2.449 },
  { slug: "beta-tea", name: "Beta Tea", nameEn: "Beta Tea", ratio: 1.714 },
  { slug: "air-baby", name: "Air Baby", nameEn: "Air Baby", ratio: 0.956 },
  { slug: "paradise-wall", name: "Paradise Wall", nameEn: "Paradise Wall", ratio: 6.429 },
  { slug: "safina", name: "ТВ Сафина", nameEn: "Safina TV", ratio: 1.091 },
  { slug: "tojikfilm", name: "МД Тоҷикфилм", nameEn: "Tojikfilm", ratio: 1.885 },
  { slug: "azam", name: "AZAM", nameEn: "AZAM", ratio: 0.889 },
  { slug: "national-bank", name: "Бонки Миллии Тоҷикистон", nameEn: "National Bank of Tajikistan", ratio: 2.748 },
  { slug: "istiklol", name: "ФК Истиқлол", nameEn: "FC Istiklol", ratio: 1.000, round: true },
  { slug: "bloggers", name: "Ассотсиатсияи Блогерони Тоҷикистон", nameEn: "Association of Bloggers of Tajikistan", ratio: 1.006, round: true },
  { slug: "spitamen", name: "Спитамен Бонк", nameEn: "Spitamen Bank", ratio: 1.348 },
  { slug: "avrang", name: "Авранг", nameEn: "Avrang", ratio: 4.675 },
  { slug: "sardor", name: "Сардор", nameEn: "Sardor", ratio: 1.818 },
  { slug: "vatan", name: "ТРК Ватан", nameEn: "Vatan TV & Radio", ratio: 3.711 },
  { slug: "marmari", name: "Мармарӣ", nameEn: "Marmari", ratio: 6.207 },
];
