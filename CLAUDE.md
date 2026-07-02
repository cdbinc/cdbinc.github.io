# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for **Clinique du Bâtiment CDB Inc.** — a Quebec residential renovation and disaster recovery company. Deployed at `cliniquedubatiment.ca` via GitHub Pages (repo `cdbinc/cdbinc.github.io`).

All copy is in **French (fr-CA)**. Quebec-specific context: RBQ license 5821-2606-01, Montreal-area postal codes, 24/7 emergency service.

**IMPORTANT — this repo is public.** Everything committed to `main` is downloadable by anyone (including PDFs, APKs, and any tokens in JS files). Never commit secrets or internal documents.

## Development

No build step. Open `index.html` directly in a browser to develop locally.

**Deploy:** Push to `main` branch — GitHub Pages auto-deploys.

## Architecture

The public marketing site is `index.html` (~1,800 lines) + `services/*.html` + `mentions-legales.html`. The repo also contains internal apps and tooling (`monchantier/`, `dispatch/`, `studio/`, `signer/`, `payer/`, `cdb/`, `functions/`, `dataconnect/`, `app/`) that are NOT part of the marketing site — do not touch them for website tasks.

### Page sections of index.html (in order)

1. Utility bar — top strip with phone numbers and RBQ license
2. Sticky header — logo (links to home `/`), nav links, CTA buttons
3. Mobile menu — hamburger-driven, toggled by inline JS
4. Hero — headline, stats (8 services / 24h / RBQ), SVG blueprint illustration, CTAs
5. Marquee — scrolling service list
6. About (`#about`) — company description + values
7. Services grid (`#services`) — 8 service cards (3 link to `services/*.html`)
8. Renovation showcase (`#renovation`) — pillars + included checklist
9. Emergency — urgent intervention CTA with phone card
10. Process (`#process`) — 5-step workflow
11. Testimonials (`#testimonials`) — 3 review cards
12. Portfolio (`#portfolio`) — 26 photos, category filters + lightbox
13. Zone (`#zone`) — coverage area, postal codes, SVG map
14. FAQ (`#faq`) — 6 questions (mirrored in FAQPage JSON-LD)
15. Contact (`#contact`) — FormSubmit form + contact info card
16. Footer — 4-column mega footer, RBQ license, social/legal links

### CSS organization

`style.css` defines global CSS variables (`--paper`, `--ink`, `--accent`, etc.) and component classes (`.btn`, `.svc`, `.reveal`). `index.html` also contains inline styles for layout-heavy sections — keep them consistent with the variables defined in `style.css`.

Responsive breakpoint: `768px` (mobile). Max container width: `1480px`.

### JavaScript

All production JS is **inline in `index.html`** just before `</body>` (`script.js` is a reference stub only — do not restore old `.bak` versions). Inline modules:

- Scroll reveal (`IntersectionObserver` on `.reveal`)
- Mobile menu (burger toggle + Escape)
- Checkbox active state (`.check input`)
- Success banner after redirect (`?envoye=1`)
- CC injection for the form (assembled in JS so the address isn't in static HTML)
- Phone number auto-formatting
- Portfolio: category filters + accessible lightbox (←/→/Échap)
- Scroll-spy for active nav link

### Form submission

**FormSubmit.co** (not Formspree) posts to `info@cliniquedubatiment.ca`. The action URL is on the `<form id="quoteForm">` in `index.html`. Anti-spam: hidden `_honey` honeypot field. A `_cc` copy to a personal address is injected by inline JS at load time — keep it out of the static HTML. After submit, FormSubmit redirects to `/?envoye=1#contact`, which triggers the inline success banner.

### SEO

JSON-LD: `HomeAndConstructionBusiness` + `FAQPage` in `<head>`. Do NOT add `aggregateRating` unless real, on-page, markup-verifiable reviews exist. `sitemap.xml` and `robots.txt` at root — update `sitemap.xml` `lastmod` when pages change.

## Key files

| File | Purpose |
|---|---|
| `index.html` | Entire homepage content + inline styles/scripts |
| `services/*.html` | 3 service landing pages (après-sinistre, salle de bain, finition) |
| `mentions-legales.html` | Legal / privacy / terms |
| `style.css` | Global variables, component classes, responsive layout |
| `script.js` | Reference stub only — production JS is inline in index.html |
| `sitemap.xml` / `robots.txt` | SEO |
| `CNAME` | GitHub Pages custom domain (`cliniquedubatiment.ca`) |
| `logo.png` | Brand logo (240×240, optimized ~26 KB) used in header, footer, favicon, JSON-LD |
| `images/` | Portfolio photos (WebP, lazy-loaded, descriptive French alt text) |
