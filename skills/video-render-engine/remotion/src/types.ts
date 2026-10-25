export type Item = {text: string; at?: number; icon?: string};

export type Scene = {
  start: number; // seconds
  type: 'hook' | 'explain3d' | 'feature' | 'steps' | 'stat' | 'compare' | 'cta';
  title?: string; // *word* = accent highlight
  subtitle?: string;
  badge?: string; // e.g. "१" for numbered features
  model?: string; // 3D model key, see three/Models.tsx
  modelColor?: string;
  label?: string; // text printed on 'card' / 'coin' models (defaults to brand / unit)
  screen?: {title?: string; lines?: string[]}; // drawn on the 3D phone screen
  images?: string[]; // transparent PNG/SVG paths, orbit the 3D model
  items?: Item[];
  value?: number; from?: number; unit?: string; // stat
  left?: {title: string; items: string[]}; right?: {title: string; items: string[]}; // compare
  theme?: string; // per-scene theme override
  background?: 'aurora' | 'studio' | 'cyber'; // per-scene background style
};

export type Caption = {start: number; end: number; text: string};

export type Spec = {
  format?: 'short' | 'long';
  fps?: number;
  duration?: number; // seconds; defaults to voiceover length
  theme?: string;
  background?: 'aurora' | 'studio' | 'cyber'; // default aurora
  fonts?: {head?: string; body?: string; latin?: string};
  brand?: string;
  voiceover?: string;
  music?: {src: string; volume?: number; duck?: number};
  sfx?: boolean;
  captions?: Caption[];
  scenes: Scene[];
};
