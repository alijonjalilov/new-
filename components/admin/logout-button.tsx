"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
        router.replace("/admin/login");
        router.refresh();
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 hover:bg-paper-2"
    >
      <LogOut aria-hidden className="size-4" />
      Выйти
    </button>
  );
}
