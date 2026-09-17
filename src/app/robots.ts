import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/report/", "/app/deep-clean"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/llms.txt", "/remove-ai-metadata", "/remove-chatgpt-metadata", "/remove-c2pa-metadata", "/remove-midjourney-metadata", "/remove-synthid-metadata", "/faq"],
        disallow: ["/api/", "/app/deep-clean"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: [
          "/",
          "/llms.txt",
          "/faq",
          "/remove-ai-metadata",
          "/remove-chatgpt-metadata",
          "/remove-c2pa-metadata",
        ],
        disallow: ["/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/app/deep-clean"],
      },
      {
        userAgent: "ClaudeBot",
        allow: [
          "/",
          "/llms.txt",
          "/faq",
          "/remove-ai-metadata",
          "/remove-c2pa-metadata",
          "/remove-chatgpt-metadata",
        ],
        disallow: ["/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: [
          "/",
          "/llms.txt",
          "/faq",
          "/remove-ai-metadata",
          "/remove-synthid-metadata",
        ],
        disallow: ["/api/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base.replace(/^https?:\/\//, ""),
  };
}
