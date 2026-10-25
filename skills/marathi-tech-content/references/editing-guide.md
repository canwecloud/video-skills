# Marathi Tech Video — Editing Guide

How successful Indian regional tech channels actually edit, adapted for a voiceover-driven
(faceless or hybrid) Marathi channel. The editor's one law: **something must change on screen
every 3–5 seconds**, and every change must serve the narration.

## 1. Ingest and timing

1. `upload_media` the voiceover to VideoDB → `generate_transcript` for word-level timestamps.
2. Mark the real timecode where each script segment (SEG-01…) starts. All EDL times come from
   the actual voice, never from the script's estimates.
3. Cut dead air: trim gaps >0.4 s inside sentences, >0.8 s between them. Regional-language
   TTS often lands slightly slow — a global 4–6% speed-up (without pitch shift) tightens
   delivery; never exceed 8% or Marathi consonants smear.

## 2. Edit Decision List (EDL)

Produce the EDL as a table — this is the deliverable even when assets don't exist yet:

| Time | SEG | Narration (short) | Visual | On-screen text (Marathi) | Motion/SFX | Music |
|---|---|---|---|---|---|---|
| 0:00–0:08 | 01 | Hook | Fastest/most dramatic shot | ≤4 big words | Zoom punch + whoosh | spike |

Rules per beat:
- **Hook (0–8 s):** the single best visual you have. Hard cuts, 1 zoom punch, text slams in
  sync with the key word. If the hook visual is weak, the video is dead — tell the user to reshoot.
- **Body:** b-roll or screen recording changes every 3–5 s. For tutorials: screen recording
  with **zoom-ins on the exact tap/click** (viewers follow along on the same phone), cursor/tap
  highlights, and step numbers ("पायरी १") as persistent corner text.
- **Re-hook moments (every 60–90 s):** pattern interrupt — music drop/switch, cut to black for
  2 frames, speed ramp, or a full-screen Marathi text card asking the mini-question.
- **Price/spec reveals:** always as an on-screen card — numerals ("₹12,999"), big type, hold
  3 s minimum. Indian viewers screenshot these.
- **Comparisons:** split-screen or table card, revealed row-by-row in narration order — never
  dump the whole table at once.

## 3. Text overlays and subtitles

- Overlay language: **Marathi (Devanagari)**, except product names and numerals.
- Font: a bold Devanagari-complete face (Mukta, Baloo 2, Tiro Devanagari Marathi). Never a
  Latin-only font — tofu boxes (□□) in a regional video destroy credibility instantly.
- ≤4 words per overlay, high contrast, safe margins for mobile.
- **Burned-in subtitles are mandatory** — a large share of mobile viewers start muted, and
  subtitles also serve viewers who understand spoken Marathi better with text support.
  Use `add_subtitles` on the rendered video; style: white text, black outline/band, bottom
  center, ≤2 lines.

## 4. Sound design

- Music: instrumental, low energy for tutorials, upbeat for reviews; duck to **−18 to −22 dB
  under narration**, swell in gaps and re-hooks. Switch tracks at major section changes.
- SFX sparingly: whoosh on zoom punches, pop/tick on text overlays, subtle click on tutorial
  steps. One SFX per edit event, never stacked.
- Normalize voiceover to −14 LUFS (YouTube standard); de-ess ElevenLabs output if sibilant.

## 5. VideoDB assembly

When assets are in VideoDB:
1. `list_assets` / `search_collection` to find matching b-roll per EDL row.
2. `render_timeline`: video track sequenced per EDL, voiceover as the audio bed, music as a
   second audio track at reduced volume.
3. `add_subtitles` with the Marathi transcript (verify Devanagari renders before final export).
4. `download_timeline_render` → deliver the download URL and the `player_url` for preview.
5. Shorts: `generate_clip` on the strongest 45 s, `reframe_video` to 9:16, re-caption with
   larger type (Shorts text must be readable at phone size).

## 6. Packaging (upload kit)

- **Titles (3 options):** Marathi, ≤60 chars, keyword first, one curiosity gap. Mixing one
  English keyword is fine and helps search ("iPhone 17 खरेदी करण्याआधी हे बघा!").
- **Thumbnail:** ≤4 Marathi words, product/face large, one accent color, must read at 120 px.
  Don't repeat the title's words on the thumbnail — they show together.
- **Description:** 2-line Marathi summary → chapter timestamps (Marathi labels) → links →
  hashtags (#मराठी #TechMarathi #tech plus topic tags).
- **Tags:** mix Marathi and English/transliterated search terms — Marathi viewers search in
  both ("मोबाईल टिप्स", "best phone under 15000 marathi").

## 7. QC checklist (run before delivering)

- [ ] Hook visual lands inside 8 s; no logo/greeting before it
- [ ] No static shot longer than 5 s (tutorials: 8 s if a step genuinely needs it)
- [ ] Pattern interrupt present every 60–90 s
- [ ] Every price shown on screen as a card, with date-checked value
- [ ] All Devanagari overlays render correctly (no tofu), subtitles burned in
- [ ] Audio: narration −14 LUFS, music ducked, no clipping
- [ ] Open loop from the intro is actually closed before the CTA
- [ ] End screen: one next-video suggestion, 10–15 s of outro max
