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
}) {
  const fileInputRef = useRef(null);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError(null);

    try {
      const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic');

      if (isHeic) {
        setIsConverting(true);
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        onImageUpload(URL.createObjectURL(blob));
      } else if (file.type.startsWith('image/')) {
        onImageUpload(URL.createObjectURL(file));
      } else {
        setUploadError('Please choose an image file (JPG, PNG, WEBP or HEIC).');
      }
    } catch (err) {
      console.error(err);
      setUploadError('Could not read that photo. Try a different file.');
    } finally {
      setIsConverting(false);
      // allow re-selecting the same file
      e.target.value = '';
    }
  };

  return (
    <div className="controls-panel animate-fade-in">
      <div className="controls-header">
        <h2 className="section-title" style={{ margin: 0 }}>
          📷 EDITABLE PFP CONTROLS
        </h2>
        <span className="controls-meta">1080×1080 FINAL PFP</span>
      </div>

      <div className="control-group">
        <label className="control-label" htmlFor="photo-upload">📷 PHOTO CONTROLS</label>
        <input
          type="file"
          id="photo-upload"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/heic, image/heif, .heic, .heif"
          className="hidden"
        />
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current.click(); }}
        >
          <span className="upload-icon">{isConverting ? '⏳' : '↑'}</span>
          <span className="upload-text">{isConverting ? 'Converting HEIC…' : 'Upload Photo'}</span>
        </div>
        <div className="control-hint">Supports JPG, PNG, WEBP &amp; HEIC (iPhone)</div>
        {uploadError && <div className="control-error" role="alert">{uploadError}</div>}

        <div style={{ marginTop: '1rem' }}>
          <div className="zoom-row">
            <label htmlFor="zoom-slider">Zoom</label>
            <span>{Math.round(zoom * 100)}%</span>
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
        <span className="tip-text">💡 Tip: Drag directly on the photo to reposition. Pinch or scroll to zoom!</span>
      </div>

      <div className="control-group" style={{ borderBottom: 'none' }}>
        <label className="control-label" htmlFor="name-input">👤 YOUR NAME</label>
        <div className="input-with-icon">
          <span className="input-icon" aria-hidden="true">👤</span>
          <input
            type="text"
            id="name-input"
            placeholder="Enter your name (optional)"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={20}
            autoComplete="name"
          />
        </div>
      </div>

      {error && <div className="control-error" role="alert" style={{ marginBottom: '0.75rem' }}>{error}</div>}

      <button
        className="btn btn-primary btn-block btn-generate"
        onClick={onGenerate}
        disabled={isGenerating || isConverting}
      >
        <span className="lightning-icon">⚡</span> {isGenerating ? 'GENERATING…' : 'GENERATE PFP'}
      </button>
    </div>
  );
}
