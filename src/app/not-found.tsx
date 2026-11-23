import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="on-velvet velvet-texture flex min-h-svh items-center text-paper">
      <div className="container-site py-24">
        <p className="font-display text-brass">404</p>
        <h1 className="t-h1 mt-4 max-w-2xl">Такой страницы нет</h1>
        <p className="t-lead measure mt-5">Возможно, ссылка устарела. Начните с главной или сразу оставьте заявку.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-brass">
            На главную
          </Link>
          <Link href="/booking" className="btn btn-outline">
            Забронировать ведущего
          </Link>
        </div>
      </div>
    </main>
  );
}
