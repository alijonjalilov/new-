/**
 * Отзывы клиентов. Сейчас здесь только заглушки — реальные отзывы
 * не выдумываем. Добавьте настоящие с разрешения клиентов:
 *   { id, author: "Имя", event: "Свадьба, 2025", text: "…", placeholder: false }
 */
export interface Testimonial {
  id: string;
  author: string;
  event: string;
  text: string;
  /** true — карточка-заглушка, визуально помечается */
  placeholder?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "p1",
    author: "Имя клиента",
    event: "Свадьба",
    text: "Здесь будет отзыв пары о свадьбе. Добавьте реальный текст в файл src/content/testimonials.ts.",
    placeholder: true,
  },
  {
    id: "p2",
    author: "Имя и должность",
    event: "Конференция",
    text: "Здесь будет отзыв организатора деловой конференции или форума.",
    placeholder: true,
  },
  {
    id: "p3",
    author: "Название компании",
    event: "Корпоратив",
    text: "Здесь будет отзыв компании о корпоративном мероприятии.",
    placeholder: true,
  },
  {
    id: "p4",
    author: "Имя клиента",
    event: "Юбилей",
    text: "Здесь будет отзыв о семейном празднике или юбилее.",
    placeholder: true,
  },
];
