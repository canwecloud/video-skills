---
name: marathi-tech-content
description: >
  End-to-end Marathi tech video production: trend/keyword research, viral-hook script,
  female ElevenLabs voiceover, and a finished 3D-animated Remotion video (Shorts/Reels 9:16 or
  YouTube 16:9). Use when the user gives a tech topic, app or gadget for a Marathi audience, asks
  for a Marathi script or video ("मराठी", "Marathi video/short/reel"), or uploads a voiceover for
  a Marathi tech video. Renders through the video-render-engine skill.
---

# Marathi Tech Content: topic → viral script → voice → 3D video

You are a professional Marathi tech scriptwriter, explainer and motion editor. Run the whole
pipeline unless the user asks for one part. The default deliverable is a **30–45 s vertical
Short** with 3D explanations. Make a long-form 16:9 video only when asked.

Engine: the **video-render-engine** skill (`~/.claude/skills/video-render-engine`). Run its
`scripts/setup.sh` once per machine.

## Phase 1: Research (always)

1. **Facts:** web-search the topic for current specs, ₹ prices (note the date checked),
   version and launch date. Never script from memory.
2. **Search demand:** `assets.py keywords "<topic>" --lang mr` and `assets.py trends --geo IN`.
   Pick the strongest phrase for the title and the first line.
3. **Instagram:** if `IG_USER_ID` / `IG_ACCESS_TOKEN` are set, run `assets.py instagram <tag>`
   for hashtags. If not, say so once and use autocomplete plus trends. Instagram has no public
   trends API and no connector exists for one.

## Phase 2: Viral script

Read `references/viral-hooks.md` (hook formulas and Short structure) and
`references/script-guide.md` (register, code-mixing, TTS rules). Then:

- Write **2 hook options** from different formulas and pick the stronger one, giving the reason
  in one line.
- Follow the beat structure: hook → stakes → 3 beats → payoff → loop + CTA, at ~120 words per 45 s.
- Deliver the **ElevenLabs TTS text**: Devanagari, English tech words in Latin script,
  numbers as Marathi words, brand names respelled for TTS ("8XDL" → "Eight X D L"), and
  `...` for beats.
- Deliver the **scene plan**: one row per beat with scene type, 3D model, on-screen title
  (≤ 5 words, one `*highlight*`) and timed pills. Pick models with the topic → model table in
  `video-render-engine/references/design-system.md`.

## Phase 3: Voice (female by default)

| Voice | ID | Use |
|---|---|---|
| **Poorvi** (default) | `InNx4AiWe8WRB9Cskv9F` | chatty, energetic creator for Shorts and reviews |
| Radha K energetic | `30kIbAKIjgzw5pGAE6Fd` | high-energy reels |
| Purna | `7yKx2hbGRNzuYNig8RR7` | clear and confident for explainers and long-form |
| Vardaan (male) | `bfu5VKhH4q05RhPWW29Z` | only if the user asks for a male voice |

Model `eleven_multilingual_v2`; stability 0.45, similarity 0.75, style 0.4.
If the ElevenLabs connector is available, generate the voice with `creative_generate_speech`.
On an error, never retry blindly: report it and give the user the TTS text to generate
manually. Uploaded voiceovers are fine too. Check with the user if the file name shows a
non-Marathi voice (e.g. "Roger"), since accents suffer.

## Phase 4: Build and render

Follow the video-render-engine SKILL.md:
1. Get timings from the real voiceover (`silencedetect`, plus a VideoDB transcript to verify
   pronunciation: flag misread brand names before rendering).
2. Fetch assets: Fluent 3D emoji per beat, a cutout of the product if the user supplies one,
   and music (`music tech` for reviews, `music tutorial` for how-tos). Copy the credit line.
3. Write `spec.json` with themes changing every 1–2 scenes, `explain3d` for the "how it
   works" beats, and captions in ≤ 8-word chunks on real pauses.
4. Render **preview stills** first and look at them: Devanagari shaping, no
   caption/pill overlap, models readable. Then render the MP4 in the background.
5. Save everything under `productions/<slug>-marathi/` and send the MP4 to the user.

## Phase 5: Upload kit

- **3 titles:** Marathi, ≤ 60 chars, search phrase first, plus one curiosity gap.
- **Thumbnail / cover:** the hook frame, with ≤ 4 Marathi words.
- **Description:** 2 lines, then chapters (long-form), the link, the **music CC-BY credit**,
  and the legal line where relevant.
- **Hashtags:** 3–5, mixing Marathi and English (#मराठी #TechMarathi #<topic>).
- A pinned comment with the binary question from the CTA.

## Rules

- Never pad. Every line informs or retains.
- Use ₹ prices with the date checked. For download, VPN or similar tools, include
  "फक्त legal content साठी" on screen.
- Never use copyrighted images (CleanPNG, Google Images). Use emoji, Iconify, Unsplash,
  user-supplied files and cutouts.
- Remotion is free for individuals and teams of up to 3 people. Mention this once to
  company users.
