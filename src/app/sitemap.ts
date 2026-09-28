import { MetadataRoute } from "next";
import { WBRE_CONFIG } from "@/lib/config";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = WBRE_CONFIG.url;

  const staticRoutes = [
    "",
    "/about",
    "/standards",
    "/how-it-works",
    "/records",
    "/categories",
    "/apply",
    "/application-status",
    "/verify",
    "/contact",
    "/privacy",
    "/terms",
    "/record-guidelines",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const [records, categories] = await Promise.all([
      prisma.record.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.recordCategory.findMany({ select: { slug: true } }),
    ]);

    const recordUrls = records.map((r) => ({
      url: `${baseUrl}/records/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    const categoryUrls = categories.map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...recordUrls, ...categoryUrls];
  } catch (e) {
    return staticRoutes;
  }
}
