import type { MetadataRoute } from "next";
import { eventCategories } from "@/content/events";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/booking", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/events", priority: 0.8 },
    { path: "/portfolio", priority: 0.7 },
    { path: "/reviews", priority: 0.6 },
    { path: "/contacts", priority: 0.7 },
    ...eventCategories.map((c) => ({ path: `/events/${c.slug}`, priority: 0.7 })),
  ];
  return pages.map((p) => ({ url: `${base}${p.path}`, lastModified: now, changeFrequency: "monthly" as const, priority: p.priority }));
}
