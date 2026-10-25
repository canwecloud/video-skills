import React, {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {continueRender, delayRender} from 'remotion';

// ── helpers ──────────────────────────────────────────────────────────────────

export const useImageTexture = (src?: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [handle] = useState(() => (src ? delayRender(`texture ${src}`) : null));
  useEffect(() => {
    if (!src || handle === null) return;
    new THREE.TextureLoader().load(
      src,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        setTex(t);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle),
    );
  }, [src, handle]);
  return tex;
};

/** Text/UI drawn on a 2D canvas → texture. Fonts are already loaded by the time 3D renders. */
export const useCanvasTexture = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, deps: unknown[]) =>
  useMemo(() => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d')!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

/** Largest font size (≤ max) at which text fits maxWidth. */
const fit = (g: CanvasRenderingContext2D, text: string, font: (px: number) => string, max: number, maxWidth: number) => {
  let px = max;
  g.font = font(px);
  while (px > 10 && g.measureText(text).width > maxWidth) g.font = font((px -= 4));
  return px;
};

const extrude = (shape: THREE.Shape, depth = 0.35, bevel = 0.07) => {
  const g = new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 6, curveSegments: 32});
  g.center();
  return g;
};

const Glossy = ({color, metal = 0.3, rough = 0.25, emissive}: {color: string; metal?: number; rough?: number; emissive?: string}) => (
  <meshPhysicalMaterial color={color} metalness={metal} roughness={rough} clearcoat={1} clearcoatRoughness={0.15} emissive={emissive ?? '#000'} emissiveIntensity={emissive ? 0.35 : 0} />
);

export type ModelProps = {t: number; color: string; accent: string; progress: number; screen?: {title?: string; lines?: string[]}; image?: string; label?: string; font: string};

// ── models ───────────────────────────────────────────────────────────────────

const Phone: React.FC<ModelProps> = ({t, color, accent, screen, image, font}) => {
  const img = useImageTexture(image);
  const ui = useCanvasTexture(580, 1200, (g) => {
    const grd = g.createLinearGradient(0, 0, 580, 1200);
    grd.addColorStop(0, '#0f172a');
    grd.addColorStop(1, '#1e1b4b');
    g.fillStyle = grd;
    g.fillRect(0, 0, 580, 1200);
    g.fillStyle = accent;
    g.textAlign = 'center';
    fit(g, screen?.title ?? '', (px) => `800 ${px}px '${font}'`, 110, 520);
    g.fillText(screen?.title ?? '', 290, 190);
    (screen?.lines ?? []).forEach((l, i) => {
      g.fillStyle = 'rgba(255,255,255,0.08)';
      g.beginPath();
      g.roundRect(30, 270 + i * 170, 520, 140, 30);
      g.fill();
      g.fillStyle = '#fff';
      fit(g, l, (px) => `800 ${px}px '${font}'`, 62, 480);
      g.fillText(l, 290, 362 + i * 170);
    });
  }, [screen?.title, (screen?.lines ?? []).join('|'), accent, font]);
  return (
    <group>
      <RoundedBox args={[1.7, 3.4, 0.2]} radius={0.22} smoothness={8}>
        <Glossy color="#0b1020" metal={0.7} rough={0.2} />
      </RoundedBox>
      <mesh position={[0, 0, 0.105]}>
        <planeGeometry args={[1.52, 3.18]} />
        <meshBasicMaterial map={img ?? ui} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.48, 0.11]}>
        <capsuleGeometry args={[0.04, 0.22, 8, 16]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0.86, 0.6, 0]}>
        <boxGeometry args={[0.04, 0.5, 0.08]} />
        <Glossy color={color} metal={0.9} />
      </mesh>
      {/* screen glow */}
      <pointLight position={[0, 0, 0.8]} color={accent} intensity={2 + Math.sin(t * 3)} distance={3} />
    </group>
  );
};

const Shield: React.FC<ModelProps> = ({color, progress}) => {
  const body = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.4);
    s.bezierCurveTo(0.6, 1.1, 1.0, 1.1, 1.2, 1.1);
    s.lineTo(1.2, 0.1);
    s.bezierCurveTo(1.2, -0.8, 0.5, -1.3, 0, -1.5);
    s.bezierCurveTo(-0.5, -1.3, -1.2, -0.8, -1.2, 0.1);
    s.lineTo(-1.2, 1.1);
    s.bezierCurveTo(-1.0, 1.1, -0.6, 1.1, 0, 1.4);
    return extrude(s, 0.4, 0.1);
  }, []);
  const check = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.6, 0.05);
    s.lineTo(-0.15, -0.4);
    s.lineTo(0.65, 0.45);
    s.lineTo(0.48, 0.62);
    s.lineTo(-0.15, -0.02);
    s.lineTo(-0.42, 0.25);
    return extrude(s, 0.15, 0.04);
  }, []);
  return (
    <group>
      <mesh geometry={body}>
        <Glossy color={color} metal={0.4} />
      </mesh>
      <mesh geometry={check} position={[0, -0.05, 0.32]} scale={Math.min(1, progress * 1.5)}>
        <Glossy color="#ffffff" emissive="#ffffff" />
      </mesh>
    </group>
  );
};

const Lock: React.FC<ModelProps> = ({color, progress}) => {
  const lift = 0.45 * (1 - Math.min(1, progress * 1.4)); // shackle drops shut
  return (
    <group>
      <RoundedBox args={[2, 1.6, 0.7]} radius={0.18} smoothness={6} position={[0, -0.4, 0]}>
        <Glossy color={color} metal={0.25} rough={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.4 + lift, 0]}>
        <torusGeometry args={[0.62, 0.14, 24, 64, Math.PI]} />
        <Glossy color="#cbd5e1" metal={1} rough={0.15} />
      </mesh>
      <mesh position={[-0.62, 0.25 + lift, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 24]} />
        <Glossy color="#cbd5e1" metal={1} rough={0.15} />
      </mesh>
      <mesh position={[0.62, 0.25 + lift * 0.2, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 24]} />
        <Glossy color="#cbd5e1" metal={1} rough={0.15} />
      </mesh>
      <mesh position={[0, -0.35, 0.36]}>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 32]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

const Globe: React.FC<ModelProps> = ({t, color, accent}) => (
  <group rotation={[0.3, t * 0.5, 0]}>
    <mesh>
      <sphereGeometry args={[1.3, 48, 48]} />
      <meshPhysicalMaterial color="#0b1a3a" transparent opacity={0.85} roughness={0.2} clearcoat={1} />
    </mesh>
    <mesh>
      <sphereGeometry args={[1.32, 24, 16]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
    </mesh>
    {[0, 1, 2].map((i) => (
      <mesh key={i} rotation={[Math.PI / 2 + i * 0.5, i * 0.9 + t * 0.6, 0]}>
        <torusGeometry args={[1.75 + i * 0.12, 0.018, 8, 128]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    ))}
  </group>
);

const Download: React.FC<ModelProps> = ({t, color, accent}) => {
  const arrow = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.32, 1.1);
    s.lineTo(0.32, 1.1);
    s.lineTo(0.32, 0.1);
    s.lineTo(0.8, 0.1);
    s.lineTo(0, -0.8);
    s.lineTo(-0.8, 0.1);
    s.lineTo(-0.32, 0.1);
    return extrude(s, 0.35, 0.08);
  }, []);
  const bob = ((t * 1.2) % 1) * 0.5;
  return (
    <group>
      <mesh geometry={arrow} position={[0, 0.4 - bob, 0]}>
        <Glossy color={color} />
      </mesh>
      <RoundedBox args={[2.4, 0.3, 0.6]} radius={0.12} position={[0, -1.1, 0]}>
        <Glossy color={accent} metal={0.6} />
      </RoundedBox>
    </group>
  );
};

const Chip: React.FC<ModelProps> = ({color, accent, t}) => (
  <group rotation={[0.6, 0, 0]}>
    <RoundedBox args={[2.2, 2.2, 0.3]} radius={0.08}>
      <Glossy color="#111827" metal={0.6} />
    </RoundedBox>
    <RoundedBox args={[1.3, 1.3, 0.1]} radius={0.05} position={[0, 0, 0.18]}>
      <Glossy color={color} metal={0.9} emissive={accent} />
    </RoundedBox>
    {Array.from({length: 32}).map((_, i) => {
      const side = Math.floor(i / 8), k = (i % 8) - 3.5;
      const pos: [number, number, number] = side === 0 ? [k * 0.24, 1.25, 0] : side === 1 ? [k * 0.24, -1.25, 0] : side === 2 ? [1.25, k * 0.24, 0] : [-1.25, k * 0.24, 0];
      return (
        <mesh key={i} position={pos} rotation={[0, 0, side > 1 ? Math.PI / 2 : 0]}>
          <boxGeometry args={[0.08, 0.3, 0.06]} />
          <meshStandardMaterial color="#facc15" metalness={1} roughness={0.2} emissive="#facc15" emissiveIntensity={0.3 + 0.3 * Math.sin(t * 4 + i)} />
        </mesh>
      );
    })}
  </group>
);

const Cloud: React.FC<ModelProps> = ({color}) => (
  <group>
    {[[-0.8, -0.1, 0, 0.75], [0, 0.3, 0, 1], [0.85, -0.05, 0, 0.7], [0.35, -0.35, 0.3, 0.6], [-0.35, -0.35, 0.3, 0.6]].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[r, 48, 48]} />
        <meshPhysicalMaterial color={color} roughness={0.35} clearcoat={0.6} />
      </mesh>
    ))}
  </group>
);

const Battery: React.FC<ModelProps> = ({progress, color}) => (
  <group rotation={[0, 0, -Math.PI / 2]}>
    <RoundedBox args={[1.2, 2.6, 1]} radius={0.2}>
      <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.25} roughness={0.05} transmission={0.6} />
    </RoundedBox>
    <RoundedBox args={[0.5, 0.25, 0.5]} radius={0.06} position={[0, 1.42, 0]}>
      <Glossy color="#94a3b8" metal={0.9} />
    </RoundedBox>
    <mesh position={[0, -1.1 + 1.1 * progress, 0]} scale={[1, Math.max(0.02, progress), 1]}>
      <boxGeometry args={[0.9, 2.2, 0.75]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  </group>
);

const Wifi: React.FC<ModelProps> = ({t, color}) => (
  <group position={[0, -0.6, 0]}>
    <mesh>
      <sphereGeometry args={[0.2, 32, 32]} />
      <Glossy color={color} emissive={color} />
    </mesh>
    {[0.7, 1.2, 1.7].map((r, i) => (
      <mesh key={i} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[r, 0.12, 16, 64, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2 + 0.8 * Math.max(0, Math.sin(t * 4 - i))} />
      </mesh>
    ))}
  </group>
);

const Folder: React.FC<ModelProps> = ({color, progress}) => (
  <group>
    <RoundedBox args={[2.6, 1.9, 0.25]} radius={0.12} position={[0, 0, -0.1]}>
      <Glossy color={color} />
    </RoundedBox>
    <RoundedBox args={[1, 0.4, 0.25]} radius={0.1} position={[-0.75, 1, -0.1]}>
      <Glossy color={color} />
    </RoundedBox>
    <RoundedBox args={[2.2, 1.4, 0.05]} radius={0.04} position={[0, 0.25 * progress, 0.05]}>
      <meshStandardMaterial color="#ffffff" />
    </RoundedBox>
    <RoundedBox args={[2.7, 1.6, 0.25]} radius={0.12} position={[0, -0.2, 0.2]} rotation={[-0.25 * progress, 0, 0]}>
      <Glossy color={color} rough={0.35} />
    </RoundedBox>
  </group>
);

const Rocket: React.FC<ModelProps> = ({t, color, accent}) => (
  <group rotation={[0, 0, -0.5]} position={[0, Math.sin(t * 2) * 0.1, 0]}>
    <mesh>
      <cylinderGeometry args={[0.45, 0.5, 1.8, 48]} />
      <Glossy color="#f8fafc" metal={0.3} />
    </mesh>
    <mesh position={[0, 1.3, 0]}>
      <coneGeometry args={[0.45, 0.8, 48]} />
      <Glossy color={color} />
    </mesh>
    <mesh position={[0, 0.35, 0.44]}>
      <circleGeometry args={[0.2, 32]} />
      <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
    </mesh>
    {[0, 1, 2].map((i) => (
      <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0, -0.75, 0]}>
        <boxGeometry args={[0.06, 0.6, 1.2]} />
        <Glossy color={color} />
      </mesh>
    ))}
    <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]} scale={[1, 0.8 + 0.3 * Math.sin(t * 30), 1]}>
      <coneGeometry args={[0.35, 1, 32]} />
      <meshBasicMaterial color={accent} transparent opacity={0.85} toneMapped={false} />
    </mesh>
  </group>
);

const Coin: React.FC<ModelProps> = ({color, label, font}) => {
  const face = useCanvasTexture(512, 512, (g) => {
    g.fillStyle = color;
    g.fillRect(0, 0, 512, 512);
    g.fillStyle = '#7c4a03';
    fit(g, label ?? '₹', (px) => `800 ${px}px '${font}'`, 300, 400);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(label ?? '₹', 256, 280);
  }, [color, label, font]);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.3, 1.3, 0.25, 64]} />
      <meshPhysicalMaterial attach="material-0" color={color} metalness={1} roughness={0.2} />
      <meshPhysicalMaterial attach="material-1" map={face} metalness={0.6} roughness={0.25} />
      <meshPhysicalMaterial attach="material-2" map={face} metalness={0.6} roughness={0.25} />
    </mesh>
  );
};

/** Brand card: rounded slab with the brand name printed on it. */
const Card: React.FC<ModelProps> = ({color, accent, label, font}) => {
  const face = useCanvasTexture(1024, 640, (g) => {
    const grd = g.createLinearGradient(0, 0, 1024, 640);
    grd.addColorStop(0, accent);
    grd.addColorStop(1, color);
    g.fillStyle = grd;
    g.fillRect(0, 0, 1024, 640);
    g.fillStyle = '#111';
    fit(g, label ?? '', (px) => `800 ${px}px '${font}'`, 230, 900);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(label ?? '', 512, 340);
  }, [color, accent, label, font]);
  return (
    <group>
      <RoundedBox args={[3.2, 2, 0.3]} radius={0.2} smoothness={6}>
        <Glossy color={color} />
      </RoundedBox>
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[3.0, 1.85]} />
        <meshBasicMaterial map={face} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Any transparent PNG (Fluent 3D emoji, rembg cutout) as a thick floating sticker. */
const Sticker: React.FC<ModelProps> = ({image}) => {
  const tex = useImageTexture(image);
  if (!tex) return null;
  const ar = (tex.image?.width ?? 1) / (tex.image?.height ?? 1);
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0, -i * 0.012]}>
          <planeGeometry args={[2.8 * ar, 2.8]} />
          <meshBasicMaterial map={tex} transparent alphaTest={0.05} color={i ? '#666' : '#fff'} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export const MODELS: Record<string, React.FC<ModelProps>> = {
  phone: Phone, shield: Shield, lock: Lock, globe: Globe, download: Download, chip: Chip,
  cloud: Cloud, battery: Battery, wifi: Wifi, folder: Folder, rocket: Rocket, coin: Coin,
  card: Card, image: Sticker,
};

export const DEFAULT_COLORS: Record<string, string> = {
  phone: '#64748b', shield: '#22c55e', lock: '#fbbf24', globe: '#38bdf8', download: '#3b82f6', chip: '#a78bfa',
  cloud: '#f1f5f9', battery: '#22c55e', wifi: '#22d3ee', folder: '#fbbf24', rocket: '#ef4444', coin: '#fbbf24',
  card: '#ff7a00', image: '#ffffff',
};

/** Image billboard used for orbiting stickers around the hero model. */
export const Billboard: React.FC<{src: string; size?: number}> = ({src, size = 1}) => {
  const tex = useImageTexture(src);
  if (!tex) return null;
  return (
    <mesh>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.05} toneMapped={false} />
    </mesh>
  );
};
