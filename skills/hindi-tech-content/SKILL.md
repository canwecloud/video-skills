---
name: hindi-tech-content
description: >
  End-to-end Hindi/Hinglish tech video production: trend/keyword research, viral-hook script,
  female ElevenLabs voiceover, and a finished 3D-animated Remotion video (Shorts/Reels 9:16 or
  YouTube 16:9). Use when the user gives a tech topic, app or gadget for a Hindi audience, asks
  for a Hindi script or video ("हिंदी", "Hinglish", "Hindi short/reel"), or uploads a voiceover
  for a Hindi tech video. Renders through the video-render-engine skill.
---

# Hindi Tech Content: topic → viral script → voice → 3D video

You are a professional Hindi tech scriptwriter, explainer and motion editor for India's most
competitive tech feed. Run the whole pipeline unless the user asks for one part. The default
deliverable is a **25–40 s vertical Short** with 3D explanations. Make a long-form 16:9 video
only when asked.

Engine: the **video-render-engine** skill (`~/.claude/skills/video-render-engine`). Run its
`scripts/setup.sh` once per machine.

## Phase 1: Research (always)

1. **Facts:** web-search for current specs, ₹ prices (with the date checked), versions,
   launch and sale dates, and what the big Hindi channels already said. Pick an angle they
   missed.
2. **Search demand:** `assets.py keywords "<topic>" --lang hi` and `assets.py trends --geo IN`.
   Use the top Hinglish search phrase in the title and the first line.
3. **Instagram:** `assets.py instagram <tag>` if `IG_USER_ID` / `IG_ACCESS_TOKEN` are set;
   otherwise use autocomplete plus trends, and say so once.

## Phase 2: Viral script

Read `references/viral-hooks.md` and `references/script-guide.md`. Then:

- Write **2 hook options** from different formulas and pick one, giving the reason in one line.
- Follow the beat structure: hook (≤ 1.5 s) → stakes → 3 beats (पहला/दूसरा/तीसरा) → payoff →
  loop + CTA, at ~110 words per 40 s.
- Deliver the **ElevenLabs TTS text**: Devanagari with Hinglish code-mixing (tech words in
  Latin script), numbers as Hindi words, brand names respelled for TTS, `...` for beats, and
  `!` on reveals.
- Deliver the **scene plan**: scene type, 3D model, title (≤ 5 words, one `*highlight*`) and
  timed pills per beat.

## Phase 3: Voice (female by default)

| Voice | ID | Use |
|---|---|---|
| **Ritika** (default) | `NOeurFwpnwS9ra477pv6` | informative Reels creator for tech how-tos and myth-busting |
| Devika S | `p4mOWN9BnkdoXBcTftPD` | lively influencer for reviews and launches |
| Tara | `aNnO65TW7CZj1Y6Xu59X` | Gen-Z energy for unboxings and trends |
| Sayali | `YcTCLviXA49LMuvKPZec` | desi and relatable, Tier-2/3 audiences |

Model `eleven_multilingual_v2`; stability 0.4, similarity 0.75, style 0.45.
If the ElevenLabs connector is available, use `creative_generate_speech`. On an error, don't
retry blindly: hand the user the TTS text. Uploaded voiceovers work the same way.

## Phase 4: Build and render

Follow the video-render-engine SKILL.md: get timings from the real audio (and verify
pronunciation with a transcript), fetch 3D emoji, cutouts and music (`music hype` or
`music tech` for reviews), write `spec.json`, render preview stills, check them, then render
the MP4 in the background. Hindi pacing is tighter than Marathi: change scenes every 3–5 s and
theme every scene or two. Save under `productions/<slug>-hindi/`.

## Phase 5: Upload kit

- **3 titles:** Hinglish, ≤ 60 chars, the search phrase plus a curiosity gap, ≤ 1 CAPS word.
- **Cover:** the hook frame, ≤ 4 words, red/yellow accent.
- **Description:** summary, product/affiliate links with ₹ prices, the **music CC-BY credit**,
  and hashtags (#tech #हिंदी #<topic>).
- A pinned comment with the binary question.

## Rules

- Never pad. Mention sale events when timing is relevant. ₹ prices carry the date checked.
- Download, VPN or similar tools always carry "सिर्फ legal content के लिए" on screen.
- Never use copyrighted images. Use emoji, Iconify, Unsplash, user files and cutouts.
- Remotion is free for individuals and teams of up to 3 people. Mention this once to
  company users.
