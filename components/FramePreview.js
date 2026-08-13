'use client';

import { useEffect, useRef, useState } from 'react';
import { renderFrame } from '../lib/frameRenderer';

export default function FramePreview({ userImage, onCanvasReady }) {
  const canvasRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (userImage && canvasRef.current) {
      // Small timeout to ensure fonts are loaded
      document.fonts.ready.then(() => {
        const canvas = canvasRef.current;
        renderFrame(canvas, userImage);
        
        // Create a data URL to display in the img tag
        const url = canvas.toDataURL('image/png');
        setPreviewUrl(url);
        
        // Pass canvas back up so we can use toBlob for downloading
        if (onCanvasReady) {
          onCanvasReady(canvas);
        }
      });
    }
  }, [userImage, onCanvasReady]);

  return (
    <div className="preview-container">
      <div className="canvas-wrapper">
        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} />
        
        {/* Visible image for preview */}
        {previewUrl ? (
          <img src={previewUrl} alt="HH Goa 2026 PFP Frame Preview" />
        ) : (
          <div className="loading-overlay">RENDERING...</div>
        )}
      </div>
    </div>
  );
}
