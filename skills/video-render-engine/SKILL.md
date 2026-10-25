---
name: video-render-engine
description: >
  Render finished vertical Shorts/Reels or 16:9 videos with 3D topic explanations from a
  voiceover + JSON scene spec, using Remotion and React Three Fiber. Covers rotating 3D
  models (phone, shield, lock, globe, chip, rocket and more), animated gradient backgrounds,
  Devanagari kinetic titles, karaoke captions, transparent 3D-emoji and cut-out assets,
  copyright-free music with ducking, and SFX. Use whenever a script + voiceover must become an
  actual MP4, or when fetching transparent images, music, trending keywords or
  background-removed cutouts. Used by marathi-tech-content and hindi-tech-content.
---

# Video Render Engine: voiceover + spec → 3D animated MP4

Pipeline: **voiceover → timings → spec.json → assets → preview stills → MP4**.

```
SKILL_DIR=<this skill's directory>        # e.g. ~/.claude/skills/video-render-engine
bash $SKILL_DIR/scripts/setup.sh           # once: fonts, Remotion deps, rembg model
```

## 1. Timings from the voiceover

Each caption and scene start must land on a real pause in the voice, not on the script's
estimate.

```bash
ffmpeg -i voiceover.mp3 -af silencedetect=noise=-35dB:d=0.35 -f null - 2>&1 | grep -oE 'silence_(start|end): [0-9.]+'
```

Each `silence_end` is where a phrase starts, and each `silence_start` is where it ends. If the
VideoDB connector is available, `upload_media` + `generate_transcript` also gives the text,
which you should use to check pronunciation. Split captions into ≤ 8-word chunks that follow
these pauses.

## 2. Assets (all license-safe for monetized video)

```bash
A=$SKILL_DIR/scripts/assets.py
python3 $A search-emoji lock                   # find Fluent 3D emoji names
python3 $A emoji locked --out job/             # transparent 3D PNG (MIT)
python3 $A icon logos:android-icon --out job/  # Iconify SVG: brand logos and UI icons
python3 $A unsplash "smartphone" --cutout --out job/   # needs UNSPLASH_ACCESS_KEY; credits file written
python3 $A cutout photo.jpg --out job/         # local background removal → transparent PNG
python3 $A picsart photo.jpg --out job/        # Picsart remove-bg (needs PICSART_API_KEY)
python3 $A music list                          # moods: tech, upbeat, chill, tutorial, hype, mystery…
python3 $A music tech --pick 0 --out job/      # CC-BY track + REQUIRED credit line
python3 $A trends --geo IN                     # Google Trends daily trending searches
python3 $A keywords "download manager" --lang mr   # YouTube autocomplete expansion
python3 $A instagram techtips                  # top co-occurring hashtags (IG_USER_ID + IG_ACCESS_TOKEN)
```

Do not use CleanPNG, Google Images or other "free PNG" rip sites. Their images are usually
copyrighted, and using them gets videos claimed or struck. Product photos and screenshots
should come from the user or the brand's press kit.

## 3. spec.json

Full schema: `references/spec-format.md`. Design rules: `references/design-system.md`.
Minimal shape:

```json
{
  "format": "short", "theme": "sunset", "brand": "8XDL · मराठी",
  "fonts": {"head": "Baloo2", "body": "Mukta-ExtraBold"},
  "voiceover": "voiceover.mp3",
  "music": {"src": "music-voxel-revolution.mp3", "volume": 0.14, "duck": 0.3},
  "captions": [{"start": 0, "end": 2.4, "text": "…"}],
  "scenes": [
    {"start": 0, "type": "hook", "title": "*३* वेगवेगळे Apps?", "model": "image", "images": ["emoji-mobile-phone.png"]},
    {"start": 12.6, "type": "explain3d", "badge": "१", "title": "Fast *Download*", "model": "download",
     "items": [{"text": "Multi-thread", "at": 15.2}, {"text": "Pause", "at": 18.6}]}
  ]
}
```

Scene types: `hook`, `explain3d` (the 3D explanation: the model animates through its
"explained" state while callout lines point at it), `feature`, `steps`, `stat`, `compare`, `cta`.

3D models: `phone` (draws `screen.title` / `screen.lines` on its display), `shield` (the check
mark builds in), `lock` (the shackle snaps shut), `globe`, `download`, `chip`, `cloud`,
`battery` (fills up), `wifi` (bars pulse), `folder` (opens), `rocket`, `coin`, `card` (brand
slab printed with `label`), and `image` (any transparent PNG as a thick 3D sticker). Any
`images` orbit the model as billboards.

## 4. Preview, then render

```bash
cd $SKILL_DIR/remotion
node render.mjs /path/spec.json --assets /path/job --stills 1,6,15,30 --out /path/previews   # check these first
node render.mjs /path/spec.json --assets /path/job --out /path/final.mp4
```

Look at the stills before the full render. Check that the Devanagari is shaped correctly, that
nothing overlaps the captions, and that each model reads at phone size. The full render is
slow: about 1–2 s per frame with software WebGL, so a 60 s Short takes 30–60 min. Run it in the
background. The final pass normalizes audio to −14 LUFS.

`npx remotion studio src/index.ts` opens the live editor if the user wants to tweak by hand.

## Licensing notes to tell the user

- **Remotion** is free for individuals and companies with ≤ 3 employees. Larger companies
  need a Remotion company license (remotion.pro).
- **Music:** paste the printed CC-BY credit into the video description.
- **Unsplash:** credit the photographer (credits file written next to the image).
- **Fonts** are SIL OFL, Fluent emoji are MIT, and three.js / R3F are MIT.
