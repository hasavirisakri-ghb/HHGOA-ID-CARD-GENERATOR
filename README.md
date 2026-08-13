# HH Goa 2026 — PFP Frame Generator

Upload a photo, pick one of three HH Goa 2026 frame styles, add your name/handle, and get a
branded 1080×1080 profile picture — ready to download or share straight to X with `#FrameInGoa`.

No login, no signup gate — upload → frame → download/share in one pass.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

- `app/page.js` — upload/crop/customize screen (photo upload incl. HEIC, live cropper, template
  picker, name/handle fields).
- `lib/frameRenderer.js` — composites the cropped photo + chosen frame PNG + text badges onto a
  1080×1080 `<canvas>` and exports a real downloadable PNG.
- `app/result/page.js` — download button, and a Share to X button that uses the Web Share API to
  attach the generated image directly (falls back to a pre-filled tweet composer on browsers
  without file-sharing support).
- `app/opengraph-image.js` — generates the OG/Twitter link-preview image for the tool itself.

## Regenerating frame templates

`scripts/process-frames.mjs` punches the circular photo-hole into a source frame image and
exports it as WebP (kept small for mobile speed) into `public/frames/`.

## Deploying

Set `NEXT_PUBLIC_SITE_URL` to your production URL if you're not deploying on Vercel, so the
Open Graph / Twitter card image tags resolve to an absolute URL instead of `localhost`.
