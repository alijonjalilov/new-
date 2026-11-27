import { ensureContent } from "@/lib/content/store";
import { PortfolioPage, portfolioMetadata } from "@/components/pages/portfolio-page";

export const metadata = portfolioMetadata("tg");

export default async function Page() {
  await ensureContent();
  return <PortfolioPage locale="tg" />;
}
