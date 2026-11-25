import { PortfolioPage, portfolioMetadata } from "@/components/pages/portfolio-page";

export const metadata = portfolioMetadata("en");

export default function Page() {
  return <PortfolioPage locale="en" />;
}
