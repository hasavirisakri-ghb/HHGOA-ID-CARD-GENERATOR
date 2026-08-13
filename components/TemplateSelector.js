'use client';

import { templates } from '../lib/templates';

export default function TemplateSelector({ selectedId, onSelect }) {
  return (
    <div>
      <h2 className="section-title">CHOOSE PFP FRAME TEMPLATE ({templates.length} STYLES)</h2>
      <div className="template-scroll">
        {templates.map(tpl => (
          <button 
            key={tpl.id}
            className={`template-card ${selectedId === tpl.id ? 'active' : ''}`}
            onClick={() => onSelect(tpl.id)}
          >
            <img src={tpl.src} alt={tpl.label} className="template-thumb" />
            <span className="template-label">{tpl.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
