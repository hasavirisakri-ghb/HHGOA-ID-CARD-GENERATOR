'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITE_URL } from '../../lib/site';

const SHARE_TEXT =
  "Just framed up for HH Goa 2026 🌴 Building in paradise this October — grab yours 👇";
const HASHTAG_TEXT = '#FrameInGoa #HHGoa2026';
const FILE_NAME = 'hhgoa-pfp-frame.png';

function dataUrlToFile(dataUrl, filename) {
  const [meta, base64] = dataUrl.split(',');
  const mimeMatch = meta.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

async function uploadToBlob(dataUrl) {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append('file', blob, FILE_NAME);
    const response = await fetch('/api/upload-frame', { method: 'POST', body: formData });
    if (!response.ok) return null;
    const { url } = await response.json();
    return url;
  } catch {
    return null;
  }
}

export default function ResultPage() {
  const router = useRouter();
  const [cardUrl, setCardUrl] = useState(null);
  const [shareHint, setShareHint] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const dataUrl = sessionStorage.getItem('hhgoa_generated_card');
    if (dataUrl) {
      setCardUrl(dataUrl);
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (!cardUrl) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 150,
        spread: 100,
        startVelocity: 38,
        origin: { y: 0.5 },
        colors: ['#FFE500', '#FF007F', '#165932', '#ffffff', '#00FFAA'],
        scalar: 1.1,
        gravity: 0.9,
      });
    }).catch(() => {});
  }, [cardUrl]);

  const triggerDownload = () => {
    if (!cardUrl) return;
    const link = document.createElement('a');
    link.href = cardUrl;
    link.download = FILE_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
  };

  // Caption, link, and hashtags are folded into one `text` string rather than
  // split across text/url/hashtags: when X's native app is installed its own
  // deep-link handler only reads `text` and silently drops the rest, so `text`
  // is the one thing that reliably survives the handoff either way.
  const openTweetIntent = () => {
    const text = `${SHARE_TEXT} ${SITE_URL} ${HASHTAG_TEXT}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Feature-detect actual OS share-sheet support for files before trying it.
  // Where it's genuinely usable (mainly mobile Safari/Chrome), the image +
  // caption land already attached in X once the user picks it from the list.
  // Desktop canShare is inconsistent, so this falls through to the blob/tweet
  // path below — same reliable behavior desktop has always had.
  const handleShare = async () => {
    if (!cardUrl || isSharing) return;
    setIsSharing(true);
    setShareHint(null);

    try {
      const file = dataUrlToFile(cardUrl, FILE_NAME);
      const canShareFile =
        typeof navigator !== 'undefined' &&
        navigator.canShare &&
        navigator.canShare({ files: [file] });

      if (canShareFile) {
        await navigator.share({
          files: [file],
          title: 'HH Goa 2026',
          text: `${SHARE_TEXT} ${HASHTAG_TEXT}`,
        });
        setIsSharing(false);
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        // User cancelled the share sheet — not an error worth surfacing.
        setIsSharing(false);
        return;
      }
      console.error(err);
    }

    triggerDownload();
    const blobUrl = await uploadToBlob(cardUrl);
    if (blobUrl) {
      const text = `${SHARE_TEXT} ${HASHTAG_TEXT}`;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(blobUrl)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      openTweetIntent();
    }
    setShareHint('Saved to your downloads — attach it in the tweet that just opened.');
    setIsSharing(false);
  };

  if (!cardUrl) return <div className="loading-overlay">LOADING…</div>;

  return (
    <div className="result-page">
      <div className="result-bg-glow" aria-hidden="true" />

      <header className="result-header">
        <span className="result-eyebrow">HH GOA 2026 · #FrameInGoa</span>
        <h1 className="result-headline">Your Frame<br />is Ready</h1>
      </header>

      <div className="result-stage">
        <div className="result-card-stack" aria-hidden="true" />
        <div className="result-card-wrap result-card-animate">
          <img
            src={cardUrl}
            alt="Your HH Goa 2026 profile picture frame"
            className="result-card-img"
            draggable="false"
          />
        </div>
      </div>

      <div className="result-actions">
        <button
          onClick={handleShare}
          className="result-btn-share"
          disabled={isSharing}
          aria-label="Share to X (Twitter)"
        >
          <svg className="result-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.021 2.25H8.1l4.261 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
              fill="currentColor"
            />
          </svg>
          <span>{isSharing ? 'Sharing…' : 'Share to X'}</span>
        </button>

        <button
          onClick={triggerDownload}
          className={`result-btn-download${downloaded ? ' result-btn-done' : ''}`}
          aria-label="Download as PNG"
        >
          <svg className="result-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z" fill="currentColor" />
          </svg>
          <span>{downloaded ? 'Saved ✓' : 'Download'}</span>
        </button>
      </div>

      {shareHint && (
        <p className="result-share-hint" role="status">
          {shareHint}
        </p>
      )}

      <button onClick={() => router.push('/')} className="result-btn-redo">
        ← Make another
      </button>

      <footer className="result-footer">
        Hacker Goa House 2026 · Oct 28–31 · Goa, India
      </footer>
    </div>
  );
}
