import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Source directory for freshly-generated frame art dropped into the repo before
// processing (see the image-gen prompts this project has used — ask in the repo
// history / PR descriptions for the exact prompt text used per frame).
//
// Before shipping any AI-generated frame, check all 4 corners at full zoom for a
// generator watermark (e.g. Gemini adds a small pale 4-point sparkle in a
// corner) — it's easy to miss at normal viewing size. hacker-beach-camp shipped
// with one initially; removed by compositing a small blurred circle of the
// surrounding flat background color over it (see git history on this file/PR
// for the exact patch — it's not part of this script since it's a one-off fix,
// not a repeatable processing step).
const SRC_DIR = './public/frames';
const OUT_DIR = './public/frames';

// `photoRadius` is optional and only needed when a frame's own art was drawn
// with its decorative ring at a different radius than the shared default (see
// DEFAULT_PHOTO_RADIUS in lib/frameRenderer.js, currently 430 out of a 540
// half-canvas). If omitted, the standard radius is used and must also be left
// unset on the matching entry in lib/templates.js.
const DEFAULT_PHOTO_RADIUS = 430;

const files = [
  // { name: 'tropical-cyber', src: 'source-tropical-cyber.jpg' },
  // { name: 'cyber-heritage', src: 'source-cyber-heritage.jpg' },
  { name: 'hacker-beach-camp', src: 'IMG_4402.png', photoRadius: 320 },
];

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function maskSvgFor(radius) {
  return Buffer.from(
    `<svg width="1080" height="1080">
      <circle cx="540" cy="540" r="${radius}" fill="white" />
    </svg>`
  );
}

async function processImages() {
  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file.src);
    const radius = file.photoRadius || DEFAULT_PHOTO_RADIUS;
    // WebP (not PNG) keeps the alpha-punched circle while staying ~10x smaller,
    // which matters for the "a few seconds, not a loading screen" speed requirement.
    const outPath = path.join(OUT_DIR, `${file.name}.webp`);

    console.log(`Processing ${file.name} (photo radius ${radius})...`);

    try {
      // Resize to 1080x1080 first just in case
      const resized = await sharp(srcPath).resize(1080, 1080).toBuffer();

      await sharp(resized)
        // ensure alpha channel exists
        .ensureAlpha()
        .composite([
          {
            input: maskSvgFor(radius),
            blend: 'dest-out'
          }
        ])
        .webp({ quality: 82, alphaQuality: 90 })
        .toFile(outPath);

      console.log(`Created ${outPath}`);
      if (file.photoRadius) {
        console.log(`  -> remember to set photoRadius: ${file.photoRadius} on this template in lib/templates.js`);
      }
    } catch (err) {
      console.error(`Error processing ${file.name}:`, err);
    }
  }
}

processImages();
