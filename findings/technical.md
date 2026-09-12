# Technical SEO Audit — clearmeta.srv1673464.hstgr.cloud

**Audit date:** 2026-09-13  
**URL audited:** https://clearmeta.srv1673464.hstgr.cloud  
**Method:** Live HTTP fetches (curl / Python urllib), HTML source inspection  
**Technical SEO score:** **68 / 100**

---

## Executive Summary

The site is crawlable, served over valid HTTPS with Next.js static prerendering (content visible without JS execution). `robots.txt` and `sitemap.xml` are present and well-structured, including AI-crawler directives. The biggest gaps are **missing canonical tags**, a **404 URL listed in the sitemap** (`/verify`), **duplicate URL variants** that all return 200, and **missing HSTS / structured data / social preview images**.

---

## Category Results

| Category | Status | Score |
|---|---|---|
| Crawlability | ⚠️ Partial | 82 |
| Indexability | ❌ Fail | 52 |
| Security (HTTPS & headers) | ⚠️ Partial | 72 |
| URL Structure | ⚠️ Partial | 74 |
| Mobile | ✅ Pass | 92 |
| Core Web Vitals (source signals) | ⚠️ Partial | 76 |
| Structured Data | ❌ Fail | 38 |
| JavaScript Rendering | ✅ Pass | 88 |
| Hreflang | ✅ N/A (single locale) | 100 |
| IndexNow | ❌ Not implemented | 20 |

---

## What Works Well

- **HTTPS enforced** — `http://` requests return `301` → `https://clearmeta.srv1673464.hstgr.cloud/` (verified via live GET).
- **Valid TLS certificate** — Let's Encrypt, CN `clearmeta.srv1673464.hstgr.cloud`, SAN matches hostname.
- **robots.txt is comprehensive** — Declares sitemap, blocks `/api/`, `/report/`, `/app/deep-clean`, and includes per-bot rules for GPTBot, ClaudeBot, Google-Extended, PerplexityBot, etc.
- **sitemap.xml is live** — 11 URLs, valid XML, `lastmod` timestamps present, served as `application/xml` with HTTP 200.
- **Server-side rendering / prerender** — Homepage returns ~75 KB HTML with primary H1 and body copy in initial response; `x-nextjs-prerender: 1` header confirms SSG. No CSR shell detected.
- **Mobile viewport** — `<meta name="viewport" content="width=device-width, initial-scale=1"/>` on all tested pages.
- **Baseline security headers** — `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` present (configured in `next.config.ts`).
- **AI discoverability** — `/llms.txt` returns 200 with product documentation for LLM crawlers.
- **Long-cache static pages** — `cache-control: s-maxage=31536000` on prerendered pages (CDN-friendly).

---

## Prioritized Issues

### Critical

| # | Issue | Evidence | Recommendation |
|---|---|---|---|
| C1 | **Sitemap lists a 404 URL** | `https://clearmeta.srv1673464.hstgr.cloud/verify` → HTTP **404**, title `404: This page could not be found.` Sitemap entry has `priority: 0.8`. | Fix `/verify` route deployment (page exists in codebase at `src/app/verify/page.tsx`) or remove from `src/app/sitemap.ts` until live. Resubmit sitemap after fix. |
| C2 | **No canonical tags on any page** | Tested `/`, `/app`, `/pricing`, `/faq`, `/privacy`, `/terms`, `/remove-chatgpt-metadata` — zero `<link rel="canonical">` in HTML. `metadataBase` is set in layout but `alternates.canonical` is not. | Add per-page canonicals via Next.js Metadata API: `alternates: { canonical: '/pricing' }` in each `page.tsx`, or a shared helper. Ensures `/` vs trailing-slash vs query-param variants consolidate. |

### High

| # | Issue | Evidence | Recommendation |
|---|---|---|---|
| H1 | **Duplicate URL variants all return 200** | `https://clearmeta.srv1673464.hstgr.cloud`, `…/`, `…//`, `…/?utm_source=test` — all HTTP 200, no canonical, no redirect normalization. | Pick one preferred format (recommend trailing slash or none, consistently). Add middleware redirect for `//` → `/`. Canonical tags (C2) are the primary fix; optional 301 from non-preferred variant. |
| H2 | **Missing Strict-Transport-Security (HSTS)** | Response headers on `/` contain no `strict-transport-security`. | Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` via `next.config.ts` headers or reverse proxy (Hostinger). |
| H3 | **No `og:image` or `twitter:image` on any tested page** | Homepage, `/pricing`, `/remove-chatgpt-metadata`, `/faq` — all missing social preview images. Only `twitter:card=summary` (no large image card). | Add `openGraph.images` and `twitter.images` in root `layout.tsx` metadata (1200×630 PNG/WebP). Critical for link-share CTR and rich-result eligibility. |
| H4 | **Duplicate page titles** | `/` title: `ClearMeta — Remove AI Image Metadata`; `/app` title: identical string. | Give `/app` a unique title, e.g. `Upload & Remove Metadata — ClearMeta App`. Reduces title-level duplicate signals. |

### Medium

| # | Issue | Evidence | Recommendation |
|---|---|---|---|
| M1 | **No JSON-LD structured data** | Homepage HTML contains 0 `<script type="application/ld+json">` blocks. | Add `WebSite` + `SoftwareApplication` (or `WebApplication`) schema on homepage; `FAQPage` on `/faq`; `Product` or `Offer` on `/pricing`. |
| M2 | **Missing Content-Security-Policy** | No `content-security-policy` header in live responses. | Implement a restrictive CSP (start report-only) via Next.js headers or Hostinger proxy. Coordinate with Clerk and any third-party scripts. |
| M3 | **Missing `og:url`** | OG tags present (`og:title`, `og:description`, `og:site_name`, `og:locale`, `og:type`) but no `og:url`. | Set `openGraph.url` in metadata or rely on canonical once added. |
| M4 | **Heavy client JS bundle (INP risk)** | Homepage ships 13 async `<script>` chunks plus RSC payload; Clerk auth middleware adds `x-clerk-auth-*` headers on every response. | Audit bundle with `@next/bundle-analyzer`. Defer non-critical scripts. Monitor INP in CrUX after launch on production domain. |
| M5 | **Staging hostname indexed** | Site runs on `*.hstgr.cloud` subdomain; `llms.txt` references production `clearmeta.app`. Content also mentions `clearmeta.app` in body copy. | If this is a staging environment, add `robots: { index: false }` sitewide or restrict via Hostinger access controls. Point `NEXT_PUBLIC_SITE_URL` to final production domain before launch. |

### Low

| # | Issue | Evidence | Recommendation |
|---|---|---|---|
| L1 | **IndexNow not configured** | `/indexnow-key.txt` → HTTP 404. No IndexNow submission endpoint detected. | Optional: publish key file and submit sitemap to Bing/Yandex IndexNow API on deploy. |
| L2 | **Auth pages indexable** | `/sign-in` and `/sign-up` return HTTP 200 with no `noindex`. Not in sitemap (good) but crawlable. | Add `robots: { index: false, follow: false }` to Clerk auth route metadata. |
| L3 | **No favicon link in HTML** | No `<link rel="icon">` detected in homepage `<head>`. | Add `icons` to Next.js metadata export. |
| L4 | **`/report/` disallowed but not routed** | `robots.txt` disallows `/report/`; `/report/test` returns 404. | No action needed unless route is planned — current state is safe. |

### Info

| # | Note | Evidence |
|---|---|---|
| I1 | **Hreflang not applicable** | `<html lang="en">`; no `hreflang` alternate links. Single-locale site — correct as-is. |
| I2 | **AI crawler management is proactive** | `robots.txt` has explicit Allow/Disallow blocks per AI bot (GPTBot, ClaudeBot, etc.) and references `/llms.txt`. |
| I3 | **www subdomain not configured** | `www.clearmeta.srv1673464.hstgr.cloud` fails TLS (self-signed / no cert). Expected for Hostinger subdomain; ensure www only matters on production apex domain. |

---

## Detailed Category Analysis

### 1. Crawlability — ⚠️ Partial (82)

**robots.txt** (`GET /robots.txt` → 200):
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /report/
Disallow: /app/deep-clean
Sitemap: https://clearmeta.srv1673464.hstgr.cloud/sitemap.xml
Host: clearmeta.srv1673464.hstgr.cloud
```

**sitemap.xml** — 11 URLs, all using absolute HTTPS URLs on the staging host. One URL (`/verify`) returns 404.

**Sitemap URL status check:**

| URL | Status |
|---|---|
| `/` | 200 |
| `/app` | 200 |
| `/verify` | **404** |
| `/pricing` | 200 |
| `/remove-chatgpt-metadata` | 200 |
| `/remove-c2pa-metadata` | 200 |
| `/remove-synthid-metadata` | 200 |
| `/privacy` | 200 |
| `/terms` | 200 |
| `/security` | 200 |
| `/faq` | 200 |

No `X-Robots-Tag` headers on tested pages. No `<meta name="robots">` noindex on public pages.

### 2. Indexability — ❌ Fail (52)

- **Canonical tags:** Absent on all 7 tested pages.
- **Duplicate URLs:** Bare domain, trailing slash, double slash, and UTM query strings all serve 200 with identical lack of canonical consolidation.
- **Duplicate titles:** `/` and `/app` share the same `<title>`.
- **Thin content risk on `/app`:** ~608 chars visible text vs ~2,960 on homepage (tool UI page — acceptable if uniquely titled/canonicalized).

### 3. Security — ⚠️ Partial (72)

| Header | Present |
|---|---|
| HTTPS (TLS 1.2+) | ✅ |
| `strict-transport-security` | ❌ |
| `content-security-policy` | ❌ |
| `x-content-type-options: nosniff` | ✅ |
| `x-frame-options: SAMEORIGIN` | ✅ |
| `referrer-policy: strict-origin-when-cross-origin` | ✅ |
| `permissions-policy` | ✅ |
| `x-powered-by` | ✅ Absent (`poweredByHeader: false`) |

### 4. URL Structure — ⚠️ Partial (74)

- Clean, lowercase, hyphenated paths (`/remove-chatgpt-metadata`).
- HTTP → HTTPS redirect works (301).
- No redirect normalization for trailing slash or double-slash variants.
- `/index.html` → 404 (acceptable).

### 5. Mobile — ✅ Pass (92)

- Viewport meta present and correct.
- Responsive Next.js layout with `width=device-width, initial-scale=1`.
- No separate m. subdomain (not needed).

### 6. Core Web Vitals — ⚠️ Partial (76, lab/source signals only)

| Metric | Assessment | Signals |
|---|---|---|
| **LCP** | Likely Good | SSG HTML; font preloaded (`preload` for woff2); no hero `<img>` in initial HTML (text-first LCP candidate). |
| **INP** | Needs monitoring | 13 async scripts, Clerk middleware on all routes, RSC hydration payload. Field data unavailable on staging host. |
| **CLS** | Likely Good | No `<img>` without dimensions detected; layout appears text/component-driven. |

*Field CWV data (CrUX) not available for this staging subdomain.*

### 7. Structured Data — ❌ Fail (38)

- No JSON-LD detected.
- Open Graph partial: `og:title`, `og:description`, `og:site_name`, `og:locale`, `og:type` — missing `og:url`, `og:image`.
- Twitter Card: `summary` only, no image.

### 8. JavaScript Rendering — ✅ Pass (88)

- Next.js App Router with static prerender (`x-nextjs-prerender: 1`, `x-nextjs-cache: HIT`).
- Primary content (`<h1>Strip AI metadata from your images in seconds</h1>`) present in raw HTML.
- Crawlers that do not execute JS will index main marketing copy.

### 9. Hreflang — ✅ N/A

- Single language (`lang="en"`).
- No international alternates required.

### 10. IndexNow — ❌ Not implemented

- No key file, no submission detected.

---

## Recommended Implementation Order

1. **Fix `/verify` 404** or remove from sitemap (Critical — wastes crawl budget, generates GSC errors).
2. **Add canonical tags** sitewide via Next.js `alternates.canonical` (Critical — fixes duplicate URL risk).
3. **Add HSTS header** (High — security + SEO trust signal).
4. **Add `og:image` + JSON-LD** (High/Medium — social sharing and rich results).
5. **Unique titles for `/app`** and auth `noindex` (High/Low).
6. **Normalize URL variants** via middleware + canonicals (High).
7. **Decide staging vs production indexing policy** before pointing `clearmeta.app` (Medium).
8. **IndexNow** on production launch (Low).

---

## JSON Findings (audit-data compatible)

```json
{
  "category": "technical_seo",
  "score": 68,
  "url": "https://clearmeta.srv1673464.hstgr.cloud",
  "audited_at": "2026-09-13",
  "findings": [
    { "id": "C1", "severity": "critical", "title": "Sitemap contains 404 URL /verify", "status": "open" },
    { "id": "C2", "severity": "critical", "title": "No canonical tags on any page", "status": "open" },
    { "id": "H1", "severity": "high", "title": "Duplicate URL variants return 200 without consolidation", "status": "open" },
    { "id": "H2", "severity": "high", "title": "Missing HSTS header", "status": "open" },
    { "id": "H3", "severity": "high", "title": "Missing og:image and twitter:image", "status": "open" },
    { "id": "H4", "severity": "high", "title": "Duplicate title on / and /app", "status": "open" },
    { "id": "M1", "severity": "medium", "title": "No JSON-LD structured data", "status": "open" },
    { "id": "M2", "severity": "medium", "title": "Missing Content-Security-Policy", "status": "open" },
    { "id": "M3", "severity": "medium", "title": "Missing og:url", "status": "open" },
    { "id": "M4", "severity": "medium", "title": "Heavy JS bundle — INP risk", "status": "open" },
    { "id": "M5", "severity": "medium", "title": "Staging host may be indexable before production launch", "status": "open" },
    { "id": "L1", "severity": "low", "title": "IndexNow not configured", "status": "open" },
    { "id": "L2", "severity": "low", "title": "Auth pages lack noindex", "status": "open" },
    { "id": "L3", "severity": "low", "title": "No favicon in HTML head", "status": "open" }
  ],
  "passes": [
    "HTTPS with valid certificate",
    "robots.txt with sitemap and AI bot rules",
    "sitemap.xml live and valid XML",
    "Next.js SSG prerender — content in HTML",
    "Mobile viewport configured",
    "Baseline security headers present",
    "llms.txt available for AI crawlers"
  ]
}
```
