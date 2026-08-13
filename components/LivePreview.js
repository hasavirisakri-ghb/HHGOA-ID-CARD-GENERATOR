'use client';

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
  return (
    <div className="preview-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="canvas-wrapper">
        {userImage ? (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <Cropper
              image={userImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              restrictPosition={false}
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: '#165932' },
                cropAreaStyle: { border: 'none', boxShadow: 'none' }
              }}
            />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#165932' }}>
            {/* Blank background until image uploaded */}
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

        {/* Dynamic Text Overlay - Scaled & Positioned strictly inside the neon boxes */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none'
        }}>
          {/* Name Box: Placed to the right of the "Name" label */}
          <div style={{
            position: 'absolute',
            top: '60.6%',
            left: '36%',
            width: '48%',
            height: '4.5%',
            display: 'flex',
            alignItems: 'center',
            color: '#FFFFFF',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 'bold',
            fontSize: 'clamp(0.6rem, 2.3cqw, 1.05rem)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            {name || 'YOUR NAME'}
          </div>

          {/* Skill Box: Placed to the right of the "Skill" label */}
          <div style={{
            position: 'absolute',
            top: '70.2%',
            left: '34%',
            width: '50%',
            height: '4.5%',
            display: 'flex',
            alignItems: 'center',
            color: '#FFFFFF',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 'bold',
            fontSize: 'clamp(0.55rem, 2.1cqw, 0.95rem)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            {skill || 'YOUR SKILL'}
          </div>
        </div>
      </div>
    </div>
  );
}
