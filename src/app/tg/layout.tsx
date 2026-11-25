import { HtmlLang } from "@/components/html-lang";

/** Таджикская версия: все страницы под /tg */
export default function TgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="tg">
      <HtmlLang lang="tg" />
      {children}
    </div>
  );
}
