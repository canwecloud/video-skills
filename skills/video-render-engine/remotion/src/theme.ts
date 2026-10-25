export type Theme = {a: string; b: string; c: string; bg: string; accent: string; text: string};

// Gradient presets: a/b/c are the moving mesh-gradient blobs, bg the base, accent for highlights.
export const THEMES: Record<string, Theme> = {
  sunset:   {a: '#ff512f', b: '#dd2476', c: '#ff9a00', bg: '#12051f', accent: '#ffd400', text: '#ffffff'},
  neon:     {a: '#00f5d4', b: '#9b5de5', c: '#f15bb5', bg: '#07021a', accent: '#00f5d4', text: '#ffffff'},
  ocean:    {a: '#00c6ff', b: '#0072ff', c: '#7f5af0', bg: '#020b1f', accent: '#ffd400', text: '#ffffff'},
  saffron:  {a: '#ff9933', b: '#ff5e62', c: '#ffd400', bg: '#1f0a00', accent: '#ffe066', text: '#ffffff'},
  midnight: {a: '#4f46e5', b: '#06b6d4', c: '#a855f7', bg: '#05060f', accent: '#22d3ee', text: '#ffffff'},
  mint:     {a: '#22c55e', b: '#14b8a6', c: '#84cc16', bg: '#03140f', accent: '#facc15', text: '#ffffff'},
  royal:    {a: '#7c3aed', b: '#ec4899', c: '#f59e0b', bg: '#0d0221', accent: '#fbbf24', text: '#ffffff'},
  fire:     {a: '#ef4444', b: '#f97316', c: '#facc15', bg: '#140404', accent: '#fde047', text: '#ffffff'},
};

export const theme = (name?: string): Theme => THEMES[name ?? ''] ?? THEMES.ocean;
