'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [cardUrl, setCardUrl] = useState(null);

  useEffect(() => {
    const dataUrl = sessionStorage.getItem('hhgoa_generated_card');
    if (dataUrl) {
      setCardUrl(dataUrl);
    } else {
      // If no card in session, go back home
      router.push('/');
    }
  }, [router]);

  const handleDownload = () => {
    if (!cardUrl) return;
    const link = document.createElement('a');
    link.href = cardUrl;
    link.download = 'hhgoa-builder-pass.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    const text = encodeURIComponent("Just got my HH Goa 2026 Builder Pass! 🏖️🚀 Check out the generator 👇");
    const hashtags = "FrameInGoa,HHGoa2026";
    const intentUrl = `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;
    window.open(intentUrl, '_blank');
  };

  if (!cardUrl) return <div className="loading-overlay">LOADING...</div>;

  return (
    <div className="result-page">
      <div className="success-badge">
        ✓ Your Builder Pass is Ready
      </div>
      
      <div className="result-card-container">
        <img src={cardUrl} alt="Your Builder Pass" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <div className="action-buttons">
        <button className="btn btn-dark" onClick={handleDownload} style={{ minWidth: '200px' }}>
          ⬇ Download Pass
        </button>
        <button className="btn btn-dark" onClick={handleShare} style={{ background: '#fff', color: '#000', minWidth: '200px' }}>
          ✕ Share to X
        </button>
        <button className="btn btn-dark" onClick={() => router.push('/')} style={{ background: 'transparent', minWidth: '200px' }}>
          ↻ Generate Another Pass
        </button>
      </div>

      <div className="footer">
        Hacker Goa House 2026 • Build in Goa, Ship from Paradise
      </div>
    </div>
  );
}
