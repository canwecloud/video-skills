import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../theme';
import type {Caption} from '../types';

/** Animated mesh gradient + film grain + soft light rays. */
export const Background: React.FC<{theme: Theme}> = ({theme}) => {
  const f = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();
  const t = f / 30;
  const blob = (color: string, x: number, y: number, r: number) => (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: color, filter: `blur(${r * 0.45}px)`, opacity: 0.75}} />
  );
  return (
    <AbsoluteFill style={{background: theme.bg, overflow: 'hidden'}}>
      {blob(theme.a, w * (0.15 + 0.12 * Math.sin(t * 0.4)), h * (0.18 + 0.08 * Math.cos(t * 0.33)), w * 0.55)}
      {blob(theme.b, w * (0.9 + 0.1 * Math.cos(t * 0.37)), h * (0.55 + 0.1 * Math.sin(t * 0.29)), w * 0.6)}
      {blob(theme.c, w * (0.3 + 0.15 * Math.sin(t * 0.21 + 2)), h * (0.95 + 0.05 * Math.cos(t * 0.5)), w * 0.45)}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, transparent 30%, ${theme.bg}cc 100%)`}} />
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: `linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)`,
          backgroundSize: `${w / 12}px ${w / 12}px`,
          transform: `perspective(${w}px) rotateX(60deg) translateY(${(t * 40) % (w / 12)}px) scale(2)`,
          transformOrigin: '50% 100%',
          maskImage: 'linear-gradient(transparent 55%, #000)',
        }}
      />
      <svg width={w} height={h} style={{position: 'absolute', opacity: 0.09, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Title with per-word spring stagger. Wrap words in *stars* to paint them in the accent color. */
export const KineticTitle: React.FC<{text: string; size: number; font: string; theme: Theme; delay?: number; align?: 'center' | 'left'}> = ({text, size, font, theme, delay = 0, align = 'center'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div style={{fontFamily: font, fontSize: size, fontWeight: 800, lineHeight: 1.12, textAlign: align, color: theme.text, textShadow: '0 10px 40px rgba(0,0,0,.55)'}}>
      {words.map((w, i) => {
        const hi = /^\*.*\*[!?.,]*$/.test(w);
        const clean = w.replace(/\*/g, '');
        const s = spring({frame: f - delay - i * 3, fps, config: {damping: 12, stiffness: 140}});
        return (
          <span key={i} style={{display: 'inline-block', marginRight: size * 0.22, transform: `translateY(${(1 - s) * size * 0.7}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -8}deg)`, opacity: s}}>
            {hi ? (
              <span style={{color: '#111', background: theme.accent, padding: `0 ${size * 0.14}px`, borderRadius: size * 0.14, boxShadow: `0 0 ${size * 0.5}px ${theme.accent}88`}}>{clean}</span>
            ) : (
              clean
            )}
          </span>
        );
      })}
    </div>
  );
};

export const Pill: React.FC<{text: string; at: number; theme: Theme; font: string; size: number; variant?: 'accent' | 'glass'}> = ({text, at, theme, font, size, variant = 'accent'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 160}});
  if (f < at) return null;
  const glass = variant === 'glass';
  return (
    <div
      style={{
        display: 'inline-block', margin: size * 0.18, padding: `${size * 0.22}px ${size * 0.6}px`, borderRadius: 999,
        fontFamily: font, fontWeight: 800, fontSize: size,
        color: glass ? '#fff' : '#111', background: glass ? 'rgba(255,255,255,.12)' : theme.accent,
        border: glass ? '2px solid rgba(255,255,255,.35)' : 'none', backdropFilter: 'blur(12px)',
        boxShadow: glass ? '0 10px 30px rgba(0,0,0,.35)' : `0 10px 40px ${theme.accent}66`,
        transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** Karaoke captions: words timed by character weight inside each caption window; active word pops in accent. */
export const Captions: React.FC<{captions: Caption[]; font: string; theme: Theme; size: number; bottom: number}> = ({captions, font, theme, size, bottom}) => {
  const f = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const t = f / fps;
  const c = captions.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const words = c.text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = c.start;
  const starts = weights.map((wt) => {
    const s = acc;
    acc += ((c.end - c.start) * wt) / total;
    return s;
  });
  const enter = spring({frame: f - Math.round(c.start * fps), fps, config: {damping: 14, stiffness: 200}});
  return (
    <div style={{position: 'absolute', left: width * 0.06, right: width * 0.06, bottom, textAlign: 'center', transform: `scale(${0.85 + 0.15 * enter})`, opacity: enter}}>
      <div style={{display: 'inline', fontFamily: font, fontWeight: 800, fontSize: size, lineHeight: 1.35, WebkitTextStroke: `${size * 0.09}px #000`, paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,.7)'}}>
        {words.map((w, i) => {
          const active = t >= starts[i] && (i === words.length - 1 || t < starts[i + 1]);
          const past = t >= starts[i];
          const p = interpolate(t - starts[i], [0, 0.12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <span key={i} style={{display: 'inline-block', margin: `0 ${size * 0.16}px`, color: active ? theme.accent : '#fff', opacity: past ? 1 : 0.55, transform: `scale(${active ? 1 + 0.12 * p : 1})`}}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{theme: Theme; total: number}> = ({theme, total}) => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  return <div style={{position: 'absolute', top: 0, left: 0, height: width * 0.008, width: (f / total) * width, background: `linear-gradient(90deg, ${theme.accent}, ${theme.a})`, boxShadow: `0 0 20px ${theme.accent}`}} />;
};

/** Scene entry/exit: zoom-blur in, quick blur out, white flash on the cut. */
export const Transition: React.FC<{children: React.ReactNode; durationInFrames: number}> = ({children, durationInFrames}) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [0, 9], [0, 1], {extrapolateRight: 'clamp'});
  const outP = interpolate(f, [durationInFrames - 6, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flash = interpolate(f, [0, 4], [0.35, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${1.12 - 0.12 * inP + 0.06 * outP})`, filter: `blur(${(1 - inP) * 14 + outP * 10}px)`, opacity: Math.min(inP * 1.4, 1 - outP * 0.6)}}>
      {children}
      <AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
