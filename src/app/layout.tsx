import type { Metadata, Viewport } from "next";
import { Golos_Text, Unbounded } from "next/font/google";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-unbounded",
  display: "swap",
});

const sans = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-golos",
  display: "swap",
});

const title = `${site.hostName} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: `%s — ${site.hostName}` },
  description: site.subtitle,
  applicationName: site.hostName,
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
    siteName: site.hostName,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
