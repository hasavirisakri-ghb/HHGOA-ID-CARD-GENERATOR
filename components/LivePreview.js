'use client';

import Cropper from 'react-easy-crop';

export default function LivePreview({ 
  activeFormat = 'ID_CARD',
  selectedTemplate,
  userImage, 
  zoom, 
  onZoomChange,
  crop,
  onCropChange,
  onCropComplete,
  name, 
  skill,
  title,
  handle
}) {
  const isPfp = activeFormat === 'PFP_FRAME';
  const overlaySrc = isPfp ? (selectedTemplate?.src || '/frames/tropical-cyber.png') : '/frames/builder-card.png';

  return (
    <div className="preview-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className={isPfp ? "canvas-wrapper-pfp" : "canvas-wrapper"}>
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
          backgroundImage: `url(${overlaySrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pointerEvents: 'none'
        }} />

        {/* Dynamic Text Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none'
        }}>
          {!isPfp ? (
            <>
              {/* ID Card: Name Box */}
              {name && (
                <div style={{
                  position: 'absolute',
                  top: '60.8%',
                  left: '42%',
                  width: '42%',
                  height: '4.5%',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#FFFFFF',
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.55rem, 1.9cqw, 0.95rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}>
                  {name}
                </div>
              )}

              {/* ID Card: Skill Box */}
              {skill && (
                <div style={{
                  position: 'absolute',
                  top: '70.4%',
                  left: '39%',
                  width: '44%',
                  height: '4.5%',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#FFFFFF',
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.5rem, 1.7cqw, 0.85rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}>
                  {skill}
                </div>
              )}
            </>
          ) : (
            <>
              {/* PFP Frame: Branding & Name overlay at bottom */}
              <div style={{
                position: 'absolute',
                bottom: '5%',
                left: '6%',
                color: '#FFE500',
                fontFamily: '"Playfair Display", serif',
                fontWeight: 900,
                fontSize: 'clamp(0.7rem, 2.5cqw, 1.1rem)'
              }}>
                HH GOA '26
              </div>

              {(name || handle) && (
                <div style={{
                  position: 'absolute',
                  bottom: '4.5%',
                  right: '6%',
                  textAlign: 'right',
                  color: '#FFFFFF',
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  fontSize: 'clamp(0.55rem, 1.8cqw, 0.85rem)'
                }}>
                  {name && <div>{name.toUpperCase()}</div>}
                  {handle && <div style={{ opacity: 0.8, fontSize: '0.8em' }}>{handle.startsWith('@') ? handle : `@${handle}`}</div>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
