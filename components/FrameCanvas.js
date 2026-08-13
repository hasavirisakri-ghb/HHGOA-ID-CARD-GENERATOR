'use client';

import { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Cropper from 'react-easy-crop';
import { renderFrame } from '../lib/frameRenderer';

const FrameCanvas = forwardRef(({ userImage, templateSrc, name, handle }, ref) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const canvasRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    if (canvasRef.current && croppedAreaPixels && templateSrc) {
      // Use document.fonts.ready to ensure fonts are loaded
      document.fonts.ready.then(() => {
        renderFrame(canvasRef.current, {
          userImage,
          croppedAreaPixels,
          templateSrc,
          name,
          handle
        });
      });
    }
  }, [userImage, croppedAreaPixels, templateSrc, name, handle]);

  // Expose download blob method to parent
  useImperativeHandle(ref, () => ({
    getBlob: (callback) => {
      if (canvasRef.current) {
        canvasRef.current.toBlob(callback, 'image/png');
      }
    }
  }));

  return (
    <div className="preview-panel">
      <div className="canvas-wrapper">
        {/* Hidden final canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Visible interactive preview */}
        {userImage ? (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <Cropper
              image={userImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: '#165932' },
                cropAreaStyle: { border: '3px dashed #FFE500' }
              }}
            />
            {/* Template overlay on top of cropper (pointer-events: none lets drag pass through to cropper) */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${templateSrc})`,
              backgroundSize: 'cover',
              pointerEvents: 'none'
            }} />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#165932' }}>
            <img src={templateSrc} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    </div>
  );
});

FrameCanvas.displayName = 'FrameCanvas';

export default FrameCanvas;
