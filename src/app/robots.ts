import { MetadataRoute } from "next";
import { WBRE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/"],
    },
    sitemap: `${WBRE_CONFIG.url}/sitemap.xml`,
  };
}
