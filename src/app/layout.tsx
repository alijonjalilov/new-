import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geologica, Golos_Text } from "next/font/google";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/** Шрифт заголовков. Geologica поддерживает все таджикские буквы: Ғ Ӣ Қ Ӯ Ҳ Ҷ */
const display = Geologica({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-display-face",
  display: "swap",
});

const sans = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-golos",
  display: "swap",
});

const title = `${site.hostName} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: `%s — ${site.hostName}` },
  description: site.subtitle,
  applicationName: "Rovi",
  /** Коды подтверждения Google Search Console и Яндекс Вебмастера — из переменных Railway */
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.YANDEX_VERIFICATION || undefined,
  },
  keywords: [
    "Субхон Джалилов",
    "Subhon Jalilov",
    "Имкон",
    "Азия-Плюс",
    "ведущий свадеб Душанбе",
    "ведущий мероприятий",
    "ведущий на свадьбу",
    "ведущий конференций",
    "модератор форума",
    "ведущий корпоратива",
    "ведущий Душанбе",
    "тамада",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Rovi — Субхон Джалилов",
    title,
    description: site.subtitle,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description: site.subtitle },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#2a1e3b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const lang = ["ru", "tg", "en"].includes(h.get("x-site-lang") ?? "") ? h.get("x-site-lang")! : "ru";
  return (
    <html lang={lang} className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
