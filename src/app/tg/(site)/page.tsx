import { HomePage, homeMetadata } from "@/components/pages/home-page";

export const metadata = homeMetadata("tg");

export default function Page() {
  return <HomePage locale="tg" />;
}
