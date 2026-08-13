import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'C:/Users/ASUS/.gemini/antigravity/brain/145b99ce-6ce7-4a4f-9679-4f23c3449a46';
const OUT_DIR = './public/frames';

const files = [
  { name: 'tropical-cyber', src: 'goa_pfp_frame_template_1786590072944.jpg' },
  { name: 'sunset-horizon', src: 'goa_pfp_sunset_horizon_1786590475457.jpg' },
  { name: 'cyber-heritage', src: 'goa_pfp_cyber_heritage_1786590488212.jpg' }
];

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// A 1080x1080 SVG with a white circle in the center, rest is black.
// Wait, to punch a hole, we want the circle to be transparent (alpha 0) and the rest opaque (alpha 255).
// We can use composite with dest-out using an SVG circle.
const maskSvg = Buffer.from(
  `<svg width="1080" height="1080">
    <circle cx="540" cy="540" r="430" fill="white" />
  </svg>`
);

async function processImages() {
  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file.src);
    const outPath = path.join(OUT_DIR, `${file.name}.png`);
    
    console.log(`Processing ${file.name}...`);
    
    try {
      // Resize to 1080x1080 first just in case
      const resized = await sharp(srcPath).resize(1080, 1080).toBuffer();
      
      await sharp(resized)
        // ensure alpha channel exists
        .ensureAlpha()
        .composite([
          {
            input: maskSvg,
            blend: 'dest-out'
          }
        ])
        .png()
        .toFile(outPath);
        
      console.log(`Created ${outPath}`);
    } catch (err) {
      console.error(`Error processing ${file.name}:`, err);
    }
  }
}

processImages();
