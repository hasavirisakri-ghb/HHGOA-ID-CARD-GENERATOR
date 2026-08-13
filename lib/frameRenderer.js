export async function renderFrame(canvas, { userImage, croppedAreaPixels, templateSrc, name, handle }) {
  const SIZE = 1080;
  const ctx = canvas.getContext('2d');
  canvas.width = SIZE;
  canvas.height = SIZE;

  // 1. Draw solid background
  ctx.fillStyle = '#165932';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. Draw user photo, clipped to the circle
  if (userImage && croppedAreaPixels) {
    const img = await loadImage(userImage);
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, 430, 0, Math.PI * 2); // Circle in center
    ctx.clip();
    ctx.drawImage(
      img,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      SIZE / 2 - 430, SIZE / 2 - 430, // x, y on canvas
      860, 860 // width, height on canvas
    );
    ctx.restore();
  }

  // 3. Draw the template PNG overlay
  const frameImg = await loadImage(templateSrc);
  ctx.drawImage(frameImg, 0, 0, SIZE, SIZE);

  // 4. Draw branding
  ctx.font = '900 52px "Playfair Display"';
  ctx.fillStyle = '#FFE500';
  ctx.textAlign = 'left';
  ctx.fillText("HH GOA '26", 60, 1020);

  // 5. Draw name
  if (name) {
    ctx.font = '700 36px "Space Mono"';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText(name.toUpperCase(), SIZE - 60, 1000);
  }

  // 6. Draw handle
  if (handle) {
    ctx.font = '400 24px "Space Mono"';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'right';
    ctx.fillText(handle.startsWith('@') ? handle : `@${handle}`, SIZE - 60, 1040);
  }
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
