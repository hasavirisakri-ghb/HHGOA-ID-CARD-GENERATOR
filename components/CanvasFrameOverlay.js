'use client';

import { useEffect, useRef } from 'react';
import { drawCanvasFrame, drawCustomFrame } from '../lib/canvasFrames';

/**
 * Renders a canvas-drawn frame as an absolutely-positioned overlay inside
 * the .canvas-wrapper-pfp live preview.
 *
 * For built-in canvas frames (neon-pulse, ink-horizon) the frame is drawn at
 * full size then a transparent hole is punched at the photo circle so the
 * react-easy-crop photo underneath shows through.
 *
 * For the custom frame type only borders + stickers are drawn (no background)
 * so the overlay is transparent except for the decorations.
 */
export default function CanvasFrameOverlay({ templateId, templateType, photoRadius = 430, customSettings }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size the canvas to match the wrapper's actual pixel dimensions.
    const container = canvas.parentElement;
    if (!container) return;

    const draw = () => {
      const w = container.offsetWidth  || 440;
      const h = container.offsetHeight || 440;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      if (templateType === 'canvas') {
        drawCanvasFrame(ctx, templateId, w);

        // Punch transparent hole so the photo shows through.
        const s = w / 1080;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, photoRadius * s, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();
      } else if (templateType === 'custom') {
        drawCustomFrame(ctx, w, customSettings);
        // Punch transparent hole so the react-easy-crop photo shows through.
        const s = w / 1080;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, photoRadius * s, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();
      }
    };

    draw();

    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, [templateId, templateType, photoRadius, customSettings]);

  return (
    <canvas
      ref={canvasRef}
      className="template-overlay canvas-frame-overlay"
      aria-hidden="true"
    />
  );
}
