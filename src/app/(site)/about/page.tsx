import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import { PageIntro, SectionHeading } from "@/components/section";
import { BookingBand } from "@/components/booking-band";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Обо мне",
  description: `${site.hostName} — ${site.role.toLowerCase()}. Биография, опыт и подход к работе.`,
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Подготовка важнее импровизации",
    text: "Импровизация хороша, когда за ней стоит продуманный сценарий. Я изучаю гостей, программу и площадку заранее.",
  },
  {
    title: "Уважение к людям в зале",
    text: "Никаких шуток за чужой счёт. Юмор — да, неловкость — нет. Гости разных поколений должны чувствовать себя комфортно.",
  },
  {
    title: "Язык события",
    text: "Таджикский, русский, английский — выбираю язык и интонацию под аудиторию, а не наоборот.",
  },
  {
    title: "Работа в команде",
    text: "Площадка, звук, музыканты, фотографы и организаторы — одна команда. Я связываю её работу на сцене.",
  },
];

/** Заглушки — заполните реальными данными в этом файле. */
const experience = [
  { label: "Лет на сцене", value: "—" },
  { label: "Проведённых мероприятий", value: "—" },
  { label: "Языки ведения", value: "3" },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro title={`Меня зовут ${site.hostName}`} lead={site.description} />

      <section className="container-site grid gap-10 pb-24 md:grid-cols-[1fr_1.1fr] md:gap-16 md:pb-32">
        <Photo
          src={site.photos.about}
          alt={`${site.hostName} на сцене`}
          placeholder="Фото ведущего на сцене, 4:5"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="aspect-[4/5] rounded-3xl"
        />
        <div className="space-y-6 text-lg leading-relaxed">
          <h2 className="t-h2">Биография</h2>
          <p className="text-muted">
            Здесь будет ваша история: как вы пришли в профессию, где учились, какие события стали поворотными. Два-три
            коротких абзаца, написанных от первого лица, работают лучше длинного резюме.
          </p>
          <p className="text-muted">
            Отредактируйте этот текст в файле <code className="rounded bg-paper-2 px-1.5 py-0.5 text-base">src/app/(site)/about/page.tsx</code>.
          </p>

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
        <SectionHeading title="Опыт и достижения" lead="Раздел для реальных фактов: крупные мероприятия, партнёры, награды, обучение." />
        <ul className="grid gap-4 md:grid-cols-3">
          {["Мероприятие или проект", "Награда или признание", "Обучение или сертификат"].map((label) => (
            <li key={label} className="rounded-3xl border border-dashed border-ink/20 p-7 text-muted">
              <p className="font-medium text-ink">{label}</p>
              <p className="mt-2 text-sm">Заполните реальными данными — вымышленные достижения мы не публикуем.</p>
            </li>
          ))}
        </ul>
        <Photo
          src={site.photos.aboutSecondary}
          alt={`${site.hostName} за работой`}
          placeholder="Широкое фото с мероприятия, 16:9"
          sizes="100vw"
          className="mt-12 aspect-[16/9] rounded-3xl"
        />
      </section>

      <BookingBand />
    </>
  );
}
