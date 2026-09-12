import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
  keywords,
}: PageMetadataOptions): Metadata {
  const url = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
