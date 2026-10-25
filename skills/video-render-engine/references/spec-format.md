# spec.json reference

All times are **seconds on the voiceover timeline**. Asset paths are relative to `--assets`.

## Top level

| Field | Type | Default | Notes |
|---|---|---|---|
| `format` | `"short"` \| `"long"` | short | short = 1080×1920 (Shorts/Reels), long = 1920×1080 |
| `fps` | number | 30 | |
| `duration` | number | voiceover length + 0.4 s | |
| `theme` | string | ocean | color palette, see design-system.md |
| `background` | `aurora` \| `studio` \| `cyber` | aurora | background style; scenes can override |
| `fonts.head` / `fonts.body` | font file stem | Baloo2 / Mukta-ExtraBold | any file in vendor/fonts |
| `fonts.latin` | font file stem | Poppins-ExtraBold | fallback for English words |
| `brand` | string | — | top pill and default `card` label |
| `voiceover` | path | — | |
| `music` | `{src, volume=0.16, duck=0.35}` | — | ducks to `volume*duck` under speech, fades out over the last 1.5 s |
| `sfx` | bool | true | whoosh on each scene cut, pop on each timed item |
| `captions` | `[{start, end, text}]` | [] | karaoke: words light up in turn; keep ≤ 8 words |
| `scenes` | `[Scene]` | — | each scene runs until the next one's `start` |

## Scene

| Field | Used by | Notes |
|---|---|---|
| `start` | all | seconds |
| `type` | all | `hook` `explain3d` `feature` `steps` `stat` `compare` `cta` |
| `title` | all | `*word*` paints the word on an accent highlight; use 1 per title |
| `subtitle` | all | accent-colored line under the title |
| `badge` | all | round number badge above the title (`"१"`, `"२"`, `"1"`) |
| `model` | most | 3D model key (SKILL.md); `image` = first entry in `images` as a 3D sticker |
| `modelColor` | most | hex override |
| `label` | card / coin | text printed on the model |
| `screen` | phone | `{title, lines[]}` drawn on the phone display (≤ 4 lines, ≤ 14 chars each) |
| `images` | most | transparent PNG/SVG that orbit the model |
| `items` | hook / explain3d / feature / steps / stat / cta | `[{text, at}]`; `at` = the second the word is spoken |
| `value`, `from`, `unit` | stat | counts from `from` to `value` |
| `left`, `right` | compare | `{title, items[]}`; left = bad (✕), right = good (✓) |
| `theme` | all | per-scene palette change |
| `background` | all | per-scene background style |

## Scene-type cheat sheet

- **hook**: giant kinetic title, impact shake, model spins in, glass pills. Always the first scene.
- **explain3d**: the model animates its concept: the lock closes, the shield builds its check,
  the battery fills, the folder opens, the download arrow drops. Up to 5 callouts with lines
  drawn to the model. Use it for the "how does it work" beat.
- **feature**: numbered feature with the model and accent pills.
- **steps**: tutorial list; each step slides in at `at` and earlier steps get ✓.
- **stat**: big counting number (price ₹, speed, battery %, storage GB).
- **compare**: before/after or old-vs-new cards.
- **cta**: brand card, a pulsing green button (`items[0]`) and a comment bubble (`items[1]`).
