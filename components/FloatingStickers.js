'use client';

export default function FloatingStickers() {
  return (
    <div className="stickers-container">
      {/* Top Left Badge */}
      <div className="floating-sticker sticker-1">
        <div className="sticker-badge-icon">🏛️</div>
        <div className="sticker-title">HACKER HOUSE</div>
        <div className="sticker-sub">RESIDENCY 2026</div>
      </div>
      
      {/* Top Right Coconut */}
      <div className="floating-sticker sticker-2">
        <div className="sticker-emoji">🥥</div>
        <div className="sticker-title">BUILD & CHILL</div>
        <div className="sticker-sub">SHIP FROM PARADISE</div>
      </div>

      {/* Bottom Left Direction Sign */}
      <div className="floating-sticker sticker-3">
        <div className="sticker-emoji">🌴</div>
        <div className="sticker-title">GOA BEACH HQ</div>
        <div className="sticker-sub">EST. MMXXVI</div>
      </div>

      {/* Bottom Right Scooter */}
      <div className="floating-sticker sticker-4">
        <div className="sticker-emoji">🛵</div>
        <div className="sticker-title">GOA RIDE</div>
        <div className="sticker-sub">CRUISE THE COAST</div>
      </div>
    </div>
  );
}
