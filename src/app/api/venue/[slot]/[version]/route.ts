import { prisma } from "@/lib/db";
import { isVenueSlot } from "@/lib/home-design";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Отдаёт фото площадки из базы. Адрес содержит версию, поэтому кэшируем надолго. */
export async function GET(_req: Request, { params }: { params: Promise<{ slot: string; version: string }> }) {
  const { slot } = await params;
  if (!isVenueSlot(slot)) return new Response("Not found", { status: 404 });
  const photo = await prisma.venuePhoto.findUnique({ where: { slot } }).catch(() => null);
  if (!photo) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(photo.data), {
    headers: {
      "content-type": photo.mime,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
