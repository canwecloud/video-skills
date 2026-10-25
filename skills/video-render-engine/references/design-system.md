# Design system

## Background styles (`background` on the spec or per scene)

| Style | Look | Best for |
|---|---|---|
| `aurora` (default) | flowing color ribbons, light rays from the top, drifting bokeh, vignette, film grain | hooks, features, general explainers |
| `studio` | dark backdrop, top spotlight cone, colored rim lights, reflective floor | product hero shots, phone UI, vault/premium reveals |
| `cyber` | neon horizon glow, scrolling perspective grid (floor and ceiling), scanlines | speed, downloads, gaming, AI, specs and stats |

Every 3D model automatically sits in a **stage halo**: an accent spotlight disc, a rotating
ring and a floor shadow. That makes it pop on any background. Mix styles: open on `aurora`,
put the product on `studio`, put speed and number beats on `cyber`. The style change works
as a pattern interrupt, which helps viewers stay.

## Themes (color palettes)

| Theme | Feel | Use for |
|---|---|---|
| `sunset` | red, pink, orange | hooks, launches, hype |
| `fire` | red, orange, yellow | "थांबा!" / warning beats, deals |
| `ocean` | cyan, blue, violet | speed, downloads, internet |
| `mint` | green, teal | security, privacy, "safe" verdicts |
| `royal` | violet, pink, gold | premium, vault, secrets |
| `midnight` | indigo, cyan | AI, futuristic, chips |
| `neon` | aqua, purple, pink | gaming, Gen-Z topics |
| `saffron` | saffron, coral, yellow | Indian festive, money, ₹ topics |

Change the theme every 1–2 scenes. The color shift works as a pattern interrupt, which helps
viewers stay.

## Font library (vendor/fonts, all SIL OFL)

| Role | Recommended | Alternatives |
|---|---|---|
| Hook / titles | **Baloo2** (rounded, friendly, very legible Devanagari) | Mukta-ExtraBold, YatraOne-Regular (bold display), RozhaOne-Regular (high-contrast serif for "news" vibe), Khand-Bold / Teko (condensed, tech) |
| Captions | **Baloo2** or Mukta-ExtraBold | Hind-Bold, AnekDevanagari |
| Body / pills | **Mukta-ExtraBold** | Hind-SemiBold, NotoSansDevanagari |
| Marathi-specific forms | TiroDevanagariMarathi-Regular | uses the Marathi forms of श, ल and अ |
| Hindi editorial | TiroDevanagariHindi-Regular | |
| Handwritten accent | Kalam-Bold | arrows and "notes" |
| Latin fallback | Poppins-ExtraBold | |

Never use a Latin-only font for Devanagari text. It renders as boxes (□□).

## Layout rules (9:16)

- Keep the top 3% for the brand pill and leave the bottom 15% clear for the Shorts/Reels UI.
  Captions sit just above that.
- Use one title per scene, ≤ 5 words, with ≤ 1 `*highlight*`.
- Pills hold ≤ 2 words each, with ≤ 4 per scene.
- Captions hold ≤ 8 words and must never overlap pills. Check this in the preview stills.
- Something must move every 2–3 s. The engine's idle orbit, float, gradient drift and timed
  items cover this as long as every scene has 2+ timed `items`.

## Choosing a 3D model (topic → model)

| Topic | Model | Explanation beat |
|---|---|---|
| App, phone, mobile tips | `phone` with `screen` | put the UI words on the screen |
| Privacy, antivirus, VPN, safe | `shield` | the check mark builds in |
| Password, vault, hidden files, encryption | `lock` | the shackle snaps shut |
| Internet, DNS, browser, global | `globe` | rings orbit |
| Download, speed, upload | `download` | the arrow drops into the tray |
| Processor, AI, performance | `chip` | pins pulse |
| Cloud storage, backup | `cloud` | |
| Battery, charging | `battery` | fills to full |
| Wi-Fi, 5G, network | `wifi` | bars pulse outward |
| Files, storage, organizer | `folder` | opens with a page rising |
| Launch, growth, "fast" | `rocket` | flame flickers |
| Price, money, ₹ savings | `coin` (label "₹") | |
| Brand / CTA | `card` (label = brand) | |
| Anything else | `image` + Fluent 3D emoji | e.g. camera, headphones, laptop, robot, satellite |
