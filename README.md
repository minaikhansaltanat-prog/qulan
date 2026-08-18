# Quan Travel

Single-page marketing site for **Quan Travel** — guided tours from Kazakhstan to China (Zhangjiajie, Shanghai, Chongqing, Xi'an, Guangzhou, Hong Kong, Chengdu). Built as one self-contained `index.html` (Tailwind CDN + GSAP), fully localized in Kazakh / Russian / English / Chinese.

## Run locally

```bash
npm install
node serve.mjs
```

Then open `http://localhost:3000`.

## Structure

- `index.html` — the entire site (markup, styles, i18n dictionary, and behavior)
- `serve.mjs` — tiny static file server used for local development
- `screenshot.mjs` — Puppeteer screenshot helper for visual QA (`node screenshot.mjs http://localhost:3000 [label]`)
- `logo/` — brand logo + favicon
- `Photo/web/` — optimized photos used by the site
- `Video/web/` — compressed hero background videos (7 clips, crossfade every 5s)
- `Video/gallery/` — compressed videos used in the video gallery / feature player
- `Video/posters/` — poster frames for the videos above

Raw/unoptimized source photos and videos are kept locally only (not committed) — the folders above contain the derivatives the site actually serves.

## Outstanding TODOs

A few links are placeholders (`href="#"`) pending real values, marked `TODO` in `index.html`:

- Telegram link (floating contact button)
- WeChat link (floating contact button)
- 2GIS office link (Reviews → 2GIS tab)

## Content notes

- Only verified facts are shown (87,600+ Instagram followers, Meta Verified, the 7 real destinations). No invented statistics, prices, or reviews.
- Only one tour has a confirmed price (480,000 ₸, Zhangjiajie + Chongqing); all others link to WhatsApp with a pre-filled inquiry message.
- The testimonials section is a clearly-labeled "coming soon" placeholder until real reviews are supplied.
