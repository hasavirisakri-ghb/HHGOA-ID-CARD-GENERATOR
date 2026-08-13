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
    <div className="controls-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h2 className="section-title">✦ CARD CONTROLS</h2>
      
      <div className="control-group">
        <label className="control-label">📸 PHOTO</label>
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
          <label className="control-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </label>
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
        <span className="tip-text">💡 Tip: Drag directly on the preview to pan</span>
      </div>

      <div className="control-group">
        <label className="control-label">👤 YOUR NAME</label>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={name} 
          onChange={(e) => onNameChange(e.target.value)} 
          maxLength={15}
        />
      </div>

      <div className="control-group">
        <label className="control-label">⚡ SKILL / STACK</label>
        <input 
          type="text" 
          placeholder="Enter your skill (e.g. FULL STACK)" 
          value={skill} 
          onChange={(e) => onSkillChange(e.target.value)} 
          maxLength={20}
        />
      </div>

      <div className="control-group">
        <label className="control-label">🏷️ BUILDER TITLE</label>
        <input 
          type="text" 
          placeholder="Enter builder title" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          maxLength={20}
        />
      </div>

      <button 
        className="btn btn-primary btn-block" 
        onClick={handleGenerateClick}
        disabled={isGenerating}
        style={{ marginTop: '1rem', minHeight: '60px', fontSize: '1.2rem' }}
      >
        {isGenerating ? 'GENERATING...' : '⚡ GENERATE PASS'}
      </button>
    </div>
  );
}
