# ClearMeta SEO Action Plan

**Health score today:** 58/100  
**Target after Phase 1:** 68–72/100

---

## Phase 1: Critical Fixes (Week 1)

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| Critical | Remove `/verify` from `sitemap.ts` OR add public landing page before Clerk gate | 1–2 hrs | Fixes broken sitemap URL |
| Critical | Add `alternates.canonical` to all indexable pages | 2 hrs | Stops duplicate URL dilution |
| Critical | Add JSON-LD: Organization + WebSite + SoftwareApplication in `layout.tsx` | 2–4 hrs | Entity recognition + rich results |
| Critical | Add FAQPage JSON-LD on `/faq` | 1 hr | FAQ rich results + AI citation |
| Critical | Defer ClerkProvider/Clerk JS on `/`, SEO pages, `/pricing` | 4–6 hrs | ~2s LCP improvement |

---

## Phase 2: High-Impact (Weeks 2–3)

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| High | Unique metadata for `/app` (`src/app/app/page.tsx`) | 30 min | Stops title duplication |
| High | Fix title template — remove `— ClearMeta` from page titles OR use `absolute` | 1 hr | Fixes `ClearMeta \| ClearMeta` |
| High | Add `noindex` to `/sign-in` and `/sign-up` | 30 min | Stops thin auth page indexing |
| High | Expand `/remove-chatgpt-metadata`, `/remove-c2pa-metadata`, `/remove-synthid-metadata` to 600+ words | 1–2 days | Topical depth for rankings |
| High | Expand `/pricing` with plan comparison + billing FAQ | 4 hrs | Commercial intent coverage |
| High | Add HSTS header via Traefik | 30 min | Security + minor SEO trust |
| Medium | Add `og:image` (1200×630) + fix favicon 404 | 2 hrs | Social + brand previews |
| High | Point `NEXT_PUBLIC_SITE_URL` to `clearmeta.app` and launch production domain | 1 day | E-E-A-T + indexation |

---

## Phase 3: Content & Authority (Month 2)

- Add `/about` page with operator identity
- Expand FAQ answers to 134–167 word self-contained blocks
- Link SEO landing pages from homepage body (not just footer)
- Add outbound links to C2PA/OpenAI/Adobe primary sources
- Update `llms.txt` URLs to match production domain
- Build brand presence (Reddit demos, YouTube walkthrough, third-party mentions)

---

## Phase 4: Monitoring (Ongoing)

- Submit sitemap in Google Search Console on production domain
- Monitor CrUX field data once traffic exists
- Track indexation for `/remove-*` intent pages
- Store drift baseline: `claude-seo run drift_history.py https://clearmeta.app`

---

## Files to Edit (Codebase Map)

| Fix | File |
|-----|------|
| Remove /verify from sitemap | `src/app/sitemap.ts` |
| Canonical tags | Page `metadata` exports + `src/app/layout.tsx` |
| JSON-LD | `src/app/layout.tsx`, `src/app/faq/page.tsx` |
| /app unique meta | `src/app/app/page.tsx` |
| Title template | `src/app/layout.tsx` |
| Auth noindex | `src/app/sign-in/[[...sign-in]]/page.tsx`, sign-up page |
| Clerk deferral | `src/app/layout.tsx`, `src/components/auth-buttons.tsx` |
| llms.txt domain | `public/llms.txt` |
