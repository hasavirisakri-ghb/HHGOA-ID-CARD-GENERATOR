'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import FloatingStickers from '../components/FloatingStickers';
import Controls from '../components/Controls';
import LivePreview from '../components/LivePreview';
import { renderBuilderCard } from '../lib/cardRenderer';

export default function Home() {
  const router = useRouter();
  
  const [userImage, setUserImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [title, setTitle] = useState('');

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleGenerate = async () => {
    // If no image is provided, we can still generate with a blank hole, but let's prompt
    if (!userImage) {
      alert("Please upload a photo first!");
      return;
    }

    // Give UI time to show loading state if needed
    await new Promise(r => setTimeout(r, 100));

    // Render the final card
    const cardDataUrl = await renderBuilderCard({
      userImage,
      croppedAreaPixels,
      name,
      skill,
      title
    });

    // Store in session storage
    sessionStorage.setItem('hhgoa_generated_card', cardDataUrl);
    
    // Navigate to result page
    router.push('/result');
  };

  return (
    <div className="app-layout">
      <FloatingStickers />
      <Header />
      
      <div className="glass-panel main-content">
        <Controls 
          onImageUpload={setUserImage} 
          zoom={zoom}
          onZoomChange={setZoom}
          name={name}
          onNameChange={setName}
          skill={skill}
          onSkillChange={setSkill}
          title={title}
          onTitleChange={setTitle}
          onGenerate={handleGenerate}
        />
        
        <LivePreview 
          userImage={userImage}
          zoom={zoom}
          onZoomChange={setZoom}
          crop={crop}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          name={name}
          skill={skill}
          title={title}
        />
      </div>
    </div>
  );
}
