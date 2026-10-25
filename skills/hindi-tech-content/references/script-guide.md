# Hindi Tech Script — Style Guide

## Audience profile

Pan-India, massive and hyper-competitive: the Hindi tech space is where the biggest Indian
tech channels operate (Technical Guruji's news-roundup speed, Tech Burner's entertainment-first
edits, Trakin Tech's test-heavy reviews, Technology Gyan's practical tutorials). A viewer who
gets bored swipes to a competitor covering the same phone. That means: **differentiated angle,
relentless pacing, and an opinion**. Price sensitivity is extreme — state ₹ prices early,
compare against 2–3 alternatives, and tie into sale events when relevant.

## Register and tone

- Address the viewer as **आप**; collective address **"दोस्तों"** (the market convention).
- Greeting after the hook, one line max: "नमस्कार दोस्तों!" — or skip it entirely in Shorts.
- Tone: energetic, confident, opinionated. The big Hindi channels sell personality as much as
  information. Jokes, mild exaggeration ("ये feature देखके मैं खुद shock रह गया") and direct
  "मेरी राय" verdicts are expected.
- Build trust with specificity: exact benchmark numbers, exact prices, "मैंने खुद test किया" framing.

## Hinglish code-mixing rules (critical for TTS and authenticity)

Hindi tech speech is the most heavily code-mixed register in Indian YouTube — more English
than Marathi content uses. Matching it is what makes a script sound native.

- **Keep in English (Latin script):** all tech vocabulary — smartphone, processor, chipset,
  RAM, storage, display, refresh rate, battery, fast charging, camera, sensor, app, update,
  features, performance, gaming, budget, flagship, launch, unboxing. Plus marketing verbs the
  community uses: upgrade, recommend, skip.
- **Keep in Hindi:** sentence skeleton, verbs, connectors, emotion, opinion:
  "इस price में ये performance मिलना almost impossible है, दोस्तों।"
- Whole English phrases are natural in Hindi tech speech ("value for money", "deal breaker",
  "no brainer") — use them where a creator genuinely would.
- Explain only genuinely new jargon, in one Hindi line, first occurrence only.

## Structure (long-form, 8–12 min)

| Beat | Time | Job |
|---|---|---|
| **Hook** | 0:00–0:08 | Bold claim, shocking price, or result — mid-thought. Never logo, never "आज की इस video में". The first 8 seconds decide whether a scrolling mobile viewer stays. |
| **Promise + greeting** | 0:08–0:25 | One-line नमस्कार दोस्तों, the exact promise, and an **open loop** ("और last में एक ऐसी बात बताऊंगा जो कोई नहीं बता रहा"). |
| **Body sections** | — | 4–6 sections. **Re-hook every 45–75 seconds** — tighter than regional markets. Mini-cliffhangers between sections ("लेकिन असली twist अभी बाकी है"). Front-load the most-searched info (price, camera, battery) — Hindi viewers skip around. |
| **Verdict** | last 90 s | Close the loop. Hard recommendation with segmentation: "अगर आप gamer हैं तो… अगर camera चाहिए तो…" |
| **CTA** | final 15 s | One ask, tied to topic ("Comment में बताइए — आप कौन सा लेंगे?"). Pin-comment question works well in this market. |

## Shorts structure (45–60 s, ~140–160 words)

1. **0–2 s** — verbal + visual shock ("पंद्रह हज़ार में DSLR जैसा camera?!")
2. **2–8 s** — context, why it matters now
3. **8–45 s** — 3 rapid points, one breath each, overlay per point
4. **45–60 s** — verdict + loop to long-form ("पूरा review channel पे है")

## ElevenLabs delivery format

- **Model:** `eleven_multilingual_v2` (or v3) — strong Hindi support, clean Hinglish
  code-switching when English words stay in Latin script. **Voice settings starting point:**
  stability 0.40–0.50 (Hindi market rewards expressiveness — go lower than you would for
  tutorial content), similarity 0.75, style 0.4–0.5.
- **Segment the script** (SEG-01…) and generate per segment — cheap retakes, clean edit points.
- **Numbers as words** in Hindi: "₹15,999" → "पंद्रह हज़ार नौ सौ निन्यानवे रुपये" (numeral
  version stays in the production script for the overlay card).
- **Pauses:** `...` for beats; exclamation marks genuinely raise TTS energy — use them on
  hooks and reveals, sparingly elsewhere.
- **English words:** Latin script with correct casing ("iPhone", "YouTube", "AnTuTu").
- Flag likely TTS stumbles (benchmark names, model numbers like "SM8650") and give respellings
  ("Snapdragon 8 Gen 3" → "Snapdragon eight gen three").

## Word-count targets

- Long-form: 150–160 spoken words/min (Hindi tech delivery is fast) → 8 min ≈ 1250 words,
  12 min ≈ 1900 words.
- Shorts: ~160 words max for 60 s.
