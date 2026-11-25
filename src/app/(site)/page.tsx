import { HomePage, homeMetadata } from "@/components/pages/home-page";

export const metadata = homeMetadata("ru");

export default function Page() {
  return <HomePage locale="ru" />;
}
