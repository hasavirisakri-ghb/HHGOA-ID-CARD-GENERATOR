'use client';

import { useEffect, useRef } from 'react';
import { templates, TEMPLATE_GROUPS } from '../lib/templates';
import { drawCanvasFrame } from '../lib/canvasFrames';

function CanvasThumb({ templateId }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const size = 160;
    canvas.width  = size;
    canvas.height = size;
    drawCanvasFrame(canvas.getContext('2d'), templateId, size);
  }, [templateId]);

  return <canvas ref={ref} className="template-thumb" />;
}

function CustomThumb() {
  return (
    <div className="template-thumb template-thumb-custom">
      <span className="template-thumb-custom-icon">✦</span>
      <span className="template-thumb-custom-text">BUILD<br />YOURS</span>
    </div>
  );
}

export default function TemplateSelector({ selectedId, onSelect }) {
  return (
    <div>
      <h2 className="section-title">CHOOSE YOUR FRAME</h2>
      {TEMPLATE_GROUPS.map((group) => {
        const groupTemplates = templates.filter((t) => t.group === group.id);
        return (
          <div key={group.id} className="template-group">
            <div className="template-group-label">{group.label}</div>
            <div className="template-scroll">
              {groupTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  className={`template-card${selectedId === tpl.id ? ' active' : ''}`}
                  onClick={() => onSelect(tpl.id)}
                >
                  {tpl.type === 'canvas' ? (
                    <CanvasThumb templateId={tpl.id} />
                  ) : tpl.type === 'custom' ? (
                    <CustomThumb />
                  ) : (
                    <img src={tpl.src} alt={tpl.label} className="template-thumb" />
                  )}
                  <span className="template-label">{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
