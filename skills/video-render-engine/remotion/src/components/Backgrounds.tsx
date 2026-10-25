import React, {useMemo} from 'react';
import {AbsoluteFill, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Theme} from '../theme';

export type BgStyle = 'aurora' | 'studio' | 'cyber';

/** Deterministic particle field (seeded, so every render frame matches). */
const useParticles = (n: number, seed: string) =>
  useMemo(
    () =>
      Array.from({length: n}, (_, i) => ({
        x: random(`${seed}x${i}`),
        y: random(`${seed}y${i}`),
        r: 0.004 + random(`${seed}r${i}`) * 0.03,
        speed: 0.01 + random(`${seed}s${i}`) * 0.035,
        blur: random(`${seed}b${i}`),
        hue: random(`${seed}h${i}`),
        phase: random(`${seed}p${i}`) * Math.PI * 2,
      })),
    [n, seed],
  );

const Grain: React.FC<{opacity?: number}> = ({opacity = 0.08}) => {
  const f = useCurrentFrame();
  // Pre-rendered noise tile (render.mjs makes it) shifted per frame: same look as live SVG noise, ~50x cheaper.
  const o = (Math.floor(f / 2) * 97) % 256;
  return <AbsoluteFill style={{backgroundImage: `url(${staticFile('sfx/grain.png')})`, backgroundPosition: `${o}px ${(o * 7) % 256}px`, opacity, mixBlendMode: 'overlay'}} />;
};

const Vignette: React.FC<{color: string; strength?: number}> = ({color, strength = 0.85}) => (
  <AbsoluteFill style={{background: `radial-gradient(120% 85% at 50% 45%, transparent 45%, ${color} 100%)`, opacity: strength}} />
);

/** Bokeh: soft out-of-focus lights drifting upward at different depths. */
const Bokeh: React.FC<{theme: Theme; n?: number}> = ({theme, n = 26}) => {
  const f = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();
  const ps = useParticles(n, 'bokeh');
  const colors = [theme.a, theme.b, theme.c, theme.accent, '#ffffff'];
  return (
    <AbsoluteFill>
      {ps.map((p, i) => {
        const t = f / 30;
        const y = ((p.y - t * p.speed) % 1 + 1) % 1;
        const x = p.x + Math.sin(t * 0.5 + p.phase) * 0.02;
        const size = p.r * w * (p.blur > 0.7 ? 3 : 1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: x * w - size / 2, top: y * h * 1.1 - size / 2, width: size, height: size, borderRadius: '50%',
              background: `radial-gradient(circle, ${colors[Math.floor(p.hue * colors.length)]} 0%, transparent 70%)`,
              opacity: (0.25 + 0.5 * (1 - p.blur)) * (0.6 + 0.4 * Math.sin(t * 1.3 + p.phase)),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Aurora: flowing conic/radial ribbons + god rays + bokeh. Premium "keynote" look. */
const Aurora: React.FC<{theme: Theme}> = ({theme}) => {
  const f = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();
  const t = f / 30;
  const ribbon = (color: string, cx: number, cy: number, rw: number, rh: number, rot: number) => (
    <div
      style={{
        position: 'absolute', left: cx * w - (rw * w) / 2, top: cy * h - (rh * h) / 2, width: rw * w, height: rh * h, borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${color}dd 0%, ${color}77 30%, ${color}22 55%, transparent 72%)`,
        transform: `rotate(${rot}deg)`, opacity: 0.9,
      }}
    />
  );
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${theme.bg} 0%, #000 100%)`, overflow: 'hidden'}}>
      {ribbon(theme.a, 0.2 + 0.1 * Math.sin(t * 0.3), 0.18 + 0.05 * Math.cos(t * 0.25), 1.3, 0.35, -25 + 8 * Math.sin(t * 0.2))}
      {ribbon(theme.b, 0.85 + 0.08 * Math.cos(t * 0.27), 0.5 + 0.08 * Math.sin(t * 0.22), 1.1, 0.4, 30 + 10 * Math.cos(t * 0.18))}
      {ribbon(theme.c, 0.4 + 0.15 * Math.sin(t * 0.19 + 1), 0.92, 1.4, 0.3, -10 + 6 * Math.sin(t * 0.3))}
      {/* god rays from the top */}
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${200 + 6 * Math.sin(t * 0.25)}deg at 50% -12%, rgba(255,255,255,.07) 0deg 4deg, transparent 4deg 13deg)`,
          maskImage: 'linear-gradient(#000 0%, transparent 70%)', WebkitMaskImage: 'linear-gradient(#000 0%, transparent 70%)', mixBlendMode: 'screen',
        }}
      />
      <Bokeh theme={theme} />
      <Vignette color="#000" strength={0.75} />
      <Grain />
    </AbsoluteFill>
  );
};

/** Studio: dark seamless backdrop, top spotlight cone, glossy reflective floor. Product-shot look. */
const Studio: React.FC<{theme: Theme}> = ({theme}) => {
  const f = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();
  const t = f / 30;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 70% at 50% 35%, ${theme.bg} 0%, #050507 70%)`, overflow: 'hidden'}}>
      {/* spotlight cone */}
      <div style={{position: 'absolute', left: w * 0.5 - w * 0.7, top: -h * 0.05, width: w * 1.4, height: h * 0.8, background: `conic-gradient(from 160deg at 50% 0%, transparent 0deg, ${theme.a}33 12deg, rgba(255,255,255,.14) 20deg, ${theme.b}33 28deg, transparent 40deg)`, opacity: 0.9 + 0.1 * Math.sin(t)}} />
      {/* colored rim lights */}
      <div style={{position: 'absolute', left: -w * 0.3, top: h * 0.3, width: w * 0.8, height: w * 0.8, borderRadius: '50%', background: `radial-gradient(circle, ${theme.a} 0%, transparent 70%)`, opacity: 0.45}} />
      <div style={{position: 'absolute', right: -w * 0.3, top: h * 0.45, width: w * 0.8, height: w * 0.8, borderRadius: '50%', background: `radial-gradient(circle, ${theme.b} 0%, transparent 70%)`, opacity: 0.45}} />
      {/* reflective floor */}
      <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.66, bottom: 0, background: `linear-gradient(180deg, rgba(255,255,255,.07), transparent 40%), linear-gradient(180deg, transparent, #000)`, borderTop: '1px solid rgba(255,255,255,.12)'}} />
      <Bokeh theme={theme} n={12} />
      <Vignette color="#000" strength={0.8} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

/** Cyber: neon horizon, scrolling perspective grid, scanlines. Tech / gaming. */
const Cyber: React.FC<{theme: Theme}> = ({theme}) => {
  const f = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();
  const t = f / 30;
  const cell = w / 10;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #02010a 0%, ${theme.bg} 55%, #000 100%)`, overflow: 'hidden'}}>
      {/* sun / horizon glow */}
      <div style={{position: 'absolute', left: w * 0.5 - w * 0.45, top: h * 0.52 - w * 0.45, width: w * 0.9, height: w * 0.9, borderRadius: '50%', background: `radial-gradient(circle, ${theme.accent}cc 0%, ${theme.b}66 40%, transparent 70%)`, opacity: 0.6}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.62, height: 4, background: theme.a, boxShadow: `0 0 40px 10px ${theme.a}`}} />
      {/* floor grid */}
      <div
        style={{
          position: 'absolute', left: -w, right: -w, top: h * 0.62, height: h,
          backgroundImage: `linear-gradient(${theme.a}aa 2px, transparent 2px), linear-gradient(90deg, ${theme.a}aa 2px, transparent 2px)`,
          backgroundSize: `${cell}px ${cell}px`, backgroundPosition: `0 ${(t * 120) % cell}px`,
          transform: `perspective(${h * 0.5}px) rotateX(72deg)`, transformOrigin: '50% 0%',
          maskImage: 'linear-gradient(transparent, #000 25%)', WebkitMaskImage: 'linear-gradient(transparent, #000 25%)',
        }}
      />
      {/* ceiling grid, mirrored and faint */}
      <div
        style={{
          position: 'absolute', left: -w, right: -w, bottom: h * 0.62, height: h * 0.6, opacity: 0.25,
          backgroundImage: `linear-gradient(${theme.b}aa 2px, transparent 2px), linear-gradient(90deg, ${theme.b}aa 2px, transparent 2px)`,
          backgroundSize: `${cell}px ${cell}px`, backgroundPosition: `0 ${-(t * 120) % cell}px`,
          transform: `perspective(${h * 0.5}px) rotateX(-72deg)`, transformOrigin: '50% 100%',
          maskImage: 'linear-gradient(#000 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(#000 0%, transparent 80%)',
        }}
      />
      <Bokeh theme={theme} n={14} />
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)', opacity: 0.5}} />
      <Vignette color="#000" strength={0.7} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

export const Background: React.FC<{theme: Theme; style?: BgStyle}> = ({theme, style = 'aurora'}) =>
  style === 'studio' ? <Studio theme={theme} /> : style === 'cyber' ? <Cyber theme={theme} /> : <Aurora theme={theme} />;

/** Spotlight halo + soft floor shadow placed behind the 3D model so it pops off any background. */
export const StageHalo: React.FC<{theme: Theme; top: number; height: number}> = ({theme, top, height}) => {
  const f = useCurrentFrame();
  const {width: w} = useVideoConfig();
  const t = f / 30;
  const d = Math.min(w * 0.85, height * 0.95);
  const cy = top + height / 2;
  return (
    <>
      <div style={{position: 'absolute', left: w / 2 - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: '50%', background: `radial-gradient(circle, ${theme.accent}55 0%, ${theme.a}33 35%, transparent 68%)`, transform: `scale(${1 + 0.04 * Math.sin(t * 2)})`, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', left: w / 2 - d * 0.55, top: cy - d * 0.55, width: d * 1.1, height: d * 1.1, borderRadius: '50%', border: `2px solid ${theme.accent}33`, transform: `rotate(${t * 20}deg) scale(${0.95 + 0.03 * Math.sin(t)})`, borderTopColor: `${theme.accent}cc`, boxShadow: `0 0 30px ${theme.accent}22`}} />
      <div style={{position: 'absolute', left: w / 2 - d * 0.35, top: top + height * 0.86, width: d * 0.7, height: d * 0.09, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.55) 0%, transparent 70%)'}} />
    </>
  );
};
