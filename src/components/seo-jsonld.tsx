import { eventCategories } from "@/content/events";
import { contactLinks, site } from "@/content/site";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";
import { siteUrl } from "@/lib/site";

/**
 * Структурированные данные (JSON-LD) для главной: кто это, какие услуги и где.
 * Помогают Google и Яндексу понять, что это ведущий мероприятий в Душанбе.
 * Оценок и отзывов нет намеренно — добавим, когда появятся настоящие.
 */
const L = {
  ru: {
    jobs: ["Ведущий мероприятий", "Журналист", "Телеведущий", "Радиоведущий"],
    service: "Rovi — ведущий мероприятий Субхон Джалилов",
    catalog: "Форматы мероприятий",
    services: {
      weddings: "Ведущий на свадьбу и той",
      conferences: "Модератор конференций и форумов",
      corporate: "Ведущий корпоративов",
      private: "Ведущий юбилеев и дней рождения",
      official: "Ведущий официальных церемоний",
    },
    city: "Душанбе",
    country: "Таджикистан",
    cities: ["Душанбе", "Худжанд", "Бохтар", "Куляб", "Истаравшан", "Турсунзаде", "Гиссар", "Вахдат"],
  },
  tg: {
    jobs: ["Барандаи чорабиниҳо", "Рӯзноманигор", "Барандаи телевизион", "Барандаи радио"],
    service: "Ровӣ — барандаи чорабиниҳо Субҳон Ҷалилов",
    catalog: "Намудҳои чорабинӣ",
    services: {
      weddings: "Барандаи тӯй",
      conferences: "Модератори конфронс ва форум",
      corporate: "Барандаи базми корпоративӣ",
      private: "Барандаи зодрӯз ва солгард",
      official: "Барандаи маросимҳои расмӣ",
    },
    city: "Душанбе",
    country: "Тоҷикистон",
    cities: ["Душанбе", "Хуҷанд", "Бохтар", "Кӯлоб", "Истаравшан", "Турсунзода", "Ҳисор", "Ваҳдат"],
  },
  en: {
    jobs: ["Event host", "Journalist", "TV presenter", "Radio presenter"],
    service: "Rovi — event host Subhon Jalilov",
    catalog: "Event formats",
    services: {
      weddings: "Wedding host",
      conferences: "Conference and forum moderator",
      corporate: "Corporate event host",
      private: "Birthday and anniversary host",
      official: "Official ceremony host",
    },
    city: "Dushanbe",
    country: "Tajikistan",
    cities: ["Dushanbe", "Khujand", "Bokhtar", "Kulob", "Istaravshan", "Tursunzade", "Hisor", "Vahdat"],
  },
} as const;

export function SeoJsonLd({ locale }: { locale: Locale }) {
  const base = siteUrl();
  const l = L[locale];
  const home = `${base}${lp(locale, "/")}`;
  const image = site.photos.hero ? `${base}${site.photos.hero}` : undefined;
  const address = { "@type": "PostalAddress", addressLocality: l.city, addressCountry: "TJ" };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${base}/#person`,
        name: t(locale, site.hostName),
        alternateName: ["Субхон Джалилов", "Субҳон Ҷалилов", "Subhon Jalilov", "Субхон Чалилов", "Rovi", "Рови", "Ровӣ"],
        jobTitle: l.jobs,
        worksFor: { "@type": "Organization", name: "Азия-Плюс" },
        url: home,
        ...(image ? { image } : {}),
        telephone: site.contacts.phone.replace(/\s/g, ""),
        knowsLanguage: ["tg", "ru"],
        address,
        sameAs: [contactLinks.instagram, contactLinks.telegram],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${base}/#service`,
        name: l.service,
        alternateName: ["Rovi", "Рови", "Ровӣ", "rovi.tj"],
        url: home,
        ...(image ? { image } : {}),
        telephone: site.contacts.phone.replace(/\s/g, ""),
        founder: { "@id": `${base}/#person` },
        address,
        areaServed: [
          ...l.cities.map((name) => ({ "@type": "City", name })),
          { "@type": "Country", name: l.country },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: l.catalog,
          itemListElement: eventCategories.map((c) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: l.services[c.slug as keyof typeof l.services] ?? t(locale, c.title),
              url: `${base}${lp(locale, `/events/${c.slug}`)}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Rovi",
        alternateName: ["Рови", "Ровӣ", "rovi.tj"],
        inLanguage: ["ru", "tg", "en"],
        publisher: { "@id": `${base}/#person` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
