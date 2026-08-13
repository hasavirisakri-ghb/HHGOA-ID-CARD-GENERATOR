'use client';

import { useRef, useState } from 'react';

export default function Controls({
  onImageUpload,
  zoom,
  onZoomChange,
  name,
  onNameChange,
  onGenerate,
  isGenerating,
  error,
  onCropChange,
  duotone,
  onDuotoneChange,
}) {
  const fileInputRef = useRef(null);
  const prevImageRef = useRef(null);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file) => {
    setUploadError(null);
    try {
      let objectUrl;
      const isHeic =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        file.name.toLowerCase().endsWith('.heic');

      if (isHeic) {
        setIsConverting(true);
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        objectUrl = URL.createObjectURL(blob);
      } else if (file.type.startsWith('image/')) {
        objectUrl = URL.createObjectURL(file);
      } else {
        setUploadError('Please choose an image file (JPG, PNG, WEBP or HEIC).');
        return;
      }

      if (prevImageRef.current) URL.revokeObjectURL(prevImageRef.current);
      prevImageRef.current = objectUrl;

      onImageUpload(objectUrl);

      if (typeof window !== 'undefined' && 'FaceDetector' in window) {
        try {
          const img = new Image();
          img.src = objectUrl;
          await img.decode();
          const detector = new window.FaceDetector({ fastMode: true });
          const faces = await detector.detect(img);
          if (faces.length > 0) {
            const face = faces[0].boundingBox;
            const cx = (face.x + face.width / 2) / img.naturalWidth;
            const cy = (face.y + face.height / 2) / img.naturalHeight;
            onCropChange({ x: (0.5 - cx) * 100, y: (0.5 - cy) * 100 });
          }
        } catch {
          // FaceDetector unavailable — silent fallback
        }
      }
    } catch (err) {
      console.error(err);
      setUploadError('Could not read that photo. Try a different file.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await handleFile(file);
    e.target.value = '';
  };

  return (
    <div className="controls-panel animate-fade-in">
      <div className="controls-header">
        <h2 className="section-title" style={{ margin: 0 }}>
          FRAME CONTROLS
        </h2>
        <span className="controls-meta">1080 × 1080</span>
      </div>

      <div className="control-group">
        <label className="control-label">PHOTO</label>

        {/* Visually hidden input — label click triggers it natively, no JS needed */}
        <input
          type="file"
          id="photo-upload"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/heic, image/heif, .heic, .heif"
          aria-hidden="true"
          tabIndex={-1}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, overflow: 'hidden' }}
        />

        <label
          htmlFor="photo-upload"
          className={`upload-dropzone${isDragging ? ' drag-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
          onDragLeave={(e) => { e.stopPropagation(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <span className="upload-icon">{isConverting ? '⏳' : '↑'}</span>
          <span className="upload-text">
            {isConverting ? 'Converting…' : isDragging ? 'Drop it!' : 'Upload Photo'}
          </span>
        </label>

        <div className="control-hint">JPG · PNG · WEBP · HEIC</div>
        {uploadError && <div className="control-error" role="alert">{uploadError}</div>}

        <div style={{ marginTop: '1rem' }}>
          <div className="zoom-row">
            <label htmlFor="zoom-slider" className="control-label" style={{ marginBottom: 0 }}>
              ZOOM
            </label>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <input
            type="range"
            id="zoom-slider"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="zoom-slider"
            aria-label="Zoom photo"
          />
        </div>

        <span className="tip-text">Drag the photo to reposition · pinch or scroll to zoom</span>

        <div className="filter-row">
          <span className="filter-label">HH GLOW FILTER</span>
          <button
            role="switch"
            aria-checked={duotone}
            className={`toggle-switch${duotone ? ' toggle-switch--on' : ''}`}
            onClick={() => onDuotoneChange(!duotone)}
            type="button"
            aria-label="Toggle HH Glow duotone filter"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="control-group" style={{ borderBottom: 'none' }}>
        <label className="control-label" htmlFor="name-input">YOUR NAME</label>
        <input
          type="text"
          id="name-input"
          placeholder="Enter your name (optional)"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={20}
          autoComplete="name"
          style={{ paddingLeft: '1rem' }}
        />
      </div>

      {error && (
        <div className="control-error" role="alert" style={{ marginBottom: '0.75rem' }}>
          {error}
        </div>
      )}

      <button
        className="btn btn-primary btn-block btn-generate"
        onClick={onGenerate}
        disabled={isGenerating || isConverting}
      >
        <span className="lightning-icon">⚡</span>{' '}
        {isGenerating ? 'GENERATING…' : 'GENERATE PFP'}
      </button>
    </div>
  );
}
