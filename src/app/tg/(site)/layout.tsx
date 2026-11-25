import { MaintenanceGate } from "@/components/maintenance";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MaintenanceGate locale="tg">
      <SiteHeader locale="tg" />
      <main id="main">{children}</main>
      <SiteFooter locale="tg" />
    </MaintenanceGate>
  );
}
