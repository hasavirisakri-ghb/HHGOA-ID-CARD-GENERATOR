'use client';

import { useRef, useState } from 'react';

export default function Controls({ 
  onImageUpload, 
  zoom, 
  onZoomChange,
  name, 
  onNameChange, 
  skill, 
  onSkillChange,
  title,
  onTitleChange,
  onGenerate 
}) {
  const fileInputRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
      onImageUpload(URL.createObjectURL(converted));
    } else {
      onImageUpload(URL.createObjectURL(file));
    }
  };

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    await onGenerate();
    setIsGenerating(false);
  };

  return (
    <div className="controls-panel animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title">📷 EDITABLE CARD CONTROLS</h2>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Space Mono' }}>2048×2048 FINAL ID</span>
      </div>
      
      <div className="control-group">
        <label className="control-label">📷 PHOTO CONTROLS</label>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/webp, image/heic, .heic" 
          className="hidden" 
        />
        <button className="btn btn-primary btn-block" onClick={() => fileInputRef.current.click()}>
          ↑ Upload Photo
        </button>
        
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.3rem' }}>
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.05" 
            value={zoom} 
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="zoom-slider"
          />
        </div>
        <span className="tip-text">💡 Tip: Click & drag directly on the photo frame to pan. Scroll to zoom!</span>
      </div>

      <div className="control-group">
        <label className="control-label">👤 YOUR NAME</label>
        <div className="input-with-icon">
          <span className="input-icon">👤</span>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => onNameChange(e.target.value)} 
            maxLength={15}
          />
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">🔑 SKILL / STACK</label>
        <div className="input-with-icon">
          <span className="input-icon">🔑</span>
          <input 
            type="text" 
            placeholder="Enter your skill / stack" 
            value={skill} 
            onChange={(e) => onSkillChange(e.target.value)} 
            maxLength={20}
          />
        </div>
      </div>

      <div className="control-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="control-label">🎗️ BUILDER TITLE</label>
          <span style={{ fontSize: '0.65rem', color: 'var(--neon-yellow)', cursor: 'pointer' }}>✨ Generate with AI</span>
        </div>
        <div className="input-with-icon">
          <span className="input-icon">🎗️</span>
          <input 
            type="text" 
            placeholder="Enter builder title" 
            value={title} 
            onChange={(e) => onTitleChange(e.target.value)} 
            maxLength={20}
          />
        </div>
      </div>

      <button 
        className="btn btn-primary btn-block" 
        onClick={handleGenerateClick}
        disabled={isGenerating}
        style={{ marginTop: '1.5rem', minHeight: '54px', fontSize: '1rem' }}
      >
        {isGenerating ? 'GENERATING PASS...' : '⚡ GENERATE PASS'}
      </button>
    </div>
  );
}
