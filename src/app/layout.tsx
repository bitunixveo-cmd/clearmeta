import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSiteUrl } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ClearMeta — Remove AI Image Metadata",
    template: "%s | ClearMeta",
  },
  description:
    "Strip C2PA Content Credentials, EXIF, and XMP AI tags from ChatGPT, DALL·E, Midjourney, and other AI-generated images. Fast, private, browser-based.",
  keywords: [
    "AI metadata remover",
    "C2PA remover",
    "remove ChatGPT metadata",
    "Content Credentials",
    "EXIF cleaner",
    "SynthID detector",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ClearMeta",
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
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/verify"
          signUpFallbackRedirectUrl="/verify"
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
