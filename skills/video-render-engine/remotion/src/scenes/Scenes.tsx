import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticTitle, Pill} from '../components/Layers';
import {Stage3D} from '../three/Stage3D';
import type {Theme} from '../theme';
import type {Scene} from '../types';

export type SceneCtx = {
  scene: Scene;
  theme: Theme;
  head: string; // heading font stack
  body: string;
  fontName: string; // single family name for canvas textures
  durationInFrames: number;
  asset: (p: string) => string;
  brand?: string;
};

/** Layout grid shared by all scenes (vertical 9:16 and landscape 16:9). */
export const useLayout = () => {
  const {width: w, height: h} = useVideoConfig();
  const v = h > w;
  return v
    ? {v, w, h, titleTop: h * 0.085, titleSize: w * 0.092, subSize: w * 0.05, stageTop: h * 0.23, stageH: h * 0.43, pillTop: h * 0.645, pillSize: w * 0.042, capBottom: h * 0.15, capSize: w * 0.058}
    : {v, w, h, titleTop: h * 0.07, titleSize: w * 0.05, subSize: w * 0.026, stageTop: h * 0.2, stageH: h * 0.6, pillTop: h * 0.78, pillSize: w * 0.022, capBottom: h * 0.04, capSize: w * 0.032};
};

const localAt = (ctx: SceneCtx, at: number | undefined, i: number, fps: number) =>
  at !== undefined ? Math.round((at - ctx.scene.start) * fps) : 12 + i * 8;

const Header: React.FC<{ctx: SceneCtx; size?: number}> = ({ctx, size}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const sub = interpolate(f, [10, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: L.titleTop, left: L.w * 0.05, right: L.w * 0.05, textAlign: 'center'}}>
      {ctx.scene.badge && <Badge ctx={ctx} />}
      {ctx.scene.title && <KineticTitle text={ctx.scene.title} size={size ?? L.titleSize} font={ctx.head} theme={ctx.theme} />}
      {ctx.scene.subtitle && (
        <div style={{marginTop: L.subSize * 0.4, fontFamily: ctx.body, fontWeight: 700, fontSize: L.subSize, color: ctx.theme.accent, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`}}>
          {ctx.scene.subtitle}
        </div>
      )}
    </div>
  );
};

const Badge: React.FC<{ctx: SceneCtx}> = ({ctx}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 9}});
  const d = L.titleSize * 1.1;
  return (
    <div style={{width: d, height: d, margin: '0 auto 12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ctx.theme.accent, color: '#111', fontFamily: ctx.head, fontWeight: 800, fontSize: d * 0.6, transform: `scale(${s}) rotate(${(1 - s) * 180}deg)`, boxShadow: `0 0 40px ${ctx.theme.accent}`}}>
      {ctx.scene.badge}
    </div>
  );
};

const Stage: React.FC<{ctx: SceneCtx; top?: number; height?: number; scale?: number; progress?: number}> = ({ctx, top, height, scale, progress}) => {
  const L = useLayout();
  const s = ctx.scene;
  const model = s.model ?? (s.images?.length ? 'image' : 'phone');
  return (
    <div style={{position: 'absolute', top: top ?? L.stageTop, left: 0, width: L.w, height: height ?? L.stageH}}>
      <Stage3D
        model={model}
        color={s.modelColor}
        theme={ctx.theme}
        width={L.w}
        height={height ?? L.stageH}
        images={(s.images ?? []).map(ctx.asset)}
        screen={s.screen}
        label={s.label ?? (model === 'card' ? ctx.brand : s.unit)}
        font={ctx.fontName}
        scale={scale ?? 1}
        progress={progress ?? 1}
      />
    </div>
  );
};

const Pills: React.FC<{ctx: SceneCtx; variant?: 'accent' | 'glass'}> = ({ctx, variant}) => {
  const L = useLayout();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: L.pillTop, left: L.w * 0.04, right: L.w * 0.04, textAlign: 'center'}}>
      {(ctx.scene.items ?? []).map((it, i) => (
        <Pill key={i} text={it.text} at={localAt(ctx, it.at, i, fps)} theme={ctx.theme} font={ctx.body} size={L.pillSize} variant={variant} />
      ))}
    </div>
  );
};

// ── scene types ──────────────────────────────────────────────────────────────

const Hook: React.FC<{ctx: SceneCtx}> = ({ctx}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const shake = f < 10 ? Math.sin(f * 2.5) * (10 - f) * 1.5 : 0; // impact shake on the first beat
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
      <Header ctx={ctx} size={L.titleSize * 1.15} />
      <Stage ctx={ctx} top={L.stageTop + L.h * 0.02} />
      <Pills ctx={ctx} variant="glass" />
    </AbsoluteFill>
  );
};

/** The 3D explanation scene: hero model animates through its "explained" state while callouts appear around it. */
const Explain3D: React.FC<{ctx: SceneCtx}> = ({ctx}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(f, [8, ctx.durationInFrames * 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const items = ctx.scene.items ?? [];
  const cx = L.w / 2, cy = L.stageTop + L.stageH / 2;
  const slots = L.v
    ? [[0.2, 0.3], [0.8, 0.42], [0.2, 0.62], [0.8, 0.74], [0.5, 0.92]]
    : [[0.18, 0.35], [0.82, 0.35], [0.18, 0.65], [0.82, 0.65], [0.5, 0.9]];
  return (
    <AbsoluteFill>
      <Header ctx={ctx} />
      <Stage ctx={ctx} progress={progress} scale={1.05} />
      <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0}}>
        {items.map((it, i) => {
          const at = localAt(ctx, it.at, i, fps);
          const [sx, sy] = slots[i % slots.length];
          const x = L.w * sx, y = L.stageTop + L.stageH * sy;
          const len = Math.hypot(cx - x, cy - y) * 0.55;
          const p = interpolate(f - at, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <g key={i} opacity={f >= at ? 1 : 0}>
              <line x1={x} y1={y} x2={x + (cx - x) * 0.55} y2={y + (cy - y) * 0.55} stroke={ctx.theme.accent} strokeWidth={L.w * 0.004} strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
              <circle cx={x + (cx - x) * 0.55} cy={y + (cy - y) * 0.55} r={L.w * 0.01 * p} fill={ctx.theme.accent} />
            </g>
          );
        })}
      </svg>
      {items.map((it, i) => {
        const [sx, sy] = slots[i % slots.length];
        return (
          <div key={i} style={{position: 'absolute', left: L.w * sx, top: L.stageTop + L.stageH * sy, transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap'}}>
            <Pill text={it.text} at={localAt(ctx, it.at, i, fps)} theme={ctx.theme} font={ctx.body} size={L.pillSize} variant={i % 2 ? 'glass' : 'accent'} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Feature: React.FC<{ctx: SceneCtx}> = ({ctx}) => (
  <AbsoluteFill>
    <Header ctx={ctx} />
    <Stage ctx={ctx} progress={1} />
    <Pills ctx={ctx} />
  </AbsoluteFill>
);

const Steps: React.FC<{ctx: SceneCtx}> = ({ctx}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = ctx.scene.items ?? [];
  const top = L.v ? L.h * 0.42 : L.h * 0.32;
  const stepH = L.v ? L.h * 0.075 : L.h * 0.12;
  const active = items.reduce((a, it, i) => (f >= localAt(ctx, it.at, i, fps) ? i : a), -1);
  return (
    <AbsoluteFill>
      <Header ctx={ctx} />
      <Stage ctx={ctx} top={L.v ? L.h * 0.17 : L.h * 0.2} height={L.v ? L.h * 0.25 : L.h * 0.6} scale={0.7} />
      {items.map((it, i) => {
        const at = localAt(ctx, it.at, i, fps);
        const s = spring({frame: f - at, fps, config: {damping: 13}});
        const on = i === active;
        return (
          <div key={i} style={{position: 'absolute', top: top + i * stepH * 1.15, left: L.v ? L.w * 0.08 : L.w * 0.45, right: L.w * 0.08, height: stepH, display: 'flex', alignItems: 'center', gap: stepH * 0.3, padding: `0 ${stepH * 0.3}px`, borderRadius: stepH * 0.3, background: on ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.06)', border: `3px solid ${on ? ctx.theme.accent : 'transparent'}`, opacity: s, transform: `translateX(${(1 - s) * -L.w * 0.3}px)`}}>
            <div style={{flex: `0 0 ${stepH * 0.7}px`, height: stepH * 0.7, borderRadius: '50%', background: i < active || on ? ctx.theme.accent : 'rgba(255,255,255,.2)', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ctx.head, fontWeight: 800, fontSize: stepH * 0.42}}>
              {i < active ? '✓' : i + 1}
            </div>
            <div style={{fontFamily: ctx.body, fontWeight: 800, fontSize: stepH * 0.36, color: '#fff'}}>{it.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Stat: React.FC<{ctx: SceneCtx}> = ({ctx}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const s = ctx.scene;
  const v = interpolate(f, [6, 40], [s.from ?? 0, s.value ?? 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dec = String(s.value ?? 0).includes('.') ? 1 : 0;
  return (
    <AbsoluteFill>
      <Header ctx={ctx} />
      <Stage ctx={ctx} top={L.stageTop + L.stageH * 0.38} height={L.stageH * 0.7} scale={0.9} />
      <div style={{position: 'absolute', top: L.stageTop, left: 0, right: 0, textAlign: 'center', fontFamily: ctx.head, fontWeight: 800, fontSize: L.titleSize * 2.6, lineHeight: 1, color: ctx.theme.accent, textShadow: `0 0 60px ${ctx.theme.accent}88`}}>
        {v.toLocaleString('en-IN', {minimumFractionDigits: dec, maximumFractionDigits: dec})}
        <span style={{fontSize: L.titleSize * 1.3, marginLeft: 12, color: '#fff'}}>{s.unit}</span>
      </div>
      <Pills ctx={ctx} variant="glass" />
    </AbsoluteFill>
  );
};

const Compare: React.FC<{ctx: SceneCtx}> = ({ctx}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = ctx.scene;
  const col = (side: 'left' | 'right', i: number) => {
    const d = s[side]!;
    const good = side === 'right';
    const sp = spring({frame: f - 8 - i * 12, fps, config: {damping: 13}});
    return (
      <div style={{flex: 1, margin: L.w * 0.015, padding: L.w * 0.035, borderRadius: L.w * 0.04, background: good ? `${ctx.theme.accent}22` : 'rgba(239,68,68,.15)', border: `4px solid ${good ? ctx.theme.accent : '#ef4444'}`, transform: `translateY(${(1 - sp) * 200}px)`, opacity: sp}}>
        <div style={{fontFamily: ctx.head, fontWeight: 800, fontSize: L.pillSize * 1.4, color: good ? ctx.theme.accent : '#f87171', marginBottom: L.w * 0.02}}>{d.title}</div>
        {d.items.map((t, k) => (
          <div key={k} style={{fontFamily: ctx.body, fontWeight: 700, fontSize: L.pillSize, color: '#fff', margin: `${L.w * 0.012}px 0`, opacity: interpolate(f, [14 + i * 12 + k * 6, 22 + i * 12 + k * 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            {good ? '✓' : '✕'} {t}
          </div>
        ))}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Header ctx={ctx} />
      <div style={{position: 'absolute', top: L.v ? L.h * 0.3 : L.h * 0.3, left: L.w * 0.04, right: L.w * 0.04, display: 'flex'}}>
        {col('left', 0)}
        {col('right', 1)}
      </div>
      {s.model && <Stage ctx={ctx} top={L.v ? L.h * 0.55 : L.h * 0.6} height={L.v ? L.h * 0.22 : L.h * 0.35} scale={0.8} />}
    </AbsoluteFill>
  );
};

const CTA: React.FC<{ctx: SceneCtx}> = ({ctx}) => {
  const L = useLayout();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ctx2 = {...ctx, scene: {...ctx.scene, model: ctx.scene.model ?? 'card'}};
  const items = ctx.scene.items ?? [];
  const pulse = 1 + 0.05 * Math.sin((f / fps) * 7);
  return (
    <AbsoluteFill>
      <Header ctx={ctx} />
      <Stage ctx={ctx2} top={L.stageTop - L.h * 0.03} height={L.stageH * 0.62} />
      {items[0] && (
        <div style={{position: 'absolute', top: L.v ? L.h * 0.5 : L.h * 0.72, left: 0, right: 0, textAlign: 'center', transform: `scale(${pulse})`}}>
          <Pill text={items[0].text} at={localAt(ctx, items[0].at, 0, fps)} theme={{...ctx.theme, accent: '#22c55e'}} font={ctx.body} size={L.pillSize * 1.2} />
        </div>
      )}
      {items[1] && f >= localAt(ctx, items[1].at, 1, fps) && (
        <div style={{position: 'absolute', top: L.v ? L.h * 0.585 : L.h * 0.84, left: L.w * 0.1, right: L.w * 0.1, padding: L.pillSize * 0.7, borderRadius: `${L.pillSize}px ${L.pillSize}px ${L.pillSize}px 6px`, background: '#fff', color: '#111', fontFamily: ctx.body, fontWeight: 800, fontSize: L.pillSize * 1.05, transform: `scale(${spring({frame: f - localAt(ctx, items[1].at, 1, fps), fps, config: {damping: 10}})})`, boxShadow: '0 20px 60px rgba(0,0,0,.4)'}}>
          {items[1].text}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC<{ctx: SceneCtx}>> = {hook: Hook, explain3d: Explain3D, feature: Feature, steps: Steps, stat: Stat, compare: Compare, cta: CTA};
