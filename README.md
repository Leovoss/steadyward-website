# SteadyHand website

Static marketing site for SteadyHand, a read-only behavioural retention layer for MT4/MT5 brokers.

- `index.html` — the landing page (self-contained: Tailwind CDN, fonts, embedded hero image, ROI calculator, cookie consent + consent-gated Plausible analytics)
- `privacy.html`, `cookies.html`, `terms.html` — legal pages
- `images/` — source imagery

## Hosting
Pure static HTML, no build step. Deploy by serving the folder (GitHub Pages, Cloudflare Pages, or Netlify).

## Before public launch
- Remove the `noindex` meta tag in `index.html`
- Fill placeholders: legal entity name + address (privacy/terms), founder name + LinkedIn, real Calendly link, real or removed testimonial
- Add the domain in Plausible (or swap analytics)
- Ensure `ratko@steadyhand.app` receives mail
