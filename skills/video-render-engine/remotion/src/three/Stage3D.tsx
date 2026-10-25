import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Billboard, DEFAULT_COLORS, MODELS} from './Models';
import type {Theme} from '../theme';

type Props = {
  model: string;
  color?: string;
  theme: Theme;
  width: number;
  height: number;
  images?: string[];
  screen?: {title?: string; lines?: string[]};
  label?: string;
  font: string;
  scale?: number;
  /** 0→1 over the scene; drives "explanation" states (lock closes, battery fills, check appears…) */
  progress?: number;
  orbit?: boolean;
};

/** Hero 3D object: springs in with a spin, then idles with a slow orbit + float. Frame-deterministic. */
export const Stage3D: React.FC<Props> = ({model, color, theme, width, height, images = [], screen, label, font, scale = 1, progress = 1, orbit = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const enter = spring({frame, fps, config: {damping: 13, stiffness: 90, mass: 0.9}});
  const Model = MODELS[model] ?? MODELS.phone;
  const c = color ?? DEFAULT_COLORS[model] ?? theme.a;
  const isSticker = model === 'image';
  const rotY = interpolate(enter, [0, 1], [-Math.PI * 1.2, 0]) + (orbit && !isSticker ? Math.sin(t * 0.7) * 0.45 : Math.sin(t * 0.9) * 0.15);
  const rotX = Math.sin(t * 0.5) * 0.08;
  const floatY = Math.sin(t * 1.6) * 0.12;
  const sticker = isSticker ? images[0] : undefined;
  const orbiters = isSticker ? images.slice(1) : images;

  return (
    <ThreeCanvas width={Math.round(width)} height={Math.round(height)} camera={{position: [0, 0, 8], fov: 35}} gl={{antialias: true, preserveDrawingBuffer: true}}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />
      <directionalLight position={[-5, -2, 3]} intensity={0.6} color={theme.b} />
      <pointLight position={[-3, 2, 3]} intensity={30} color={theme.a} distance={12} />
      <pointLight position={[3, -2, 2]} intensity={25} color={theme.c} distance={12} />
      <group scale={enter * scale} rotation={[rotX, rotY, 0]} position={[0, floatY, 0]}>
        <Model t={t} color={c} accent={theme.accent} progress={progress} screen={screen} image={sticker} label={label} font={font} />
      </group>
      {orbiters.map((src, i) => {
        const a = (i / Math.max(1, orbiters.length)) * Math.PI * 2 + t * 0.6;
        const pop = spring({frame: frame - 8 - i * 5, fps, config: {damping: 10}});
        return (
          <group key={src + i} position={[Math.cos(a) * 2.6, Math.sin(a * 1.3) * 0.9 + (i % 2 ? 1.2 : -1.2), Math.sin(a) * 1.2 + 0.5]} scale={pop}>
            <Billboard src={src} size={1.1} />
          </group>
        );
      })}
    </ThreeCanvas>
  );
};
