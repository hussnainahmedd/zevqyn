import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/resources";

const BASE = "https://zevqyn.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/features",
    "/how-it-works",
    "/about",
    "/founder",
    "/contact",
    "/resources",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
    "/disclaimer",
  ];
  const now = new Date();
  return [
    ...staticRoutes.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...ARTICLES.map((a) => ({
      url: `${BASE}/resources/${a.slug}`,
      lastModified: new Date(a.published + "T00:00:00"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
