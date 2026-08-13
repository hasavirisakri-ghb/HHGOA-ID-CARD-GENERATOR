import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'C:/Users/ASUS/.gemini/antigravity/brain/145b99ce-6ce7-4a4f-9679-4f23c3449a46';
const OUT_DIR = './public/frames';
const FILENAME = 'goa_builder_id_card_template_1786592333200.jpg';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1080x1920 mask.
// We assume the circle is somewhere in the top half.
// Let's guess: center x is 540, center y is around 680, radius is around 380.
const maskSvg = Buffer.from(
  `<svg width="1080" height="1920">
    <circle cx="540" cy="680" r="380" fill="white" />
  </svg>`
);

async function processImage() {
  const srcPath = path.join(SRC_DIR, FILENAME);
  const outPath = path.join(OUT_DIR, 'builder-card.png');
  
  console.log(`Processing Builder ID Card...`);
  
  try {
    const resized = await sharp(srcPath).resize(1080, 1920, { fit: 'fill' }).toBuffer();
    
    await sharp(resized)
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
    console.error(`Error processing builder card:`, err);
  }
}

processImage();
