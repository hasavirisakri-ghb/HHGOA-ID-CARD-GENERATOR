'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import FloatingStickers from '../components/FloatingStickers';
import TemplateSelector from '../components/TemplateSelector';
import Controls from '../components/Controls';
import LivePreview from '../components/LivePreview';
import { renderFrame } from '../lib/frameRenderer';
import { templates } from '../lib/templates';

export default function Home() {
  const router = useRouter();

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const [userImage, setUserImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [name, setName] = useState('');
  const [duotone, setDuotone] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleGenerate = async () => {
    if (!userImage) {
      setError('Please upload a photo first!');
      return;
    }
    setError(null);
    setIsGenerating(true);

    try {
      // Make sure the branded fonts (Playfair Display / Space Mono) used by the
      // canvas text are actually loaded before we draw, otherwise the first
      // generate of a session can silently fall back to a system font.
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = document.createElement('canvas');
      await renderFrame(canvas, {
        userImage,
        croppedAreaPixels,
        templateSrc: selectedTemplate.src,
        photoRadius: selectedTemplate.photoRadius,
        name,
        duotone,
      });
      const cardDataUrl = canvas.toDataURL('image/png');

      sessionStorage.setItem('hhgoa_generated_card', cardDataUrl);
      router.push('/result');
    } catch (err) {
      console.error(err);
      setError('Something went wrong generating your PFP. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-layout">
      <FloatingStickers />
      <Header />

      <div className="glass-panel template-section animate-fade-in">
        <TemplateSelector
          selectedId={selectedTemplate.id}
          onSelect={(id) => setSelectedTemplate(templates.find((t) => t.id === id))}
        />
      </div>

      <div className="glass-panel main-content">
        <Controls
          onImageUpload={setUserImage}
          zoom={zoom}
          onZoomChange={setZoom}
          name={name}
          onNameChange={setName}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          error={error}
          onCropChange={setCrop}
          duotone={duotone}
          onDuotoneChange={setDuotone}
        />

        <LivePreview
          selectedTemplate={selectedTemplate}
          userImage={userImage}
          zoom={zoom}
          onZoomChange={setZoom}
          crop={crop}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          name={name}
          duotone={duotone}
        />
      </div>

      <footer className="landing-footer">
        <div className="tagline">🌴 HACKER GOA HOUSE 2026 • OCT 28–31, 2026 • GOA, INDIA 🏖️</div>
        <div>Build in Goa, Ship from Paradise • Made for Builders • #FrameInGoa</div>
      </footer>
    </div>
  );
}
