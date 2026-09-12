export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3002";
}

export function validateProductionEnv(): string[] {
  const missing: string[] = [];
  if (process.env.NODE_ENV === "production") {
    if (!process.env.EXIFTOOL_PATH) {
      missing.push("EXIFTOOL_PATH");
    }
  }
  return missing;
}
