import Link from "next/link";
import { lp, type Locale } from "@/i18n/config";
import { t } from "@/i18n/t";

export function BookingBand({ locale }: { locale: Locale }) {
  const tr = (s: string) => t(locale, s);
  return (
    <section className="on-velvet velvet-texture text-paper">
      <div className="container-site flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <div>
          <h2 className="t-h1 max-w-3xl">{tr("Расскажите о вашем событии")}</h2>
          <p className="t-lead measure mt-5">
            {tr("Ответьте на несколько вопросов — это займёт около трёх минут. Я свяжусь с вами, чтобы обсудить детали.")}
          </p>
        </div>
        <Link href={lp(locale, "/booking")} className="btn btn-brass shrink-0">
          {tr("Забронировать ведущего")}
        </Link>
      </div>
    </section>
  );
}
