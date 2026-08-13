export const TEMPLATE_GROUPS = [
  { id: 'illustrated', label: 'ILLUSTRATED' },
  { id: 'digital',     label: 'DIGITAL'     },
  { id: 'custom',      label: 'CUSTOM'      },
];

export const templates = [
  { id: 'tropical-cyber',    label: 'Tropical Cyber',    src: '/frames/tropical-cyber.webp',    group: 'illustrated' },
  { id: 'hacker-beach-camp', label: 'Hacker Beach Camp', src: '/frames/hacker-beach-camp.webp', group: 'illustrated', photoRadius: 320 },
  { id: 'cyber-heritage',    label: 'Cyber Heritage',    src: '/frames/cyber-heritage.webp',    group: 'illustrated' },
  { id: 'neon-pulse',        label: 'Neon Pulse',        type: 'canvas', group: 'digital' },
  { id: 'ink-horizon',       label: 'Ink Horizon',       type: 'canvas', group: 'digital' },
  { id: 'custom',            label: 'Build Yours',       type: 'custom', group: 'custom'  },
];
