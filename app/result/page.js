'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITE_URL } from '../../lib/site';

const SHARE_TEXT = "Just customized my HH Goa 2026 Profile Picture Frame! 🏖️🚀 Frame yours 👇";
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
    formData.append('file', blob, 'hhgoa-pfp-frame.png');
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
    // Haptic feedback on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(200);
    }
    // Confetti — canvas-confetti not in package.json; silently skips if unavailable
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFE500', '#FF007F', '#165932', '#ffffff'],
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
  };

  // Goes straight to X (its app via universal link, or the web composer).
  // Caption, link, and hashtags are folded into one `text` string rather
  // than split across text/url/hashtags: confirmed on a real device that
  // when X's native app is installed, its own deep-link handler only reads
  // `text` and silently drops the rest, so `text` is the one thing that
  // reliably survives the handoff either way (native app or web).
  const openTweetIntent = () => {
    const text = `${SHARE_TEXT} ${SITE_URL} ${HASHTAG_TEXT}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    if (!cardUrl || isSharing) return;
    setIsSharing(true);
    setShareHint(null);

    // Feature-detect actual OS share-sheet support for files before trying
    // it. Where it's genuinely usable (mainly mobile Safari/Chrome), the
    // image + caption land already attached in X once the user picks it from
    // the list — that's the only way any website can hand a real file to
    // another app with nothing left to attach manually. Desktop support for
    // this is inconsistent (and X usually isn't even a registered share
    // target there), so canShare correctly comes back false on most desktop
    // browsers and this falls straight through to the direct-to-X path below
    // — same reliable behavior desktop has always had, no dead-end picker.
    try {
      const file = dataUrlToFile(cardUrl, FILE_NAME);
      const canShareFile = typeof navigator !== 'undefined'
        && navigator.canShare
        && navigator.canShare({ files: [file] });

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
      const text = `${SHARE_TEXT} ${SITE_URL} ${HASHTAG_TEXT}`;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(blobUrl)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      openTweetIntent();
    }
    setShareHint('Image downloaded — attach it in the X post that just opened.');
    setIsSharing(false);
  };

  if (!cardUrl) return <div className="loading-overlay">LOADING…</div>;

  return (
    <div className="result-page">
      <div className="success-badge">✓ Your PFP Profile Frame is Ready</div>

      <div className="result-card-container result-card-animate">
        <img src={cardUrl} alt="Your generated HH Goa 2026 profile picture frame" className="result-card-image" />
      </div>

      <div className="result-actions-row">
        <button onClick={triggerDownload} className="btn result-btn-download">
          ⬇ Download PFP
        </button>

        <button onClick={handleShare} className="btn result-btn-share" disabled={isSharing}>
          {isSharing ? '…' : '✕'} Share to X
        </button>

        <button onClick={() => router.push('/')} className="btn result-btn-another">
          ↻ Generate Another
        </button>
      </div>

      <div className="share-hint" role="status" aria-live="polite">
        {shareHint}
      </div>

      {cardUrl && (
        <div className="social-preview-mock">
          <p className="social-preview-label">Preview on X</p>
          <div className="mock-x-card">
            <div className="mock-x-banner" />
            <div className="mock-x-body">
              <img src={cardUrl} className="mock-x-avatar" alt="Your PFP preview" />
              <div className="mock-x-info">
                <span className="mock-x-name">Your Name</span>
                <span className="mock-x-handle">@yourhandle</span>
                <span className="mock-x-bio">Builder @ HH Goa 2026 🌴</span>
                <button className="mock-x-follow-btn">Follow</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="footer">
        Hacker Goa House 2026 • Build in Goa, Ship from Paradise
      </div>
    </div>
  );
}
