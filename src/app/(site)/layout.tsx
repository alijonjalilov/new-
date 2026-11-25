import { MaintenanceGate } from "@/components/maintenance";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MaintenanceGate locale="ru">
      <SiteHeader locale="ru" />
      <main id="main">{children}</main>
      <SiteFooter locale="ru" />
    </MaintenanceGate>
  );
}
