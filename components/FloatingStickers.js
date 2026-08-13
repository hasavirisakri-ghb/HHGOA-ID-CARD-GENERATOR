'use client';

export default function FloatingStickers() {
  return (
    <div className="stickers-container">
      {/* Top Left Pass */}
      <div className="floating-sticker sticker-1">
        <div className="sticker-emoji">🎟️</div>
        <div className="sticker-title">RESIDENCY PASS</div>
        <div className="sticker-sub">OCT 28–31, 2026</div>
      </div>
      
      {/* Top Right Coconut */}
      <div className="floating-sticker sticker-2">
        <div className="sticker-emoji">🥥</div>
        <div className="sticker-title">BUILD & CHILL</div>
        <div className="sticker-sub">Code by the beach</div>
      </div>

      {/* Bottom Left Beach HQ */}
      <div className="floating-sticker sticker-3">
        <div className="sticker-emoji">🏖️</div>
        <div className="sticker-title">GOA BEACH HQ</div>
        <div className="sticker-sub">Ship from paradise</div>
      </div>

      {/* Bottom Right Scooter */}
      <div className="floating-sticker sticker-4">
        <div className="sticker-emoji">🛵</div>
        <div className="sticker-title">SCOOTER VIBES</div>
        <div className="sticker-sub">Cruise → Code → Repeat</div>
      </div>
    </div>
  );
}
