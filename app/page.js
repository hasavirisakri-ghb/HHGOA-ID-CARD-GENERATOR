'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import FloatingStickers from '../components/FloatingStickers';
import TemplateSelector from '../components/TemplateSelector';
import Controls from '../components/Controls';
import LivePreview from '../components/LivePreview';
import { renderBuilderCard } from '../lib/cardRenderer';
import { renderFrame } from '../lib/frameRenderer';
import { templates } from '../lib/templates';

export default function Home() {
  const router = useRouter();
  
  const [activeFormat, setActiveFormat] = useState('ID_CARD'); // 'ID_CARD' | 'PFP_FRAME'
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  
  const [userImage, setUserImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('');

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleGenerate = async () => {
    if (!userImage) {
      alert("Please upload a photo first!");
      return;
    }

    await new Promise(r => setTimeout(r, 100));

    let cardDataUrl;
    if (activeFormat === 'PFP_FRAME') {
      const canvas = document.createElement('canvas');
      await renderFrame(canvas, {
        userImage,
        croppedAreaPixels,
        templateSrc: selectedTemplate.src,
        name,
        handle
      });
      cardDataUrl = canvas.toDataURL('image/png');
      sessionStorage.setItem('hhgoa_format_type', 'PFP_FRAME');
    } else {
      cardDataUrl = await renderBuilderCard({
        userImage,
        croppedAreaPixels,
        name,
        skill,
        title
      });
      sessionStorage.setItem('hhgoa_format_type', 'ID_CARD');
    }

    sessionStorage.setItem('hhgoa_generated_card', cardDataUrl);
    router.push('/result');
  };

  return (
    <div className="app-layout">
      <FloatingStickers />
      <Header activeFormat={activeFormat} onFormatChange={setActiveFormat} />
      
      {activeFormat === 'PFP_FRAME' && (
        <div className="glass-panel template-section animate-fade-in">
          <TemplateSelector 
            selectedId={selectedTemplate.id} 
            onSelect={(id) => setSelectedTemplate(templates.find(t => t.id === id))} 
          />
        </div>
      )}

      <div className="glass-panel main-content">
        <Controls 
          activeFormat={activeFormat}
          onImageUpload={setUserImage} 
          zoom={zoom}
          onZoomChange={setZoom}
          name={name}
          onNameChange={setName}
          skill={skill}
          onSkillChange={setSkill}
          title={title}
          onTitleChange={setTitle}
          handle={handle}
          onHandleChange={setHandle}
          onGenerate={handleGenerate}
        />
        
        <LivePreview 
          activeFormat={activeFormat}
          selectedTemplate={selectedTemplate}
          userImage={userImage}
          zoom={zoom}
          onZoomChange={setZoom}
          crop={crop}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          name={name}
          skill={skill}
          title={title}
          handle={handle}
        />
      </div>

      <footer className="landing-footer">
        <div className="tagline">🌴 HACKER GOA HOUSE 2026 • OCT 28–31, 2026 • GOA, INDIA 🏖️</div>
        <div>Build in Goa, Ship from Paradise • Made for Builders • #FrameInGoa</div>
      </footer>
    </div>
  );
}
