import { cn } from "@/lib/utils";

/** Заголовок внутренней страницы (с отступом под фиксированную шапку). */
export function PageIntro({
  title,
  lead,
  children,
  className,
}: {
  title: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container-site pt-32 pb-12 md:pt-44 md:pb-16", className)}>
      <h1 className="t-h1 max-w-4xl">{title}</h1>
      {lead && <p className="t-lead measure mt-6">{lead}</p>}
      {children}
    </section>
  );
}

/** Заголовок секции с необязательной ссылкой справа. */
export function SectionHeading({
  title,
  lead,
  action,
  id,
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 id={id} className="t-h2 max-w-3xl">
          {title}
        </h2>
        {lead && <p className="t-lead measure mt-4">{lead}</p>}
      </div>
      {action}
    </div>
  );
}
