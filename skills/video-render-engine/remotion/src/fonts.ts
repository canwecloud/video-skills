import {staticFile} from 'remotion';

// File stems in public/fonts (copied from vendor/fonts by render.mjs / setup.sh).
export const FONT_FILES = [
  'Mukta-ExtraBold', 'Mukta-Bold', 'Mukta-SemiBold', 'Baloo2', 'Hind-Bold', 'Hind-SemiBold',
  'AnekDevanagari', 'NotoSansDevanagari', 'TiroDevanagariMarathi-Regular', 'TiroDevanagariHindi-Regular',
  'YatraOne-Regular', 'RozhaOne-Regular', 'Khand-Bold', 'Teko', 'Kalam-Bold',
  'Poppins-ExtraBold', 'Poppins-Bold', 'Poppins-SemiBold',
];

export const loadFonts = () =>
  Promise.all(
    FONT_FILES.map((n) =>
      new FontFace(n, `url(${staticFile(`fonts/${n}.ttf`)})`, {weight: '100 900'})
        .load()
        .then((f) => document.fonts.add(f))
        .catch(() => console.warn('font missing', n)),
    ),
  );

// CSS font stack: Devanagari face first, Latin fallback for English tech words.
export const stack = (devanagari: string, latin = 'Poppins-ExtraBold') => `'${devanagari}', '${latin}', sans-serif`;
