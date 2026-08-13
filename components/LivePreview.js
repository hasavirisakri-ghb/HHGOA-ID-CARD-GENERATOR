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
              {/* PFP Frame: High-Contrast Badges for Branding & User Info */}
              <div style={{
                position: 'absolute',
                bottom: '4%',
                left: '4%',
                background: 'rgba(0, 0, 0, 0.82)',
                border: '1.5px solid #FFE500',
                borderRadius: '8px',
                padding: '4px 10px',
                color: '#FFE500',
                fontFamily: '"Playfair Display", serif',
                fontWeight: 900,
                fontSize: 'clamp(0.7rem, 2.3cqw, 1.1rem)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7)'
              }}>
                HH GOA '26
              </div>

              {(name || handle) && (
                <div style={{
                  position: 'absolute',
                  bottom: '4%',
                  right: '4%',
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1.5px solid #FFE500',
                  borderRadius: '8px',
                  padding: '4px 12px',
                  textAlign: 'right',
                  color: '#FFFFFF',
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7)',
                  maxWidth: '55%',
                  overflow: 'hidden'
                }}>
                  {name && (
                    <div style={{ 
                      color: '#FFE500', 
                      fontSize: 'clamp(0.65rem, 2.2cqw, 1rem)', 
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}>
                      {name.toUpperCase()}
                    </div>
                  )}
                  {handle && (
                    <div style={{ 
                      color: '#FFFFFF', 
                      fontSize: 'clamp(0.55rem, 1.8cqw, 0.85rem)', 
                      opacity: 0.9,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}>
                      {handle.startsWith('@') ? handle : `@${handle}`}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
