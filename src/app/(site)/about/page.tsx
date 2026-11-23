import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import { PageIntro, SectionHeading } from "@/components/section";
import { BookingBand } from "@/components/booking-band";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Обо мне",
  description: `${site.hostName} — ${site.role.toLowerCase()}. Программный директор «Азия-Плюс», ведущий утренней программы «Имкон». Биография, опыт и награды.`,
  alternates: { canonical: "/about" },
};

/* Тексты основаны на биографии с subhonjalilov.com/about. Правьте прямо здесь. */

const biography = [
  "Я родился в Файзободе, в семье рабочего. Окончил школу №1 Файзобода и детскую музыкальную школу имени Дустмурода Алиева. С тех пор музыка всегда рядом: я играю на музыкальных инструментах.",
  "В 2000 году окончил физический факультет Таджикского национального университета по специальности «радиофизика и электроника» и в том же году пришёл на Радио Таджикистана. Там прошёл путь от редактора программ для молодёжи до исполняющего обязанности главного редактора.",
  "С 2003 года работал на Радио «Ватан»: был редактором и главным редактором музыкальных и развлекательных программ, затем директором программ, автором и ведущим утреннего шоу «Субхи Ватан».",
  "Сейчас я программный директор «Азия-Плюс» и веду утреннюю программу «Имкон».",
  "Живой эфир научил меня главному: чувствовать аудиторию, держать внимание и находить нужное слово в нужный момент. Этот опыт я привожу на каждое мероприятие — свадьбу, юбилей, концерт или официальную церемонию.",
];

const experience = [
  { label: "В эфире с", value: "2000" },
  { label: "Награды", value: "3" },
  { label: "Стран стажировок", value: "8" },
];

const principles = [
  {
    title: "Честность и уважение",
    text: "Главное в человеке — честность и порядочность. На мероприятии это значит уважение к хозяевам праздника и к каждому гостю.",
  },
  {
    title: "Слово к месту",
    text: "Собираю мудрые изречения и афоризмы. Вовремя сказанное слово делает момент запоминающимся.",
  },
  {
    title: "Чувство музыки",
    text: "Музыкальное образование помогает чувствовать ритм вечера и работать в одной связке с музыкантами.",
  },
  {
    title: "Опыт живого эфира",
    text: "Больше двадцати лет у микрофона: умею держать темп программы и спокойно реагировать на неожиданности.",
  },
];

const achievements = [
  {
    year: "2009",
    title: "Премия Союза журналистов Таджикистана имени А. Лохути",
    text: "Лауреат в области радио.",
  },
  {
    year: "2010",
    title: "«Отличник культуры Республики Таджикистан»",
    text: "Нагрудный знак.",
  },
  {
    year: "2010",
    title: "«Отличник телевидения и радио»",
    text: "Знак Комитета по телевидению и радиовещанию при Правительстве Республики Таджикистан.",
  },
  {
    year: "",
    title: "Международные стажировки",
    text: "Курсы и семинары для журналистов в Казахстане, Армении, Кыргызстане, Узбекистане, Швеции, Польше, США и Малайзии.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title={`Меня зовут ${site.hostName}`}
        lead="Журналист, программный директор «Азия-Плюс» и ведущий утренней программы «Имкон». Веду свадьбы, торжества и мероприятия на таджикском языке по всему Таджикистану."
      />

      <section className="container-site grid gap-10 pb-24 md:grid-cols-[1fr_1.1fr] md:gap-16 md:pb-32">
        <Photo
          src={site.photos.about}
          alt={site.hostName}
          placeholder="Фото ведущего, 4:5"
          position="center top"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="aspect-[4/5] rounded-3xl md:sticky md:top-28 md:self-start"
        />
        <div className="space-y-6 text-lg leading-relaxed">
          <h2 className="t-h2">Биография</h2>
          {biography.map((p) => (
            <p key={p.slice(0, 24)} className="text-muted">
              {p}
            </p>
          ))}

          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-8">
            {experience.map((e) => (
              <div key={e.label}>
                <dt className="text-sm text-muted">{e.label}</dt>
                <dd className="mt-1 font-display text-3xl font-light md:text-4xl">{e.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-paper-2 py-24 md:py-32">
        <div className="container-site">
          <SectionHeading title="Подход к работе" />
          <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title}>
                <h3 className="t-h3">{p.title}</h3>
                <p className="mt-3 text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-24 md:py-32">
        <SectionHeading title="Награды и признание" />
        <ul className="border-t border-line">
          {achievements.map((a) => (
            <li key={a.title} className="grid gap-2 border-b border-line py-6 md:grid-cols-[8rem_1fr] md:gap-10">
              <span className="font-display text-brass-deep">{a.year}</span>
              <div>
                <p className="text-lg font-medium">{a.title}</p>
                <p className="mt-1 text-muted">{a.text}</p>
              </div>
            </li>
          ))}
        </ul>
        {site.photos.aboutSecondary && (
          <Photo
            src={site.photos.aboutSecondary}
            alt={`${site.hostName} за работой`}
            sizes="100vw"
            className="mt-12 aspect-[16/9] rounded-3xl"
          />
        )}
      </section>

      <BookingBand />
    </>
  );
}
