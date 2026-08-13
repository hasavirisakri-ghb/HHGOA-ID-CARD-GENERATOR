const SIZE = 1080;
const CENTER = SIZE / 2; // 540
const DEFAULT_PHOTO_RADIUS = 430;

// X (Twitter) always displays avatars as a circle inscribed in the square image —
// i.e. everything outside a circle of radius 540 (half the canvas) centered on the
// canvas is permanently invisible once this PNG is set as a profile picture. The
// badge below is deliberately kept inside that circle (with margin) so branding and
// the name survive being used as an actual PFP, not just in the square post view.
const AVATAR_SAFE_RADIUS = 540;
const BADGE_WIDTH = 260;
const BADGE_BOTTOM_Y = 1032; // fixed bottom edge of the badge
const BADGE_ONE_LINE_HEIGHT = 34;
const BADGE_TWO_LINE_HEIGHT = 54;

export async function renderFrame(canvas, { userImage, croppedAreaPixels, templateSrc, name, photoRadius, duotone }) {
  const PHOTO_RADIUS = photoRadius || DEFAULT_PHOTO_RADIUS;
  const ctx = canvas.getContext('2d');
  canvas.width = SIZE;
  canvas.height = SIZE;

  // 1. Draw solid background
  ctx.fillStyle = '#165932';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. Draw user photo, clipped to the circle. Most templates use the shared
  // default radius, but a template's own frame art dictates how big its
  // punched-out photo hole actually is — `photoRadius` lets a template override
  // it so the photo always matches that specific art's hole exactly.
  if (userImage && croppedAreaPixels) {
    const img = await loadImage(userImage);
    ctx.save();
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, PHOTO_RADIUS, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      img,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      CENTER - PHOTO_RADIUS, CENTER - PHOTO_RADIUS,
      PHOTO_RADIUS * 2, PHOTO_RADIUS * 2
    );
    if (duotone) {
      // Apply a two-stop gradient using 'color' blend mode for duotone effect
      // This tints dark areas toward forest green and light areas toward neon yellow
      ctx.save();

      // First pass: multiply-ish darkening with forest green
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = '#165932';
      ctx.fill(); // reuse the existing circle clip path (must be within the clip region)

      // Second pass: screen with neon yellow to lift highlights
      ctx.globalCompositeOperation = 'screen';
      const grad = ctx.createRadialGradient(540, 380, 0, 540, 540, 600);
      grad.addColorStop(0, 'rgba(255, 229, 0, 0.55)');
      grad.addColorStop(1, 'rgba(255, 229, 0, 0.15)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }

  // 3. Draw the template PNG overlay
  const frameImg = await loadImage(templateSrc);
  ctx.drawImage(frameImg, 0, 0, SIZE, SIZE);

  // 4. Draw a single bottom-center badge — brand line always, name line if
  // provided. The badge's own geometry doesn't depend on the photo radius
  // (it's positioned relative to the avatar-safe boundary), but the safety
  // check below does, so a smaller photo radius is passed through for
  // accurate verification.
  drawSafeZoneBadge(ctx, { name });

  if (process.env.NODE_ENV !== 'production') {
    verifyAvatarSafety(PHOTO_RADIUS);
  }
}

function drawSafeZoneBadge(ctx, { name }) {
  const hasName = Boolean(name);
  const height = hasName ? BADGE_TWO_LINE_HEIGHT : BADGE_ONE_LINE_HEIGHT;
  const x = CENTER - BADGE_WIDTH / 2;
  const y = BADGE_BOTTOM_Y - height;

  drawBadge(ctx, {
    x, y,
    width: BADGE_WIDTH,
    height,
    bgColor: 'rgba(0, 0, 0, 0.85)',
    borderColor: '#FFE500',
  });

  const innerPad = 14;
  const maxTextWidth = BADGE_WIDTH - innerPad * 2;
  const centerX = CENTER;

  // Line 1: brand
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "900 20px 'Playfair Display'";
  ctx.fillStyle = '#FFE500';
  ctx.fillText("HH GOA '26", centerX, hasName ? y + 17 : y + height / 2, maxTextWidth);

  if (!hasName) return;

  // Line 2: name, auto-shrunk (and truncated with an ellipsis as a last resort)
  // to fit the badge width so long names degrade gracefully instead of
  // spilling into the frame art or the avatar-safe boundary above.
  const fontFamily = "'Space Mono', monospace";
  const fontWeight = 700;
  const fitted = fitSegmentsToWidth(
    ctx,
    [{ text: name.toUpperCase(), color: '#FFE500' }],
    { fontWeight, fontFamily, startSize: 19, minSize: 10, maxWidth: maxTextWidth }
  );

  ctx.textAlign = 'left';
  let cursorX = centerX - fitted.totalWidth / 2;
  const lineY = y + height - 15;
  for (const seg of fitted.segments) {
    ctx.font = `${fontWeight} ${fitted.size}px ${fontFamily}`;
    ctx.fillStyle = seg.color;
    ctx.fillText(seg.text, cursorX, lineY);
    cursorX += seg.width;
  }
}

// Shrinks a shared font size until the combined segment widths fit maxWidth
// (down to minSize), then truncates the longest segment with an ellipsis as a
// last resort so the badge never overflows regardless of input length.
function fitSegmentsToWidth(ctx, segments, { fontWeight, fontFamily, startSize, minSize, maxWidth }) {
  const measure = (size) => {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    const widths = segments.map((s) => ctx.measureText(s.text).width);
    return { widths, total: widths.reduce((a, b) => a + b, 0) };
  };

  let size = startSize;
  let { widths, total } = measure(size);
  while (total > maxWidth && size > minSize) {
    size -= 1;
    ({ widths, total } = measure(size));
  }

  if (total > maxWidth) {
    // Still doesn't fit at the floor size: truncate the longest segment.
    const longestIdx = widths.indexOf(Math.max(...widths));
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    let text = segments[longestIdx].text;
    while (text.length > 1 && total > maxWidth) {
      text = text.slice(0, -1);
      widths[longestIdx] = ctx.measureText(text + '…').width;
      total = widths.reduce((a, b) => a + b, 0);
    }
    segments[longestIdx] = { ...segments[longestIdx], text: text + '…' };
  }

  return {
    size,
    totalWidth: total,
    segments: segments.map((s, i) => ({ ...s, width: widths[i] })),
  };
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

// Dev-time sanity check: the badge's farthest corner must stay inside the
// avatar-safe radius, and its nearest edge must clear the photo circle.
function verifyAvatarSafety(photoRadius) {
  const check = (height) => {
    const y = BADGE_BOTTOM_Y - height;
    const nearest = y - CENTER; // top-center point, closest to the photo circle
    const halfW = BADGE_WIDTH / 2;
    const farthest = Math.sqrt(halfW ** 2 + (BADGE_BOTTOM_Y - CENTER) ** 2); // bottom corner
    if (nearest < photoRadius) {
      console.warn(`[frameRenderer] Badge (h=${height}) overlaps the photo circle: ${nearest}px < ${photoRadius}px`);
    }
    if (farthest > AVATAR_SAFE_RADIUS) {
      console.warn(`[frameRenderer] Badge (h=${height}) exceeds the X avatar-crop safe radius: ${farthest.toFixed(1)}px > ${AVATAR_SAFE_RADIUS}px`);
    }
  };
  check(BADGE_ONE_LINE_HEIGHT);
  check(BADGE_TWO_LINE_HEIGHT);
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
