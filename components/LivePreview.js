'use client';

import Cropper from 'react-easy-crop';
import CanvasFrameOverlay from './CanvasFrameOverlay';

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
  customSettings,
}) {
  const templateType = selectedTemplate?.type;
  const isCanvasBased = templateType === 'canvas' || templateType === 'custom';

  const overlaySrc = selectedTemplate?.src || '/frames/tropical-cyber.webp';
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
          <div className="duotone-overlay" style={{ pointerEvents: 'none' }} />
        )}

        {/* Frame overlay — canvas draw for canvas/custom types, CSS bg-image for WebP frames */}
        {isCanvasBased ? (
          <CanvasFrameOverlay
            templateId={selectedTemplate.id}
            templateType={templateType}
            photoRadius={photoRadius}
            customSettings={customSettings}
          />
        ) : (
          <div
            className="template-overlay"
            style={{ backgroundImage: `url(${overlaySrc})` }}
          />
        )}

        {/* Bottom-centre name badge mirrors the canvas export geometry */}
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
