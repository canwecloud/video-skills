# Marathi Tech Script — Style Guide

## Audience profile

Maharashtra-based, mobile-first viewers who prefer Marathi but live in an English tech world.
The Marathi tech niche is **underserved** — far less competition than Hindi, and viewers are
loyal to creators who respect the language. Tutorials, "how-to", money-saving tips, and
government/digital-services explainers (UPI, DigiLocker, MahaDBT, online forms) outperform
pure gadget news here. Price sensitivity is high: state prices early, in ₹, and compare
against alternatives.

## Register and tone

- Address the viewer as **तुम्ही** (respectful-plural). Never तू.
- Standard greeting after the hook, never before it: **"नमस्कार मित्रांनो"** — keep it to one line.
- Tone: a knowledgeable friend explaining, not a newsreader. Shorter sentences than written
  Marathi prose. Spoken Marathi, not textbook Marathi — write how people talk.
- Light humor is fine; sarcasm about brands is risky — Marathi audiences reward sincerity.

## Code-mixing rules (critical for TTS and authenticity)

Real Marathi tech speech mixes English freely. Fighting this sounds artificial.

- **Keep in English (Latin script):** product names, brand names, and established tech terms —
  smartphone, processor, RAM, storage, display, battery, camera, app, update, settings,
  download, AI, charger, warranty. ElevenLabs multilingual models code-switch cleanly when the
  English word is written in Latin script inside Devanagari text.
- **Keep in Marathi:** all verbs, connectors, explanations, emotions. The sentence skeleton is
  always Marathi: "या phone मध्ये 8GB RAM आहे, आणि खरं सांगायचं तर, या किमतीत हे खूपच चांगलं आहे."
- **Never force translations** of tech terms ("संगणक-प्रक्रियक" for processor) — viewers mock it.
- Explain a term in Marathi the **first** time it appears if it's not everyday vocabulary:
  "refresh rate — म्हणजे screen किती वेळा refresh होतो."

## Structure (long-form, 6–10 min)

| Beat | Time | Job |
|---|---|---|
| **Hook** | 0:00–0:08 | The one claim/question that earns the next 30 s. Never start with greeting, logo, or "आजच्या व्हिडिओमध्ये…". Start mid-thought: a bold claim, a price shock, a result. |
| **Promise + greeting** | 0:08–0:25 | One-line नमस्कार, then exactly what they'll know by the end — and one **open loop** ("…आणि शेवटी एक अशी गोष्ट सांगणार आहे जी कोणीच सांगत नाही"). |
| **Body sections** | — | 3–5 sections. **Re-hook every 60–90 seconds**: a mini-question, a "पण इथे एक twist आहे…", a stat, a price reveal. Each section ends by teasing the next. |
| **Payoff** | last 60 s | Close the open loop. Clear verdict/recommendation — Marathi viewers explicitly want "घ्यावा की नाही?" answered. |
| **CTA** | final 15 s | One ask only (subscribe *or* comment question), in Marathi, tied to the topic. Never beg. |

## Shorts structure (45–60 s, ~120–150 words)

1. **0–2 s hook** — visual + verbal shock ("हा phone फक्त दहा हजारात?")
2. **2–10 s context** — what and why it matters
3. **10–45 s** — 3 rapid points max, one breath each
4. **45–60 s payoff + loop** — verdict + "पूर्ण माहितीसाठी channel वर जा"

## ElevenLabs delivery format

Write the TTS version so it can be pasted straight into ElevenLabs:

- **Model:** `eleven_multilingual_v2` (or v3 if available) — handles Devanagari + embedded
  English. **Voice settings starting point:** stability 0.45–0.55, similarity 0.75,
  style 0.3–0.4. Lower stability = more expressive, good for hooks; raise it for tutorials.
- **Segment the script** (SEG-01, SEG-02…) at natural section boundaries — generate per
  segment so a bad take costs one segment, not the whole script, and editing gets clean
  split points.
- **Numbers as words** in Marathi: "₹12,999" → "बारा हजार नऊशे नव्याण्णव रुपये" (keep the
  numeral version in the production script for the on-screen overlay).
- **Pauses:** `...` for a beat; start a new paragraph for a full stop in energy. No SSML
  needed for v2/v3; punctuation drives prosody.
- **English words:** Latin script, correct casing ("iPhone", "WhatsApp") — casing affects
  pronunciation.
- Flag any word the TTS may garble (brand names, Marathi-specific sounds like ळ) and give a
  respelling fallback: if "मराठमोळा" garbles, try "मराठ-मोळा".

## Word-count targets

- Long-form: 140–150 spoken words/min → 6 min ≈ 900 words, 10 min ≈ 1500 words.
- Shorts: ~150 words max for 60 s.
