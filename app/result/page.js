'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [cardUrl, setCardUrl] = useState(null);
  const [formatType, setFormatType] = useState('ID_CARD');

  useEffect(() => {
    const dataUrl = sessionStorage.getItem('hhgoa_generated_card');
    const type = sessionStorage.getItem('hhgoa_format_type') || 'ID_CARD';
    if (dataUrl) {
      setCardUrl(dataUrl);
      setFormatType(type);
    } else {
      router.push('/');
    }
  }, [router]);

  const isPfp = formatType === 'PFP_FRAME';

  const handleDownload = () => {
    if (!cardUrl) return;
    const link = document.createElement('a');
    link.href = cardUrl;
    link.download = isPfp ? 'hhgoa-pfp-frame.png' : 'hhgoa-builder-pass.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    const text = encodeURIComponent(
      isPfp 
        ? "Just customized my HH Goa 2026 Profile Picture Frame! 🏖️🚀 Frame yours 👇" 
        : "Just got my HH Goa 2026 Builder Pass! 🏖️🚀 Get yours 👇"
    );
    const hashtags = "FrameInGoa,HHGoa2026";
    const intentUrl = `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;
    window.open(intentUrl, '_blank');
  };

  if (!cardUrl) return <div className="loading-overlay">LOADING...</div>;

  return (
    <div className="result-page">
      <div className="success-badge">
        ✓ {isPfp ? 'Your PFP Profile Frame is Ready' : 'Your Builder Pass is Ready'}
      </div>
      
      <div 
        className="result-card-container" 
        style={{ maxWidth: isPfp ? '450px' : '420px', aspectRatio: isPfp ? '1/1' : '9/16' }}
      >
        <img src={cardUrl} alt="Your Generated Graphic" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      {/* Horizontal row of 3 distinct, high-contrast colored buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        maxWidth: '750px',
        margin: '1.5rem auto 2.5rem auto',
        padding: '0 1rem'
      }}>
        {/* Button 1: Dark Forest Green */}
        <button 
          onClick={handleDownload}
          style={{
            flex: '1 1 200px',
            maxWidth: '230px',
            height: '48px',
            backgroundColor: '#165932',
            color: '#FFFFFF',
            border: '2px solid #165932',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '0.85rem',
            fontFamily: "'Space Mono', monospace",
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(22, 89, 50, 0.4)',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'transform 0.15s ease'
          }}
        >
          ⬇ {isPfp ? 'Download PFP' : 'Download Pass'}
        </button>

        {/* Button 2: Solid Black */}
        <button 
          onClick={handleShare}
          style={{
            flex: '1 1 200px',
            maxWidth: '230px',
            height: '48px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: '2px solid #000000',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '0.85rem',
            fontFamily: "'Space Mono', monospace",
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            justify-content: 'center',
            gap: '0.5rem',
            transition: 'transform 0.15s ease'
          }}
        >
          ✕ Share to X
        </button>

        {/* Button 3: Neon Yellow */}
        <button 
          onClick={() => router.push('/')}
          style={{
            flex: '1 1 200px',
            maxWidth: '230px',
            height: '48px',
            backgroundColor: '#FFE500',
            color: '#000000',
            border: '2px solid #B3A000',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '0.85rem',
            fontFamily: "'Space Mono', monospace",
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 229, 0, 0.5)',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            justify-content: 'center',
            gap: '0.5rem',
            transition: 'transform 0.15s ease'
          }}
        >
          ↻ Generate Another
        </button>
      </div>

      <div className="footer">
        Hacker Goa House 2026 • Build in Goa, Ship from Paradise
      </div>
    </div>
  );
}
