#!/usr/bin/env node
// Render a spec.json to MP4 (or preview stills) with Remotion.
//   node render.mjs spec.json --assets ./assets --out video.mp4
//   node render.mjs spec.json --assets ./assets --stills 1,5.5,12 --out previews/
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
const specPath = path.resolve(argv[0] ?? 'spec.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const assets = path.resolve(opt('--assets', path.dirname(specPath)));
const out = path.resolve(opt('--out', 'out.mp4'));
const stills = opt('--stills');

// public/: fonts (vendor), synthesized SFX, and this job's assets
const pub = path.join(HERE, 'public');
fs.rmSync(path.join(pub, 'job'), {recursive: true, force: true});
fs.mkdirSync(path.join(pub, 'sfx'), {recursive: true});
fs.cpSync(assets, path.join(pub, 'job'), {recursive: true, dereference: true});
fs.cpSync(path.join(HERE, '..', 'vendor', 'fonts'), path.join(pub, 'fonts'), {recursive: true});
const sfx = {
  'whoosh.wav': ['-f', 'lavfi', '-i', 'anoisesrc=d=0.45:c=pink:a=0.7', '-af', 'highpass=f=500,lowpass=f=7000,afade=t=in:d=0.12,afade=t=out:st=0.15:d=0.3'],
  'pop.wav': ['-f', 'lavfi', '-i', 'sine=f=1200:d=0.09', '-af', 'afade=t=out:st=0.01:d=0.08,volume=0.6'],
};
for (const [name, args] of Object.entries(sfx)) {
  const p = path.join(pub, 'sfx', name);
  if (!fs.existsSync(p)) execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args, p]);
}

// Prefer an installed headless shell (Playwright ships one); otherwise Remotion downloads its own.
const candidates = [process.env.REMOTION_BROWSER, ...fs.existsSync('/opt/pw-browsers') ? fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell')).map((d) => `/opt/pw-browsers/${d}/chrome-headless-shell-linux64/chrome-headless-shell`) : []];
const browserExecutable = candidates.find((p) => p && fs.existsSync(p)) ?? null;

const id = spec.format === 'long' ? 'Long' : 'Short';
const inputProps = {spec};
console.log(`bundling… (${id}, assets: ${assets})`);
const serveUrl = await bundle({entryPoint: path.join(HERE, 'src', 'index.ts'), publicDir: pub});
const chromiumOptions = {gl: 'swangle'};
const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable, chromiumOptions});

if (stills) {
  fs.mkdirSync(out, {recursive: true});
  for (const s of stills.split(',').map(Number)) {
    const output = path.join(out, `still-${s}.png`);
    await renderStill({composition, serveUrl, inputProps, frame: Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps)), output, browserExecutable, chromiumOptions});
    console.log(output);
  }
  process.exit(0);
}

const raw = out.replace(/\.mp4$/, '') + '.raw.mp4';
let last = -1;
await renderMedia({
  composition, serveUrl, inputProps, codec: 'h264', crf: 18, outputLocation: raw, browserExecutable, chromiumOptions,
  concurrency: Math.max(1, Math.min(8, os.cpus().length - 1)),
  onProgress: ({progress}) => {
    const p = Math.floor(progress * 20);
    if (p !== last) (last = p), console.log(`render ${Math.round(progress * 100)}%`);
  },
});
// Final loudness pass: −14 LUFS (YouTube/Instagram target), video stream copied untouched.
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', raw, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', out]);
fs.rmSync(raw);
console.log(`done → ${out}`);
