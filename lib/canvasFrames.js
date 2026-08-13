// Canvas-drawn PFP frame styles + custom frame renderer.
// All drawing functions accept a `size` parameter so the same code works for
// both the 1080 px export canvas and smaller live-preview canvases.

export const CANVAS_FRAME_IDS = new Set(['neon-pulse', 'ink-horizon']);


// Background presets shared between custom frame and FrameBuilder UI
export const BG_PRESETS = {
  cyber:    { base: '#030810', label: 'Cyber',    glow: ['rgba(0,50,160,0.45)',  'rgba(0,15,50,0.2)']  },
  espresso: { base: '#060100', label: 'Espresso', glow: ['rgba(130,40,5,0.5)',   'rgba(40,8,0,0.2)']   },
  forest:   { base: '#020A04', label: 'Forest',   glow: ['rgba(8,80,20,0.45)',   'rgba(2,22,5,0.2)']   },
  midnight: { base: '#03040F', label: 'Midnight', glow: ['rgba(20,20,110,0.45)', 'rgba(5,5,30,0.2)']   },
};

/** Dispatch to the correct built-in canvas frame renderer. */
export function drawCanvasFrame(ctx, templateId, size = 1080) {
  if (templateId === 'neon-pulse')  drawNeonPulse(ctx, size);
  else if (templateId === 'ink-horizon') drawInkHorizon(ctx, size);
}

/**
 * Draw a user-configured custom frame: background + border + stickers.
 * Includes a full dark background so it composites cleanly over the photo.
 */
export function drawCustomFrame(ctx, size, settings) {
  const { borderStyle = 'neon', borderColor = '#FFE500', bgPreset = 'cyber', stickers = [] } = settings || {};
  const C = size / 2;
  const s = size / 1080;

  // Background
  _drawBackground(ctx, C, size, s, bgPreset);

  // Border around photo circle
  const photoRadius = 430 * s;
  (BORDER_FNS[borderStyle] || BORDER_FNS.neon)(ctx, C, photoRadius, borderColor, s);

  // Stickers — each has { emoji, x, y } where x/y are 0–1 fractions of size
  const emojiPx = Math.round(88 * s);
  ctx.save();
  ctx.font = `${emojiPx}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  stickers.forEach(({ emoji, x = 0.5, y = 0.5 }) => {
    if (!emoji) return;
    ctx.fillText(emoji, x * size, y * size);
  });
  ctx.restore();
}

// ─── Shared background helper ─────────────────────────────────────────────────

function _drawBackground(ctx, C, size, s, presetKey) {
  const pr = BG_PRESETS[presetKey] || BG_PRESETS.cyber;
  ctx.fillStyle = pr.base;
  ctx.fillRect(0, 0, size, size);
  const g = ctx.createRadialGradient(C, C, 0, C, C, 550 * s);
  g.addColorStop(0,   pr.glow[0]);
  g.addColorStop(0.6, pr.glow[1]);
  g.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

// ─── Border helpers ───────────────────────────────────────────────────────────

const BORDER_FNS = {
  neon:    drawNeonBorder,
  minimal: drawMinimalBorder,
  dashed:  drawDashedBorder,
  dots:    drawDotsBorder,
};

function drawNeonBorder(ctx, C, r, color, s) {
  [
    { dr: 24, lw: 40, a: 0.05 },
    { dr: 14, lw: 16, a: 0.15 },
    { dr:  5, lw:  5, a: 0.85 },
    { dr:  3, lw:  2, a: 1.00 },
  ].forEach(({ dr, lw, a }) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw * s;
    ctx.globalAlpha = a;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20 * s;
    ctx.beginPath();
    ctx.arc(C, C, r + dr * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawMinimalBorder(ctx, C, r, color, s) {
  [r + 6 * s, r + 18 * s].forEach((radius) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 * s;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(C, C, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawDashedBorder(ctx, C, r, color, s) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3 * s;
  ctx.setLineDash([20 * s, 10 * s]);
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(C, C, r + 10 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawDotsBorder(ctx, C, r, color, s) {
  const count = 32;
  const dotR = r + 14 * s;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = C + Math.cos(angle) * dotR;
    const y = C + Math.sin(angle) * dotR;
    const big = i % 8 === 0;
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = big ? 1 : 0.35;
    ctx.beginPath();
    ctx.arc(x, y, (big ? 5 : 3) * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─── Neon Pulse — Terminal / HUD Interface ────────────────────────────────────

function drawNeonPulse(ctx, size) {
  const C = size / 2;
  const s = size / 1080;

  // Background
  ctx.fillStyle = '#04060C';
  ctx.fillRect(0, 0, size, size);

  const bgG = ctx.createRadialGradient(C, C, 80 * s, C, C, 520 * s);
  bgG.addColorStop(0,   'rgba(0, 30, 90, 0.5)');
  bgG.addColorStop(0.7, 'rgba(0, 10, 30, 0.2)');
  bgG.addColorStop(1,   'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgG;
  ctx.fillRect(0, 0, size, size);

  // Corner tech grid (very subtle, clipped to corner regions only)
  const gridSz  = 44 * s;
  const gridRgn = 260 * s;
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 180, 255, 1)';
  ctx.lineWidth   = 0.5 * s;
  ctx.globalAlpha = 0.06;
  [
    [0, 0, gridRgn, gridRgn],
    [size - gridRgn, 0, size, gridRgn],
    [0, size - gridRgn, gridRgn, size],
    [size - gridRgn, size - gridRgn, size, size],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.clip();
    for (let gx = 0; gx <= size; gx += gridSz) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, size); ctx.stroke();
    }
    for (let gy = 0; gy <= size; gy += gridSz) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(size, gy); ctx.stroke();
    }
    ctx.restore();
  });
  ctx.restore();

  // Segmented photo bezel — 72 arcs with gaps; cardinal = yellow, diagonal = cyan
  const bezelR   = 450 * s;
  const totalSeg = 72;
  const segSpan  = (Math.PI * 2) / totalSeg;
  const gapFrac  = 0.28;

  for (let i = 0; i < totalSeg; i++) {
    const startA    = i * segSpan - Math.PI / 2;
    const endA      = startA + segSpan * (1 - gapFrac);
    const isCardinal = i % 18 === 0;
    const isDiag    = i % 9 === 0 && !isCardinal;

    const color = isCardinal ? '#FFE500' : (isDiag ? '#00C8FF' : '#00A0E0');
    const lw    = isCardinal ? 4 * s : (isDiag ? 2.5 * s : 1.5 * s);
    const alpha = isCardinal ? 1.0   : (isDiag ? 0.85    : 0.35);
    const blur  = isCardinal ? 8 * s : (isDiag ? 4 * s   : 0);

    ctx.save();
    ctx.strokeStyle  = color;
    ctx.lineWidth    = lw;
    ctx.globalAlpha  = alpha;
    if (blur) { ctx.shadowColor = color; ctx.shadowBlur = blur; }
    ctx.beginPath();
    ctx.arc(C, C, bezelR, startA, endA);
    ctx.stroke();
    ctx.restore();
  }

  // Cardinal tick marks — inward + outward extending lines
  for (let i = 0; i < 4; i++) {
    const angle  = (i / 4) * Math.PI * 2 - Math.PI / 2;
    const cos    = Math.cos(angle);
    const sin    = Math.sin(angle);
    const inner  = bezelR - 14 * s;
    const outer  = bezelR + 30 * s;
    const capLen = 8 * s;
    const perp   = angle + Math.PI / 2;

    ctx.save();
    ctx.strokeStyle = '#FFE500';
    ctx.lineWidth   = 2.5 * s;
    ctx.shadowColor = '#FFE500';
    ctx.shadowBlur  = 8 * s;
    ctx.beginPath();
    ctx.moveTo(C + cos * inner, C + sin * inner);
    ctx.lineTo(C + cos * outer, C + sin * outer);
    ctx.stroke();

    // Cap at outer end
    ctx.lineWidth  = 1.5 * s;
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.5;
    const ox = C + cos * outer, oy = C + sin * outer;
    ctx.beginPath();
    ctx.moveTo(ox - Math.cos(perp) * capLen, oy - Math.sin(perp) * capLen);
    ctx.lineTo(ox + Math.cos(perp) * capLen, oy + Math.sin(perp) * capLen);
    ctx.stroke();
    ctx.restore();
  }

  // Corner HUD brackets + crosshair
  const arm  = 52 * s;
  const gap3 = 14 * s;
  [
    { cx: 56*s,      cy: 56*s,      dx:  1, dy:  1 },
    { cx: size-56*s, cy: 56*s,      dx: -1, dy:  1 },
    { cx: 56*s,      cy: size-56*s, dx:  1, dy: -1 },
    { cx: size-56*s, cy: size-56*s, dx: -1, dy: -1 },
  ].forEach(({ cx, cy, dx, dy }) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.55)';
    ctx.lineWidth   = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(cx + dx * gap3, cy); ctx.lineTo(cx + dx * arm, cy);
    ctx.moveTo(cx, cy + dy * gap3); ctx.lineTo(cx, cy + dy * arm);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 229, 0, 0.55)';
    ctx.lineWidth   = 1 * s;
    ctx.beginPath();
    ctx.moveTo(cx - 4*s, cy); ctx.lineTo(cx + 4*s, cy);
    ctx.moveTo(cx, cy - 4*s); ctx.lineTo(cx, cy + 4*s);
    ctx.stroke();
    ctx.restore();
  });

  // Text
  _text(ctx, "HH  GOA  '26",               C, 36 * s,       'rgba(0, 210, 255, 0.75)', `${Math.round(24*s)}px`, '600');
  _text(ctx, 'OCT 28 – 31  ·  GOA, INDIA', C, size - 38*s,  'rgba(255, 229, 0, 0.50)', `${Math.round(16*s)}px`, '400');
}

// ─── Ink Horizon — Premium Editorial ─────────────────────────────────────────

function drawInkHorizon(ctx, size) {
  const C = size / 2;
  const s = size / 1080;

  // Background
  ctx.fillStyle = '#060202';
  ctx.fillRect(0, 0, size, size);

  const bgG = ctx.createRadialGradient(C, C * 0.85, 0, C, C, 600 * s);
  bgG.addColorStop(0,   'rgba(110, 32, 5, 0.52)');
  bgG.addColorStop(0.5, 'rgba(50,  12, 2, 0.25)');
  bgG.addColorStop(1,   'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgG;
  ctx.fillRect(0, 0, size, size);

  // Outer double-rule rectangle
  const p1 = 22 * s, p2 = 36 * s;
  ctx.save();
  ctx.strokeStyle = 'rgba(200, 130, 45, 0.65)';
  ctx.lineWidth   = 1.5 * s;
  ctx.strokeRect(p1, p1, size - p1 * 2, size - p1 * 2);
  ctx.strokeStyle = 'rgba(200, 130, 45, 0.22)';
  ctx.lineWidth   = 0.75 * s;
  ctx.strokeRect(p2, p2, size - p2 * 2, size - p2 * 2);
  ctx.restore();

  // Corner diamond ornaments on outer frame
  [[p1, p1], [size-p1, p1], [p1, size-p1], [size-p1, size-p1]].forEach(([cx, cy]) => {
    const dr = 8 * s;
    ctx.save();
    ctx.fillStyle = 'rgba(210, 145, 50, 0.9)';
    ctx.beginPath();
    ctx.moveTo(cx, cy-dr); ctx.lineTo(cx+dr, cy);
    ctx.lineTo(cx, cy+dr); ctx.lineTo(cx-dr, cy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  // Mid-side ticks on outer frame
  [
    [C, p1,      0, 1],
    [C, size-p1, 0, -1],
    [p1, C,      1, 0],
    [size-p1, C, -1, 0],
  ].forEach(([sx, sy, nx, ny]) => {
    const tl = 10 * s;
    ctx.save();
    ctx.strokeStyle = 'rgba(210, 145, 50, 0.5)';
    ctx.lineWidth   = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + nx * tl, sy + ny * tl);
    ctx.moveTo(sx - ny * 5*s, sy - nx * 5*s);
    ctx.lineTo(sx + ny * 5*s, sy + nx * 5*s);
    ctx.stroke();
    ctx.restore();
  });

  // Photo circle — double concentric ring
  const photoR = 430 * s;
  [
    [photoR +  6*s, 2*s,    'rgba(210,145,50,0.85)'],
    [photoR + 20*s, 0.75*s, 'rgba(210,145,50,0.28)'],
  ].forEach(([r, lw, c]) => {
    ctx.save();
    ctx.strokeStyle = c;
    ctx.lineWidth   = lw;
    ctx.beginPath();
    ctx.arc(C, C, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  // Diamond accents at 45° positions on photo ring
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
    const r  = photoR + 20 * s;
    const dx = C + Math.cos(angle) * r;
    const dy = C + Math.sin(angle) * r;
    const dh = 8 * s;
    ctx.save();
    ctx.fillStyle = 'rgba(210, 145, 50, 0.9)';
    ctx.beginPath();
    ctx.moveTo(dx, dy-dh); ctx.lineTo(dx+dh, dy);
    ctx.lineTo(dx, dy+dh); ctx.lineTo(dx-dh, dy);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Rule lines flanking top text
  const ruleY     = 50 * s;
  const textHalfW = 160 * s;
  const ruleStart = p2 + 18 * s;
  ctx.save();
  ctx.strokeStyle = 'rgba(200, 130, 45, 0.4)';
  ctx.lineWidth   = 1 * s;
  ctx.beginPath();
  ctx.moveTo(ruleStart, ruleY);
  ctx.lineTo(C - textHalfW - 8*s, ruleY);
  ctx.moveTo(C + textHalfW + 8*s, ruleY);
  ctx.lineTo(size - ruleStart, ruleY);
  ctx.stroke();
  ctx.restore();

  // Text
  _text(ctx, 'HACKER  GOA  HOUSE',         C, ruleY,        'rgba(215,155,65,0.9)',  `${Math.round(22*s)}px`, '400');
  _text(ctx, '∙  GOA  ∙  OCT 28 – 31  ∙', C, size - 46*s,  'rgba(215,155,65,0.52)', `${Math.round(16*s)}px`, '300');
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function _text(ctx, text, x, y, color, fontSize, weight) {
  ctx.save();
  ctx.font          = `${weight} ${fontSize} monospace`;
  ctx.textAlign     = 'center';
  ctx.textBaseline  = 'middle';
  ctx.fillStyle     = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}
