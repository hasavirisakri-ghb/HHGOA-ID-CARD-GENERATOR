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

  // 2. Draw user photo, clipped to the template circle
  // Based on mask: cx=540, cy=680, r=380
  if (userImage && croppedAreaPixels) {
    const img = await loadImage(userImage);
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 680, 380, 0, Math.PI * 2); 
    ctx.clip();
    
    // croppedAreaPixels is from a 1:1 cropper. We need to map it to our 760x760 circle area
    // The top-left of the circle is at (540-380, 680-380) = (160, 300)
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

  // 4. Draw Text Overlay
  // Name
  ctx.font = '700 64px "Space Mono"';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText((name || 'YOUR NAME').toUpperCase(), 540, 1165); // Approximate y based on template visually

  // Skill
  ctx.font = '700 56px "Space Mono"';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText((skill || 'YOUR SKILL').toUpperCase(), 540, 1345);

  // Optional: Title if there was space for it

  // Return base64 string for the result page to display
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
