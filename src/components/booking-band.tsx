import Link from "next/link";

export function BookingBand() {
  return (
    <section className="on-velvet velvet-texture text-paper">
      <div className="container-site flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <div>
          <h2 className="t-h1 max-w-3xl">Расскажите о вашем событии</h2>
          <p className="t-lead measure mt-5">
            Ответьте на несколько вопросов — это займёт около трёх минут. Я свяжусь с вами, чтобы обсудить детали.
          </p>
        </div>
        <Link href="/booking" className="btn btn-brass shrink-0">
          Забронировать ведущего
        </Link>
      </div>
    </section>
  );
}
