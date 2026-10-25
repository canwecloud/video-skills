# Viral hooks: Marathi Shorts / Reels

Treat the first **1–2 seconds** as the whole hook and the first 3 s as the retention gate.
The spoken hook and the on-screen hook must land **together**: words appear on frame 1, and
the 3D model or emoji punches in by 0.3 s. Never open with a greeting, logo or "आजच्या
व्हिडिओमध्ये".

## Research before writing (5 min)

```bash
A=~/.claude/skills/video-render-engine/scripts/assets.py
python3 $A keywords "<topic>" --lang mr      # what people actually type (Marathi + English)
python3 $A trends --geo IN                   # what's spiking today, to ride a trend
python3 $A instagram <hashtag>               # if IG_USER_ID / IG_ACCESS_TOKEN are set
```

Put the strongest autocomplete phrase in the **title** and the **first spoken sentence**.
Searchers stay longer when the opening echoes what they typed.

## 12 hook formulas (with Marathi templates)

| # | Formula | Marathi template | Example |
|---|---|---|---|
| 1 | **Command + consequence** | "… आत्ताच [action] करा!" | "तुमच्या phone मधले ५ apps आत्ताच delete करा!" |
| 2 | **Specific outcome** | "फक्त [X] मध्ये [result]" | "फक्त २ मिनिटांत तुमचा phone दुप्पट fast!" |
| 3 | **Price shock** | "हे फक्त ₹[X]?!" | "हा phone फक्त दहा हजारात?!" |
| 4 | **Secret / hidden** | "[brand] तुम्हाला हे सांगत नाही…" | "Google तुम्हाला ही setting कधीच दाखवत नाही…" |
| 5 | **Mistake callout** | "९०% लोक ही चूक करतात…" | "९०% लोक phone असा charge करतात… आणि battery खराब होते." |
| 6 | **Stop!** | "थांबा! [X] करण्याआधी हे बघा" | "थांबा! नवा phone घेण्याआधी हे बघा." |
| 7 | **Myth bust** | "[belief]? साफ खोटं!" | "Phone रात्रभर charge केला तर battery खराब होते? साफ खोटं!" |
| 8 | **Versus** | "[A] vs [B] — कोण जिंकलं?" | "₹१५ हजार vs ₹५० हजार camera — फरक ओळखा!" |
| 9 | **POV / relatable pain** | "जेव्हा [painful moment]…" | "जेव्हा download ९९% वर अडकतं…" |
| 10 | **Curiosity number** | "[N] [things] जे कोणीच सांगत नाही" | "३ WhatsApp tricks जे कोणीच सांगत नाही" |
| 11 | **Free value** | "हे app मोफत आहे, आणि…" | "हे मोफत app paid apps ला मागे टाकतं" |
| 12 | **Challenge** | "हे बघून पण skip केलं तर…" | "शेवटचं feature बघून पण install नाही केलं तर मानलं!" |

Marathi audiences respond to **sincerity plus local pride**. "आपल्या मराठीत" / "मराठी
माणसासाठी" in line 2 (never line 1) lifts comments.

## Structure for 30–45 s Shorts (best range for Marathi tech)

```
0–2 s    HOOK            formula above, big title, model punches in
2–5 s    STAKES          why it matters to *them* (money, time, safety)
5–25 s   3 FAST BEATS    एक… दोन… तीन…  one feature per beat, a 3D explain scene each
25–32 s  PAYOFF          the best thing saved for last ("सगळ्यात भारी…")
32–38 s  LOOP + CTA      a question that makes them comment; end on a line that loops to the hook
```

**Loop trick:** end with a line that flows straight back into the first frame, for example ending
"…म्हणून तुमच्या phone मधले" so it replays into "५ apps आत्ताच delete करा!". Rewatches push
the Short.

**Comment bait that isn't cringe:** ask a binary choice ("तुम्ही कोणतं app delete करणार?",
"हा की तो? 👇"). That kind of question gets 3–5× the replies of "comment करा".

## Hook QA checklist

- [ ] The hook works **muted**: the on-screen title alone carries it
- [ ] There's a number, ₹ price or "you" in the first sentence
- [ ] There's no greeting or brand name before 2 s
- [ ] The title text is ≤ 5 words with one `*highlight*`
- [ ] The first scene's model or emoji relates to the hook, not a generic logo
