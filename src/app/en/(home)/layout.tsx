import { MaintenanceGate } from "@/components/maintenance";

/** Главная страница: шапку и подвал рисует сама страница (у дизайна «Сцена» они свои) */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <MaintenanceGate locale="en">{children}</MaintenanceGate>;
}
