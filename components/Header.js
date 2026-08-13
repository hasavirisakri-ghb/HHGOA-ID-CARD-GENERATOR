'use client';

export default function Header() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 1 }}>
      <h1>Your PFP is one upload away</h1>
      <p className="subtitle">
        Photo &rarr; Frame &rarr; Download &rarr; <span>#FrameInGoa</span>
      </p>
    </div>
  );
}
