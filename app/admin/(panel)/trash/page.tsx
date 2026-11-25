import { prisma } from "@/lib/db";
import { formatDateRu } from "@/lib/booking/engine";
import { BookingList } from "@/components/admin/booking-list";
import { EmptyTrashButton } from "@/components/admin/empty-trash-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Корзина" };

export default async function TrashPage() {
  let rows;
  try {
    rows = await prisma.booking.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
      take: 500,
      select: {
        id: true,
        number: true,
        eventType: true,
        status: true,
        clientName: true,
        phone: true,
        city: true,
        guests: true,
        eventDate: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  } catch (error) {
    console.error("[admin/trash]", error);
    return (
      <div role="alert" className="rounded-3xl border border-danger/30 bg-white p-8">
        <h1 className="font-display text-2xl font-light">База данных недоступна</h1>
        <p className="mt-3 text-muted">Подробности — в логах сервера.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light tracking-tight">Корзина</h1>
          <p className="mt-2 text-muted">
            Удалённые заявки хранятся здесь, пока вы не удалите их навсегда. Их можно восстановить — они вернутся в список со
            всеми ответами.
          </p>
        </div>
        {rows.length > 0 && <EmptyTrashButton count={rows.length} />}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-muted">Корзина пуста.</div>
      ) : (
        <BookingList
          mode="trash"
          rows={rows.map((r) => ({
            id: r.id,
            number: r.number,
            eventType: r.eventType,
            status: r.status,
            clientName: r.clientName,
            phone: r.phone,
            city: r.city,
            guests: r.guests,
            eventDate: r.eventDate ? formatDateRu(r.eventDate.toISOString().slice(0, 10)) : null,
            createdAt: r.createdAt.toLocaleDateString("ru-RU"),
            deletedAt: r.deletedAt ? r.deletedAt.toLocaleDateString("ru-RU") : null,
          }))}
        />
      )}
    </div>
  );
}
