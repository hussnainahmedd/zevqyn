import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/", "/admin/", "/login", "/register"],
      },
    ],
    sitemap: "https://zevqyn.dev/sitemap.xml",
  };
}
