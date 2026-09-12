import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ClerkGate } from "@/components/clerk-gate";
import { JsonLd } from "@/components/json-ld";
import { getSiteUrl } from "@/lib/env";
import { organizationSchema } from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClearMeta — Remove AI Image Metadata",
    template: "%s | ClearMeta",
  },
  description:
    "Strip C2PA Content Credentials, EXIF, and XMP AI tags from ChatGPT, DALL·E, Midjourney, and other AI-generated images. Fast, private, server-side processing with auto-delete.",
  keywords: [
    "AI metadata remover",
    "C2PA remover",
    "remove ChatGPT metadata",
    "Content Credentials",
    "EXIF cleaner",
    "SynthID detector",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClearMeta",
    url: siteUrl,
    title: "ClearMeta — Remove AI Image Metadata",
    description:
      "Strip C2PA, EXIF, and XMP AI tags from generated images. Free automatic processing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearMeta — Remove AI Image Metadata",
    description:
      "Strip C2PA, EXIF, and XMP AI tags from generated images. Free automatic processing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <JsonLd data={organizationSchema()} />
        <ClerkGate>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClerkGate>
      </body>
    </html>
  );
}
