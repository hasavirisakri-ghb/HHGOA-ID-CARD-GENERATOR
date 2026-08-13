'use client';

export default function Header({ activeFormat, onFormatChange }) {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 1 }}>
      <h1>
        {activeFormat === 'PFP_FRAME' ? 'Your PFP is one upload away' : 'Your Builder Pass is one upload away'}
      </h1>
      <p className="subtitle">
        Photo &rarr; Edit &rarr; Fill &rarr; Generate &rarr; <span>#FrameInGoa</span>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="format-toggle">
          <div 
            className={`format-tab ${activeFormat === 'ID_CARD' ? 'active' : ''}`}
            onClick={() => onFormatChange('ID_CARD')}
          >
            BUILDER ID CARD
          </div>
          <div 
            className={`format-tab ${activeFormat === 'PFP_FRAME' ? 'active' : ''}`}
            onClick={() => onFormatChange('PFP_FRAME')}
          >
            PFP PROFILE FRAME
          </div>
        </div>
      </div>
    </div>
  );
}
