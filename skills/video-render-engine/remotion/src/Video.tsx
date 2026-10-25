import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useVideoConfig} from 'remotion';
import {Captions, ProgressBar, Transition} from './components/Layers';
import {Background} from './components/Backgrounds';
import {loadFonts, stack} from './fonts';
import {SCENES, useLayout} from './scenes/Scenes';
import {theme as getTheme} from './theme';
import type {Spec} from './types';

const asset = (p: string) => (/^https?:/.test(p) ? p : staticFile(`job/${p}`));

export const Video: React.FC<{spec: Spec}> = ({spec}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const L = useLayout();
  const [handle] = useState(() => delayRender('fonts'));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadFonts().then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);

  const base = getTheme(spec.theme);
  const headName = spec.fonts?.head ?? 'Baloo2';
  const bodyName = spec.fonts?.body ?? 'Mukta-ExtraBold';
  const head = stack(headName, spec.fonts?.latin);
  const body = stack(bodyName, spec.fonts?.latin);
  const scenes = [...spec.scenes].sort((a, b) => a.start - b.start);
  const captions = spec.captions ?? [];

  // Music ducks under speech: smoothed by sampling caption coverage ±0.25 s.
  const speaking = (t: number) => captions.some((c) => t >= c.start && t < c.end);
  const musicVol = (f: number) => {
    const t = f / fps;
    const samples = [-0.25, -0.12, 0, 0.12, 0.25].map((d) => (speaking(t + d) ? 1 : 0));
    const s = samples.reduce((a, b) => a + b, 0) / samples.length;
    const vol = spec.music?.volume ?? 0.16;
    const fadeOut = Math.min(1, (durationInFrames - f) / (fps * 1.5));
    return vol * (1 - s * (1 - (spec.music?.duck ?? 0.35))) * Math.max(0, fadeOut);
  };

  return (
    <AbsoluteFill style={{background: base.bg}}>
      <Background theme={base} style={spec.background} />
      {ready &&
        scenes.map((s, i) => {
          const from = Math.round(s.start * fps);
          const to = i + 1 < scenes.length ? Math.round(scenes[i + 1].start * fps) : durationInFrames;
          const Comp = SCENES[s.type] ?? SCENES.feature;
          const th = s.theme ? getTheme(s.theme) : base;
          return (
            <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} name={`${i + 1}. ${s.type}`}>
              {(s.theme || s.background) && <Background theme={th} style={s.background ?? spec.background} />}
              <Transition durationInFrames={to - from}>
                <Comp ctx={{scene: s, theme: th, head, body, fontName: headName, durationInFrames: to - from, asset, brand: spec.brand}} />
              </Transition>
              {spec.sfx !== false && i > 0 && <Audio src={staticFile('sfx/whoosh.wav')} volume={0.35} />}
              {spec.sfx !== false &&
                (s.items ?? []).map((it, k) =>
                  it.at !== undefined ? (
                    <Sequence key={k} from={Math.max(0, Math.round((it.at - s.start) * fps))}>
                      <Audio src={staticFile('sfx/pop.wav')} volume={0.3} />
                    </Sequence>
                  ) : null,
                )}
            </Sequence>
          );
        })}
      {ready && spec.brand && (
        <div style={{position: 'absolute', top: L.h * 0.03, left: 0, right: 0, textAlign: 'center'}}>
          <span style={{fontFamily: body, fontWeight: 700, fontSize: L.pillSize * 0.75, color: '#fff', letterSpacing: 2, padding: '8px 22px', borderRadius: 999, background: 'rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.2)'}}>{spec.brand}</span>
        </div>
      )}
      {ready && <Captions captions={captions} font={head} theme={base} size={L.capSize} bottom={L.capBottom} />}
      <ProgressBar theme={base} total={durationInFrames} />
      {spec.voiceover && <Audio src={asset(spec.voiceover)} />}
      {spec.music && <Audio src={asset(spec.music.src)} loop volume={musicVol} />}
    </AbsoluteFill>
  );
};
