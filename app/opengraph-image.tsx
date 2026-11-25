import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Генерирует превью для соцсетей (Open Graph). Текст латиницей —
// встроенный шрифт ImageResponse не содержит кириллицы.
// Чтобы использовать своё фото, положите /public/og.jpg и удалите этот файл,
// а в layout.tsx добавьте openGraph.images.
export const alt = `${site.hostNameLatin}, journalist and event host`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "linear-gradient(135deg, #2a1e3b 0%, #3a2a51 100%)",
          color: "#fafaf8",
        }}
      >
        <div style={{ fontSize: 120, letterSpacing: -4, lineHeight: 1 }}>{site.hostNameLatin}</div>
        <div style={{ fontSize: 40, color: "#c9a66b", marginTop: 28 }}>Journalist, TV host, wedding and event host</div>
      </div>
    ),
    size,
  );
}
