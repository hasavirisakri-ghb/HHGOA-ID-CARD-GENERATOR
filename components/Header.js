'use client';

export default function Header() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 1 }}>
      <h1>Your Builder Pass is one upload away</h1>
      <p className="subtitle">
        Photo &rarr; Edit &rarr; Fill &rarr; Generate &rarr; <span>#FrameInGoa</span>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="format-toggle">
          <div className="format-tab active">BUILDER ID CARD</div>
          <div className="format-tab">PFP PROFILE FRAME</div>
        </div>
      </div>
    </div>
  );
}
