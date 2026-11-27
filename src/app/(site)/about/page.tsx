import { ensureContent } from "@/lib/content/store";
import { AboutPage, aboutMetadata } from "@/components/pages/about-page";

export const metadata = aboutMetadata("ru");

export default async function Page() {
  await ensureContent();
  return <AboutPage locale="ru" />;
}
