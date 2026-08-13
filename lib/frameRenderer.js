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
    ctx.arc(SIZE / 2, SIZE / 2, 430, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      img,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      SIZE / 2 - 430, SIZE / 2 - 430,
      860, 860
    );
    ctx.restore();
  }

  // 3. Draw the template PNG overlay
  const frameImg = await loadImage(templateSrc);
  ctx.drawImage(frameImg, 0, 0, SIZE, SIZE);

  // 4. Draw Branding Badge (Bottom Left)
  drawBadge(ctx, {
    x: 40,
    y: 990,
    width: 220,
    height: 50,
    bgColor: 'rgba(0, 0, 0, 0.85)',
    borderColor: '#FFE500'
  });
  ctx.font = '900 32px "Playfair Display"';
  ctx.fillStyle = '#FFE500';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("HH GOA '26", 150, 1015);

  // 5. Draw Name & Handle Badge (Bottom Right)
  if (name || handle) {
    const badgeWidth = 360;
    const badgeHeight = name && handle ? 75 : 48;
    const badgeX = SIZE - badgeWidth - 40;
    const badgeY = SIZE - badgeHeight - 40;

    drawBadge(ctx, {
      x: badgeX,
      y: badgeY,
      width: badgeWidth,
      height: badgeHeight,
      bgColor: 'rgba(0, 0, 0, 0.88)',
      borderColor: '#FFE500'
    });

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    if (name && handle) {
      ctx.font = '700 28px "Space Mono"';
      ctx.fillStyle = '#FFE500';
      ctx.fillText(name.toUpperCase(), SIZE - 60, badgeY + 24);

      ctx.font = '700 20px "Space Mono"';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(handle.startsWith('@') ? handle : `@${handle}`, SIZE - 60, badgeY + 54);
    } else if (name) {
      ctx.font = '700 28px "Space Mono"';
      ctx.fillStyle = '#FFE500';
      ctx.fillText(name.toUpperCase(), SIZE - 60, badgeY + 24);
    } else if (handle) {
      ctx.font = '700 22px "Space Mono"';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(handle.startsWith('@') ? handle : `@${handle}`, SIZE - 60, badgeY + 24);
    }
  }
}

function drawBadge(ctx, { x, y, width, height, bgColor, borderColor }) {
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 10);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
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
