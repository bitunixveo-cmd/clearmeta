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
        allow: ["/", "/llms.txt", "/remove-chatgpt-metadata", "/remove-c2pa-metadata", "/faq"],
        disallow: ["/api/", "/app/deep-clean"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/llms.txt", "/faq"],
        disallow: ["/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/app/deep-clean"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/llms.txt", "/faq", "/remove-c2pa-metadata"],
        disallow: ["/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/llms.txt", "/faq"],
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
