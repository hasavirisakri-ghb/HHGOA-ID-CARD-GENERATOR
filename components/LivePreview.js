'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';

export default function LivePreview({ 
  userImage, 
  zoom, 
  onZoomChange,
  crop,
  onCropChange,
  onCropComplete,
  name, 
  skill,
  title
}) {
  // We don't render the full 1080x1920 canvas here for performance,
  // we just use CSS and absolute positioning to create a WYSIWYG preview!

  return (
    <div className="preview-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="canvas-wrapper">
        {userImage ? (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <Cropper
              image={userImage}
              crop={crop}
              zoom={zoom}
              aspect={1} // The hole is a circle, so the cropper aspect is 1:1
              cropShape="round"
              restrictPosition={false}
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { 
                  background: '#165932',
                  // We need to offset the cropper so it aligns with the hole in the template.
                  // The hole in our 1080x1920 template is around cy=680. 680/1920 = 35.4% down from the top.
                  // The radius is 380, so diameter 760. 760/1080 = 70.3% of width.
                },
                cropAreaStyle: { border: 'none', boxShadow: 'none' }
              }}
            />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#165932' }}>
            {/* Blank background */}
          </div>
        )}

        {/* Template Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(/frames/builder-card.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pointerEvents: 'none'
        }} />

        {/* Dynamic Text Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Name Box: Around 60.5% down based on template */}
          <div style={{
            position: 'absolute',
            top: '60.5%',
            width: '100%',
            textAlign: 'center',
            color: 'white',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 'bold',
            fontSize: 'clamp(1rem, 4cqw, 2rem)',
            textTransform: 'uppercase',
            textShadow: '0px 2px 10px rgba(255, 255, 255, 0.3)'
          }}>
            {name || 'YOUR NAME'}
          </div>

          {/* Skill Box: Around 70% down */}
          <div style={{
            position: 'absolute',
            top: '70%',
            width: '100%',
            textAlign: 'center',
            color: 'white',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 'bold',
            fontSize: 'clamp(0.9rem, 3.5cqw, 1.8rem)',
            textTransform: 'uppercase',
            textShadow: '0px 2px 10px rgba(255, 255, 255, 0.3)'
          }}>
            {skill || 'YOUR SKILL'}
          </div>

          {/* Builder Title (if we use the left column in the template) */}
          {/* Let's put it somewhere near the bottom left or we can omit it in live preview if it's too complex */}
        </div>
      </div>
    </div>
  );
}
