'use client';

export default function ActionButtons({ onDownload }) {
  const handleShare = () => {
    const text = encodeURIComponent("Just got my HH Goa 2026 PFP framed! 🏖️🚀 Check out the generator 👇");
    const hashtags = "FrameInGoa,HHGoa2026";
    const intentUrl = `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;
    window.open(intentUrl, '_blank');
  };

  return (
    <div className="action-buttons">
      <button className="btn btn-primary" onClick={onDownload}>
        ⬇ Download PFP
      </button>
      <button className="btn btn-dark" onClick={handleShare}>
        ✕ Share
      </button>
    </div>
  );
}
