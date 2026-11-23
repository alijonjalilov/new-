const steps = [
  {
    title: "Заявка",
    text: "Вы отвечаете на несколько вопросов о мероприятии на сайте — это помогает мне сразу понять задачу.",
  },
  {
    title: "Разговор",
    text: "Созваниваемся, уточняем детали, формат и бюджет. Подтверждаем дату.",
  },
  {
    title: "Подготовка",
    text: "Пишу сценарий, согласую его с вами и синхронизируюсь с подрядчиками и площадкой.",
  },
  {
    title: "Событие",
    text: "Веду программу. Вы проживаете свой день, а не следите за таймингом.",
  },
];

export function ApproachSteps() {
  return (
    <ol className="grid gap-10 md:grid-cols-2 md:gap-x-16 lg:grid-cols-4 lg:gap-x-10">
      {steps.map((s, i) => (
        <li key={s.title} className="border-t border-ink/15 pt-6">
          <span className="font-display text-sm text-brass-deep" aria-hidden>
            {i + 1}
          </span>
          <h3 className="t-h3 mt-3">{s.title}</h3>
          <p className="mt-3 text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
