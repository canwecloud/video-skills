# video-skills

Claude skills that turn a tech topic into a **finished, 3D-animated Marathi or Hindi Short**:
**research → viral hook script → female AI voiceover → Remotion + three.js render → upload kit.**

| Skill | What it does |
|---|---|
| [`marathi-tech-content`](skills/marathi-tech-content/SKILL.md) | Marathi research, viral-hook scripts (12 formulas), Poorvi voice, scene plan, render |
| [`hindi-tech-content`](skills/hindi-tech-content/SKILL.md) | Hindi/Hinglish, same pipeline tuned for the faster Hindi feed, Ritika voice |
| [`video-render-engine`](skills/video-render-engine/SKILL.md) | Remotion + React Three Fiber renderer: 14 animated 3D models, 7 scene types, gradient themes, 18 Devanagari/Latin fonts, karaoke captions, music ducking, SFX; plus asset tools (3D emoji, Iconify, Unsplash, background removal, Picsart, CC-BY music, Google Trends, autocomplete, Instagram hashtags) |

## Install

```bash
cp -r skills/* ~/.claude/skills/
bash ~/.claude/skills/video-render-engine/scripts/setup.sh   # fonts, Remotion deps, rembg model
```

Requires Node 18+, Python 3.10+ and ffmpeg. Optional environment variables:
`UNSPLASH_ACCESS_KEY`, `PICSART_API_KEY`, `IG_USER_ID` + `IG_ACCESS_TOKEN`.

Then ask: *"Marathi short on <topic>"* or *"/hindi-tech-content <topic>"*.

## Example

`productions/8xdl-marathi/short-3d/` holds a complete spec, assets and render for the 8XDL app.

## Licenses

Remotion is free for individuals and companies with ≤ 3 employees; larger teams need a
[company license](https://www.remotion.pro). Music is Kevin MacLeod, CC BY 4.0 (credit
required). Fonts are SIL OFL. Fluent emoji, three.js and R3F are MIT.
