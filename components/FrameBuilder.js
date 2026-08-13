'use client';

import { useState } from 'react';
import { BG_PRESETS } from '../lib/canvasFrames';

const BORDER_STYLES = [
  { id: 'neon',    label: 'Neon'    },
  { id: 'minimal', label: 'Minimal' },
  { id: 'dashed',  label: 'Dashed'  },
  { id: 'dots',    label: 'Dots'    },
];

const BORDER_COLORS = [
  { id: '#FFE500', label: 'Yellow' },
  { id: '#FF007F', label: 'Pink'   },
  { id: '#00CFFF', label: 'Cyan'   },
  { id: '#ffffff', label: 'White'  },
];

const STICKER_SETS = {
  Hacker: ['⚡', '🔥', '🎯', '💎', '🔮', '⚙️', '🌐', '🚀'],
  Goa:    ['🌴', '🌊', '🌅', '🌺', '🌙', '⭐', '🦋', '🐬'],
  Vibes:  ['🏖️', '🎸', '🏆', '🔑', '🎪', '🍹', '🎉', '🌈'],
};

// Free-positioning zone field — stickers live at arbitrary x/y (0–1 fractions)
function ZoneField({ stickers, selectedEmoji, onStickersChange, onDeselectEmoji }) {
  const placeAt = (e, containerEl) => {
    const rect = containerEl.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.max(0.02, Math.min(0.98, (cx - rect.left)  / rect.width));
    const y = Math.max(0.02, Math.min(0.98, (cy - rect.top)   / rect.height));
    return { x, y };
  };

  const handleZoneDrop = (e) => {
    e.preventDefault();
    const { x, y } = placeAt(e, e.currentTarget);
    const emoji  = e.dataTransfer.getData('emoji');
    const moveId = e.dataTransfer.getData('moveId');
    if (moveId) {
      onStickersChange(stickers.map((s) => s.id === moveId ? { ...s, x, y } : s));
    } else if (emoji) {
      onStickersChange([...stickers, { id: `s${Date.now()}`, emoji, x, y }]);
    }
  };

  const handleZoneClick = (e) => {
    if (!selectedEmoji) return;
    const { x, y } = placeAt(e, e.currentTarget);
    onStickersChange([...stickers, { id: `s${Date.now()}`, emoji: selectedEmoji, x, y }]);
    onDeselectEmoji();
  };

  const removeSticker = (id, e) => {
    e.stopPropagation();
    onStickersChange(stickers.filter((s) => s.id !== id));
  };

  return (
    <div
      className={`fb-zone-field${selectedEmoji ? ' fb-zone-field--placing' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleZoneDrop}
      onClick={handleZoneClick}
    >
      <div className="fb-photo-circle" aria-hidden="true" />
      <div className="fb-badge-indicator" aria-hidden="true">BADGE</div>

      {stickers.map((s) => (
        <span
          key={s.id}
          className="fb-placed-sticker"
          style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.setData('moveId', s.id);
          }}
          onClick={(e) => removeSticker(s.id, e)}
          title="Click / tap to remove"
        >
          {s.emoji}
          <span className="fb-placed-remove" aria-hidden="true">×</span>
        </span>
      ))}
    </div>
  );
}

export default function FrameBuilder({ settings, onChange }) {
  const { borderStyle, borderColor, bgPreset = 'cyber', stickers } = settings;
  const [activeSet, setActiveSet] = useState('Hacker');
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleStickerClick = (emoji) => {
    setSelectedEmoji((prev) => (prev === emoji ? null : emoji));
  };

  return (
    <div className="frame-builder">
      <h2 className="section-title">BUILD YOUR FRAME</h2>

      {/* ── Background + Border + Color ── */}
      <div className="fb-row">
        <div className="fb-section">
          <div className="fb-section-label">BACKGROUND</div>
          <div className="fb-color-swatches">
            {Object.entries(BG_PRESETS).map(([id, preset]) => (
              <button
                key={id}
                className={`fb-swatch${bgPreset === id ? ' active' : ''}`}
                style={{ '--sw': preset.base, '--sw-glow': preset.glow[0] }}
                onClick={() => onChange({ ...settings, bgPreset: id })}
                aria-label={preset.label}
                title={preset.label}
              />
            ))}
          </div>
        </div>

        <div className="fb-section">
          <div className="fb-section-label">BORDER</div>
          <div className="fb-style-pills">
            {BORDER_STYLES.map((s) => (
              <button
                key={s.id}
                className={`fb-pill${borderStyle === s.id ? ' active' : ''}`}
                onClick={() => onChange({ ...settings, borderStyle: s.id })}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="fb-section">
          <div className="fb-section-label">COLOR</div>
          <div className="fb-color-swatches">
            {BORDER_COLORS.map((c) => (
              <button
                key={c.id}
                className={`fb-swatch${borderColor === c.id ? ' active' : ''}`}
                style={{ '--sw': c.id }}
                onClick={() => onChange({ ...settings, borderColor: c.id })}
                aria-label={c.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticker placement ── */}
      <div className="fb-placement">
        <div className="fb-section-label">
          STICKERS
          {selectedEmoji ? (
            <span className="fb-select-hint"> — tap anywhere on the frame to place {selectedEmoji}</span>
          ) : stickers.length > 0 ? (
            <span className="fb-select-hint"> — drag to reposition · tap to remove</span>
          ) : null}
        </div>

        <ZoneField
          stickers={stickers}
          selectedEmoji={selectedEmoji}
          onStickersChange={(updated) => onChange({ ...settings, stickers: updated })}
          onDeselectEmoji={() => setSelectedEmoji(null)}
        />
      </div>

      {/* ── Sticker palette ── */}
      <div className="fb-palette">
        <div className="fb-palette-tabs">
          {Object.keys(STICKER_SETS).map((set) => (
            <button
              key={set}
              className={`fb-tab${activeSet === set ? ' active' : ''}`}
              onClick={() => setActiveSet(set)}
            >
              {set}
            </button>
          ))}
        </div>

        <div className="fb-sticker-grid">
          {STICKER_SETS[activeSet].map((emoji) => (
            <span
              key={emoji}
              className={`fb-sticker${selectedEmoji === emoji ? ' selected' : ''}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('emoji', emoji);
                setSelectedEmoji(null);
              }}
              onClick={() => handleStickerClick(emoji)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleStickerClick(emoji)}
              aria-label={emoji}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="fb-hint">
          Tap sticker to select → tap zone to place  ·  Drag sticker onto zone  ·  Drag placed sticker to move
        </div>
      </div>
    </div>
  );
}
