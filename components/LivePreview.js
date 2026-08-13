'use client';

import Cropper from 'react-easy-crop';

export default function LivePreview({
  selectedTemplate,
  userImage,
  zoom,
  onZoomChange,
  crop,
  onCropChange,
  onCropComplete,
  name,
  duotone,
}) {
  const overlaySrc = selectedTemplate?.src || '/frames/tropical-cyber.webp';
  // Templates can punch their photo hole at a smaller radius than the 430/1080
  // default (see lib/templates.js `photoRadius`) when their own art needs a
  // thinner border. The empty-state placeholder has to be constrained to that
  // same hole, or its text spills past the visible circle and gets covered by
  // the frame's opaque decoration outside it.
  const photoRadius = selectedTemplate?.photoRadius || 430;
  const holeDiameterPct = (photoRadius * 2 / 1080) * 100;

  return (
    <div className="preview-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="canvas-wrapper-pfp">
        {userImage ? (
          <div className="cropper-layer">
            <Cropper
              image={userImage}
              crop={crop}
              zoom={zoom}
              minZoom={1}
              maxZoom={3}
              aspect={1}
              cropShape="round"
              restrictPosition={false}
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: '#165932' },
                cropAreaStyle: { border: 'none', boxShadow: 'none' },
              }}
            />
          </div>
        ) : (
          <div className="preview-empty-state">
            <span style={{ maxWidth: `${holeDiameterPct * 0.8}%` }}>
              Upload a photo to preview your frame
            </span>
          </div>
        )}

        {duotone && (
          <div
            className="duotone-overlay"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Template Overlay */}
        <div
          className="template-overlay"
          style={{ backgroundImage: `url(${overlaySrc})` }}
        />

        {/* Dynamic Text Overlay — a single bottom-center badge, kept inside the
            circle X inscribes when cropping a square upload into a round avatar,
            so branding + name survive being used as an actual PFP. */}
        <div className="text-overlay">
          <div className="badge badge-safezone">
            <div className="badge-brand-line">HH GOA '26</div>
            {name && (
              <div className="badge-identity-line">
                <span className="badge-user-name">{name.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
