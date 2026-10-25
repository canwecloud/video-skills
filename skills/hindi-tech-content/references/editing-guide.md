# Hindi Tech Video — Editing Guide

The Hindi tech market has the most aggressive editing grammar on Indian YouTube — the
Tech Burner school: fast cuts, zoom punches, meme inserts, text slams. A voiceover-driven
channel competes with that energy through edit density. The law here is tighter than for
regional content: **something changes on screen every 2–4 seconds.**

## 1. Ingest and timing

1. `upload_media` the voiceover to VideoDB → `generate_transcript` for word-level timestamps.
2. Mark real timecodes for every script segment (SEG-01…). All EDL times come from the voice.
3. Cut dead air hard: gaps >0.3 s inside sentences, >0.6 s between them. A 4–8% global
   speed-up (no pitch shift) is standard in this market; cap at 10%.

## 2. Edit Decision List (EDL)

| Time | SEG | Narration (short) | Visual | On-screen text | Motion/SFX | Music |
|---|---|---|---|---|---|---|
| 0:00–0:08 | 01 | Hook | Most dramatic shot | ≤4 big words | Zoom punch + whoosh | spike |

Beat rules:
- **Hook (0–8 s):** best visual, hard cuts, text slam synced to the key word, music hit on
  the reveal. Weak hook visual → tell the user to reshoot; nothing downstream rescues it.
- **Body:** visual change every 2–4 s. Alternate b-roll ↔ spec cards ↔ screen recordings so
  no two same-type shots sit together. Zoom punch on every opinion word ("best", "problem",
  "शानदार"). Where the script jokes, cut a meme/reaction insert for 0.5–1 s — a Hindi-market
  signature; use 2–4 per video, more reads as spam.
- **Re-hooks (every 45–75 s):** pattern interrupt — music switch, 2-frame black, speed ramp,
  or full-screen Hindi text card with the mini-question.
- **Price/spec reveals:** on-screen card with numerals ("₹15,999"), big type, 3 s hold,
  + comparison row vs 2 rivals. Viewers screenshot these; sale-price callouts get shares.
- **Benchmarks/tests:** always show the number on screen while it's spoken — AnTuTu score,
  charge time, battery loop. Counter animations (0 → score) hold attention well here.

## 3. Text overlays and subtitles

- Overlay language: **Hinglish as spoken** — Hindi words in Devanagari, tech terms in Latin
  ("ये feature 🔥"). Emojis in overlays are normal in this market; ≤1 per card.
- Font: bold Devanagari-complete face (Mukta, Baloo 2, Hind). Verify no tofu (□□).
- ≤4 words per card, high contrast, mobile-safe margins.
- **Burned-in subtitles mandatory** (muted autoplay + non-native Hindi speakers across India).
  `add_subtitles` on the render; white text, black band, bottom center, ≤2 lines.

## 4. Sound design

- Music: high-energy for reviews/unboxings, switch tracks per section; duck to −18 to −22 dB
  under voice, swell in re-hooks. Trap/phonk-leaning beds are the current market default for
  reviews; lighter for tutorials.
- SFX: whoosh on zooms, bass hit on reveals, tick on list items, vine-boom only under memes.
  One per event, never stacked.
- Voice: normalize to −14 LUFS, de-ess ElevenLabs output, slight compression for punch.

## 5. VideoDB assembly

1. `list_assets` / `search_collection` to match b-roll per EDL row.
2. `render_timeline`: visuals per EDL, voiceover bed, ducked music track.
3. `add_subtitles` with the Hindi transcript (check Devanagari rendering).
4. `download_timeline_render` → deliver download URL + `player_url`.
5. Shorts: `generate_clip` on the 2–3 strongest 45-s stretches, `reframe_video` to 9:16,
   bigger captions. In the Hindi market Shorts drive discovery — always cut them.

## 6. Packaging (upload kit)

- **Titles (3 options):** Hinglish, ≤60 chars, keyword first + curiosity gap
  ("iPhone 17 — 3 बातें जो कोई नहीं बता रहा!"). ALL-CAPS single word for emphasis is market-normal, max one.
- **Thumbnail:** ≤4 words, expressive face or hero product, red/yellow accent on dark
  background (the Hindi-market convention), one arrow/circle max, readable at 120 px, no
  title-word repeats.
- **Description:** 2-line Hinglish summary → chapters (Hindi labels) → affiliate/product
  links with prices → hashtags (#tech #हिंदी + topic).
- **Tags:** mixed Hindi + English — Hindi viewers search in English for products
  ("best phone under 15000") and Hindi for problems ("phone slow kaise thik kare").

## 7. QC checklist (run before delivering)

- [ ] Hook lands inside 8 s; no logo/greeting before it
- [ ] No static shot longer than 4 s (tutorials: 6 s max)
- [ ] Pattern interrupt every 45–75 s
- [ ] Meme inserts ≤4, each under 1 s
- [ ] Every price/benchmark shown as an on-screen card, date-checked
- [ ] Devanagari overlays render (no tofu); subtitles burned in
- [ ] Audio: voice −14 LUFS, music ducked, no clipping
- [ ] Open loop closed before CTA; verdict segmented by buyer type
- [ ] 2–3 Shorts cut and reframed 9:16
