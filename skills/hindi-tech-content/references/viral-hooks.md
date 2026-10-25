# Viral hooks: Hindi Shorts / Reels

The Hindi tech feed is the most crowded in India, so the hook gets about **1 second**.
The spoken and on-screen hook land together on frame 1, and the 3D model or emoji punches
in by 0.3 s. Never open with "नमस्ते दोस्तों" or "आज की इस video में".

## Research before writing (5 min)

```bash
A=~/.claude/skills/video-render-engine/scripts/assets.py
python3 $A keywords "<topic>" --lang hi      # autocomplete: "kaise kare", "best … under …"
python3 $A trends --geo IN                   # today's spikes: ride launches, sales, outages
python3 $A instagram <hashtag>               # if IG_USER_ID / IG_ACCESS_TOKEN are set
```

Hindi searchers type Hinglish in Latin script ("phone hang ho raha hai"). Use that exact
phrase in the title and the first spoken line.

## 12 hook formulas (with Hindi templates)

| # | Formula | Hindi template | Example |
|---|---|---|---|
| 1 | **Command + consequence** | "… अभी [action] करो!" | "अपने phone से ये 5 apps अभी delete करो!" |
| 2 | **Specific outcome** | "सिर्फ [X] में [result]" | "सिर्फ 2 minute में phone की speed double!" |
| 3 | **Price shock** | "ये सिर्फ ₹[X] में?!" | "ये 5G phone सिर्फ दस हज़ार में?!" |
| 4 | **Secret** | "[brand] आपको ये नहीं बताएगा…" | "Samsung आपको ये setting कभी नहीं बताएगा…" |
| 5 | **Mistake callout** | "90% लोग ये गलती करते हैं…" | "90% लोग phone ऐसे charge करते हैं… और battery खत्म।" |
| 6 | **Stop!** | "रुको! [X] से पहले ये देखो" | "रुको! Big Billion Days में phone लेने से पहले ये देखो।" |
| 7 | **Myth bust** | "[belief]? बिल्कुल गलत!" | "Fast charging से battery खराब होती है? बिल्कुल गलत!" |
| 8 | **Versus** | "[A] vs [B] — कौन जीता?" | "₹15,000 vs ₹50,000 camera — फर्क पहचानो!" |
| 9 | **POV** | "जब [pain]…" | "जब download 99% पे अटक जाए…" |
| 10 | **Curiosity number** | "[N] [things] जो कोई नहीं बताता" | "3 WhatsApp tricks जो कोई नहीं बताता" |
| 11 | **Free value** | "ये free app paid वालों को हरा देता है" | |
| 12 | **Challenge** | "Last feature देख के भी install नहीं किया तो…" | |

The Hindi market rewards **energy plus opinion**. Take a side ("मेरी राय: skip करो") and
use one mild exaggeration per Short ("ये देख के मैं shock हो गई").

## Structure for 25–40 s Shorts

```
0–1.5 s  HOOK          formula above, big title, impact shake, model punches in
1.5–4 s  STAKES        paisa, time, or danger, made personal ("आपका data…")
4–22 s   3 FAST BEATS  पहला… दूसरा… तीसरा…  one 3D explain scene each, ~5 s per beat
22–30 s  PAYOFF        "और सबसे बढ़िया…" best feature saved for last
30–36 s  LOOP + CTA    binary question for comments; last line loops into the hook
```

**Loop trick:** end with "…इसीलिए अपने phone से" so the replay continues into
"ये 5 apps अभी delete करो!"

**Comment bait:** "आप कौन सा लोगे — A या B? 👇", or ask viewers to share their hang/lag
problem in the comments for the next video.

## Hook QA checklist

- [ ] The hook works **muted**: the title alone carries it
- [ ] There's a number, ₹ price or "आप" in the first sentence
- [ ] There's no greeting or brand name before 1.5 s
- [ ] The title is ≤ 5 words with one `*highlight*`
- [ ] Sale events (Big Billion Days, Great Indian Festival) are referenced when timing allows
