'use client';

import { useState, useRef } from 'react';

export default function UploadZone({ onImageLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setError(null);
    setIsLoading(true);

    try {
      let processedBlob = file;

      // Handle HEIC
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });
        processedBlob = Array.isArray(converted) ? converted[0] : converted;
      }

      // Ensure it's an image
      if (!processedBlob.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file.');
      }

      const url = URL.createObjectURL(processedBlob);
      const img = new Image();
      
      img.onload = () => {
        onImageLoaded(img);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setError('Failed to load image.');
        setIsLoading(false);
      };

      img.src = url;

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while processing the image.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/heic" 
        style={{ display: 'none' }} 
      />
      
      <div className="upload-icon">📸</div>
      <div className="upload-text">DROP YOUR PHOTO</div>
      <div className="upload-hint">or tap to browse</div>
      
      {isLoading && (
        <div className="loading-overlay">
          PROCESSING...
        </div>
      )}
      
      {error && (
        <div style={{ color: 'var(--hot-pink)', marginTop: '1rem', fontWeight: 'bold' }}>
          {error}
        </div>
      )}
    </div>
  );
}
