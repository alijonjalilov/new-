import { HtmlLang } from "@/components/html-lang";

/** Английская версия: все страницы под /en */
export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en">
      <HtmlLang lang="en" />
      {children}
    </div>
  );
}
