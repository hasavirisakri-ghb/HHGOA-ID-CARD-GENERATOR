export async function renderBuilderCard({ userImage, croppedAreaPixels, name, skill, title }) {
  const WIDTH = 1080;
  const HEIGHT = 1920;
  
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // 1. Solid background
  ctx.fillStyle = '#165932';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 2. Draw user photo, clipped to the template circle (cx=540, cy=680, r=380)
  if (userImage && croppedAreaPixels) {
    const img = await loadImage(userImage);
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 680, 380, 0, Math.PI * 2); 
    ctx.clip();
    
    ctx.drawImage(
      img,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      160, 300, 
      760, 760 
    );
    ctx.restore();
  }

  // 3. Draw Template PNG
  const templateImg = await loadImage('/frames/builder-card.png');
  ctx.drawImage(templateImg, 0, 0, WIDTH, HEIGHT);

  // 4. Draw Text Overlay (Shifted right to sit next to printed labels)
  // Name
  ctx.font = '700 36px "Space Mono"';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText((name || 'YOUR NAME').toUpperCase(), 460, 1180);

  // Skill
  ctx.font = '700 30px "Space Mono"';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText((skill || 'YOUR SKILL').toUpperCase(), 440, 1365);

  return canvas.toDataURL('image/png');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
