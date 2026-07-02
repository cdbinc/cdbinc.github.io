# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static single-page marketing site for **ChantierOS** (a local-AI back-office suite for RBQ-licensed construction contractors in Quebec), hosted on GitHub Pages with the custom domain `monchantier.store` (see `CNAME`). A product of iD01t Productions.

There is **no build step, no package manager, no framework, no tests**. Everything — HTML, CSS, and JavaScript — lives in a single `index.html` (~1,800 lines). Deployment is simply pushing to the GitHub Pages repository.

To preview locally: open `index.html` in a browser, or serve the folder (`python -m http.server`).

## Architecture of index.html

The file is organized top to bottom:

1. `<head>`: meta/OG tags, JSON-LD structured data (`SoftwareApplication` with CAD pricing, `Organization`, `FAQPage`)
2. A single `<style>` block (design tokens in `:root`, then per-section styles)
3. Body sections, in order: nav → hero (`<header>`) → trust bar → stats strip → `#probleme` → `#solution` → `#fonctionnalites` → `#roi` → comparison → `#prix` → `#preuves` (showcase) → `#faq` → CTA → `#contact` (form) → footer → sticky CTA → lightbox
4. A single `<script>` block at the end: i18n engine, scroll/nav behavior, reveal animations, counters, decorative terminal animation, FAQ accordion, lightbox, contact form handler, cursor spotlight

## Bilingual i18n system (the critical thing to get right)

**French is the source language, written inline in the HTML. English lives only in the `I18N_EN` dictionary** at the top of the `<script>` block (~line 1421).

- Translatable elements carry `data-i18n="key"`; form placeholders use `data-i18n-ph` (keys in `I18N_EN_PH`). On load, the inline French is captured into `FR_STORE`, and `setLang()` swaps `innerHTML` between the stores. The choice persists in `localStorage` under `chantieros-lang`.
- **Any copy change must be made in two places**: the inline French HTML *and* the matching `I18N_EN` entry. A new translatable element needs a `data-i18n` attribute plus a new EN key, or it will silently stay French in EN mode.
- FAQ content lives in **three places** that must stay in sync: the JSON-LD `FAQPage` in `<head>` (FR), the `#faq` section markup (FR), and the `faq.q*`/`faq.a*` keys in `I18N_EN`.
- Pricing appears in the JSON-LD offers, the `#prix` section, the contact form's `interet` options, and `I18N_EN` — sync all of them when prices change.
- Language-specific blocks: CSS shows/hides via `html[lang="fr-CA"]`/`html[lang="en-CA"]` selectors (`.fr-only`/`.en-only`, and the FR/EN hero banners `img/hero-banner*.png|webp` vs `img/hero-banner-en*`). `setLang()` sets `document.documentElement.lang`.
- Some `I18N_EN` values contain HTML (`<em>`, `<strong>`, `<br>`) since they are injected with `innerHTML` — keep markup consistent with the French counterpart.

## Other conventions

- JS behaviors are attribute-driven: `data-reveal` (+ `data-reveal-delay="1..5"`) for scroll-in animations, `.counter[data-target]` for animated numbers, `data-lightbox="img/..."` for the image lightbox, `data-set-lang` for the language toggle.
- The contact form posts via AJAX to Formspree (`https://formspree.io/f/xkgdzkeq`) with a `mailto:itechinfomtl@gmail.com` fallback shown on failure. Form field names are French (`prenom`, `nom`, `entreprise`, `interet`...) and are referenced by name in the fallback-body builder.
- Motion respects `prefers-reduced-motion` and `hover: none` (cursor spotlight is skipped); keep that pattern for new effects.
- Copy makes deliberate legal/compliance distinctions (RBQ "guardrails" not guaranteed compliance, "reference deployment" wording, anonymized demo data). Preserve these nuances when editing marketing text in either language.
- **`https://monchantier.store/` is the primary and canonical domain.** All absolute URLs (canonical, `og:*`, `twitter:*`, JSON-LD, `sitemap.xml`) must use it. A duplicate deployment exists at `cliniquedubatiment.ca/monchantier/` — it should redirect here, never the other way around.
