# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for **Clinique du Bâtiment Inc.** — a Quebec residential renovation and disaster recovery company. Deployed at `cliniquedubatiment.ca` via GitHub Pages.

All copy is in **French (fr-CA)**. Quebec-specific context: RBQ license compliance, Montreal-area postal codes, 24h emergency service.

## Development

No build step. Open `index.html` directly in a browser to develop locally.

**Deploy:** Push to `main` branch — GitHub Pages auto-deploys.

## Architecture

Single-page site. All visible content lives in `index.html` (~2,000 lines). External styles in `style.css`, interactivity in `script.js`.

### Page sections (in order)

1. Utility bar — top strip with phone numbers and status badge
2. Sticky header — logo (links to phone), nav links, CTA buttons
3. Mobile menu — hamburger-driven, toggled by `script.js`
4. Hero — headline, stats (8 services / 24h / RBQ), SVG blueprint illustration, CTAs
5. About (`#about`) — company description
6. Services grid (`#services`) — 8 service cards
7. Renovation showcase (`#renovation`) — checklist of renovation steps
8. Emergency — urgent intervention CTA with phone card
9. Process (`#process`) — 5-step workflow
10. Testimonials (`#testimonials`) — 3 review cards
11. Zone (`#zone`) — coverage area and postal codes
12. Contact (`#contact`) — Formspree form + contact info card
13. Footer — 4-column mega footer, RBQ license, social/legal links

### CSS organization

`style.css` defines global CSS variables (`--primary`, `--secondary`, etc.) and component classes (`.btn`, `.card`, `.reveal`). `index.html` also contains a large block of inline `<style>` for layout-heavy sections — keep them consistent with the variables defined in `style.css`.

Responsive breakpoint: `768px` (mobile). Max container width: `1480px` (inline) / `1100px` (style.css).

### JavaScript (`script.js`)

- Mobile menu toggle with dynamic height/overflow styling
- Smooth scroll for `<a href="#...">` anchors + auto-close mobile menu
- Formspree AJAX form submission with French-language status messages and button state management
- `.reveal` elements use `IntersectionObserver` for scroll animations

### Form submission

Formspree endpoint sends to `info@cliniquedubatiment.ca` (CC to `crimaud@hotmail.com`). The action URL is set directly on the `<form>` element in `index.html`. Submission feedback is handled in `script.js`.

## Key files

| File | Purpose |
|---|---|
| `index.html` | Entire website content + inline styles/scripts |
| `style.css` | Global variables, component classes, responsive layout |
| `script.js` | Mobile menu, smooth scroll, form AJAX |
| `CNAME` | GitHub Pages custom domain (`cliniquedubatiment.ca`) |
| `logo.png` | Brand logo used in header and footer |
