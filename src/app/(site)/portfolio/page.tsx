import { PortfolioPage, portfolioMetadata } from "@/components/pages/portfolio-page";

export const metadata = portfolioMetadata("ru");

export default function Page() {
  return <PortfolioPage locale="ru" />;
}
