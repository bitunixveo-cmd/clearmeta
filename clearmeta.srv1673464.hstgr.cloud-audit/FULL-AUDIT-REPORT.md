# ClearMeta Full SEO Audit

**URL:** https://clearmeta.srv1673464.hstgr.cloud  
**Date:** September 13, 2026  
**Business type:** B2C SaaS — AI image metadata removal tool  
**Pages audited:** 12 (homepage, app, pricing, 3 SEO landings, FAQ, legal pages, auth pages)

---

## Executive Summary

### Overall SEO Health Score: **58 / 100**

| Category | Score | Weight | Weighted |
|----------|------:|-------:|---------:|
| Technical SEO | 68 | 22% | 15.0 |
| Content Quality | 52 | 23% | 12.0 |
| On-Page SEO | 58 | 20% | 11.6 |
| Schema / Structured Data | 22 | 10% | 2.2 |
| Performance (CWV) | 71 | 10% | 7.1 |
| AI Search Readiness | 58 | 10% | 5.8 |
| Images | 95 | 5% | 4.8 |
| **Total** | | **100%** | **58** |

### Top 5 Critical Issues

1. **`/verify` returns 404 to crawlers** but is in `sitemap.xml` and linked in header/footer
2. **No canonical tags** on any page — duplicate URL risk (`/` vs `/app`, staging vs production)
3. **Zero JSON-LD** — no Organization, SoftwareApplication, or FAQPage schema
4. **Thin SEO landing pages** — `/remove-*` pages are 120–150 words (target ~800)
5. **Staging domain indexed** — `hstgr.cloud` host while brand references `clearmeta.app`

### Top 5 Quick Wins

1. Remove `/verify` from sitemap until it returns 200 for bots
2. Add `alternates.canonical` per page in Next.js metadata
3. Add FAQPage + Organization JSON-LD (content already exists)
4. Give `/app` a unique title and description
5. Defer Clerk JS on marketing pages (est. ~2s LCP improvement)

---

## Technical SEO — 68/100

**Strengths:** HTTPS, Let's Encrypt, strong `robots.txt` (AI bot rules), live sitemap, Next.js prerender, security headers, `/llms.txt`.

**Issues:**
- `/verify` → 404 (Critical)
- No canonical tags (Critical)
- No HSTS (High)
- URL variants (`//`, `?utm_*`) all return 200 (High)
- Missing `og:image` (High)
- `/` and `/app` share identical title (High)

---

## Content Quality — 52/100

**Strengths:** Accurate C2PA/SynthID messaging, honest SynthID limitations, Privacy/Terms/Security pages, 1-hour auto-delete policy.

**Issues:**
- SEO landings critically thin (Critical)
- `/` vs `/app` duplicate meta (High)
- Title template produces `ClearMeta | ClearMeta` (High)
- No About page (High)
- Meta says "browser-based" but body says "processed on your server" (Medium)

---

## On-Page SEO — 58/100

**Strengths:** One H1 per page, meta descriptions on most pages, footer cross-links, FAQ question-format headings.

**Issues:**
- Sitemap includes broken `/verify` URL
- Auth pages indexable without `noindex`
- `/pricing` meta description too short (65 chars)
- Identical `lastmod` on all sitemap URLs

---

## Schema — 22/100

**Present:** OG tags, Twitter Card basics, sitemap.

**Missing:** All JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage, Offer on pricing).

---

## Performance — 71/100

| Metric | Value | Status |
|--------|-------|--------|
| LCP | 6.1s | Poor |
| CLS | 0.065 | Good |
| INP (est.) | ~70ms | Good |

**Root cause:** Clerk auth handshake redirect (~1.9s wasted) + 398KB Clerk JS on marketing pages. Server TTFB is fast (~100ms) when redirects excluded.

---

## AI Search Readiness — 58/100

**Strengths:** GPTBot/ClaudeBot/PerplexityBot allowed, well-structured `llms.txt`, SSR HTML.

**Issues:** Domain mismatch in `llms.txt`, thin passages, no schema, weak brand authority, FAQ answers too short for AI citation.

---

## Images — 95/100

No `<img>` alt defects. Decorative SVGs correctly marked. Missing `og:image` for social previews.

---

## Search Experience (SXO) Notes

- **Homepage intent match:** Good — hero and CTAs match "remove AI metadata" query intent
- **SEO landing pages:** Page type correct but content depth too thin to satisfy informational intent
- **`/app` as indexable URL:** Competes with homepage; consider canonical to `/` or unique positioning
- **Pricing page:** Functional but lacks comparison copy for commercial intent

---

## Positive Signals

- AI-focused `robots.txt` ahead of most competitors
- `llms.txt` with honest product limitations
- Legal/trust pages in place
- Core product messaging is technically credible
- Mobile rendering works well above the fold

---

## Score Projection

| Milestone | Projected Score |
|-----------|----------------|
| Current (staging) | **58** |
| After Phase 1 fixes | **68–72** |
| After production launch + content expansion | **75–82** |
