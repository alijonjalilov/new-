import { AboutPage, aboutMetadata } from "@/components/pages/about-page";

export const metadata = aboutMetadata("ru");

export default function Page() {
  return <AboutPage locale="ru" />;
}
