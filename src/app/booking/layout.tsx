import { MaintenanceGate } from "@/components/maintenance";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <MaintenanceGate locale="ru">{children}</MaintenanceGate>;
}
