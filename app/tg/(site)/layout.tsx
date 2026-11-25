import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader locale="tg" />
      <main id="main">{children}</main>
      <SiteFooter locale="tg" />
    </>
  );
}
