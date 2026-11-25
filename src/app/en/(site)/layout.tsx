import { MaintenanceGate } from "@/components/maintenance";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MaintenanceGate locale="en">
      <SiteHeader locale="en" />
      <main id="main">{children}</main>
      <SiteFooter locale="en" />
    </MaintenanceGate>
  );
}
