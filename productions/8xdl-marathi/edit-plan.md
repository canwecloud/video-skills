# 8XDL Marathi edit package

> The timecodes are estimates from the script (about 145 words/min). Once the voiceover exists, re-time every row
> against the VideoDB transcript (`upload_media` → `generate_transcript`).

## 1. Edit Decision List (EDL)

| Time | SEG | Narration | Visual | On-screen text | Motion / SFX | Music |
|---|---|---|---|---|---|---|
| 0:00–0:03 | 01 | "download साठी एक app… दुसरं… तिसरं…" | 4 app icons (download, player, files, browser) pop in one per beat | — | Pop SFX on each icon | Low pulse |
| 0:03–0:08 | 01 | "…एकाच app मध्ये मिळालं तर?" | Icons slam together into the **8XDL logo** | **एकाच app मध्ये?** | Zoom punch + whoosh | **Hit** |
| 0:08–0:25 | 02 | Greeting + promise | Logo → app home screen recording; at "शेवटी एक feature" a blurred padlock appears in the corner | **शेवटी: Secret Feature 🔒** | Soft rise | Main bed starts |
| 0:25–1:00 | 03 | What it is | Play Store listing scroll; spec card slides in | **Android 8+ · 95 MB · v1.3.1** · **by CanWe.tech** | Card pop | Bed |
| 0:40–1:00 | 03 | "4–5 apps ऐवजी एक" | Split screen: phone with 5 apps on the left vs. 1 app on the right | **5 apps ❌ → 1 app ✅** | Tick SFX | Bed |
| 1:00–1:20 | 04 | Multi-thread | Animated graphic: one file bar splits into 8 parallel bars | **Multi-thread = जास्त speed ⚡** | Speed-ramp whoosh | **Re-hook 1**: music switch |
| 1:20–1:45 | 04 | Pause / resume / recover | Screen recording: download starts → airplane mode on → resumes | **Pause ▸ Resume** | Zoom on progress bar | Bed |
| 1:45–1:55 | 04 | Queue / schedule / background | Quick 3-cut montage: queue list, schedule picker, notification shade | **Queue · Schedule · Background** | Tick ×3 | Bed |
| 1:55–2:00 | 04 | Legal line | Clean full-screen card (no b-roll) | **फक्त legal content साठी वापरा** | — | Duck to −26 dB |
| 2:00–2:20 | 05 | Browser | Recording: opening tabs, voice search, desktop toggle, reading mode | **Unlimited tabs · Voice search** | 2 fast zooms | Bed |
| 2:20–2:45 | 05 | Ad blocker | **Before/after split**: same news site with ads vs. clean | **Ad blocker ✔** | Swipe-wipe transition | **Re-hook 2** |
| 2:45–3:00 | 05 | Incognito / DNS / data saver | Settings screen recording; highlight each toggle | **Private DNS ✔ · Data saver ✔** | Tick SFX per toggle | Bed |
| 3:00–3:25 | 06 | Media player | Play a video with subtitles → speed 1.5× → PiP floating over the home screen | **PiP · Speed · Subtitles** | Zoom on PiP window | Bed |
| 3:25–3:35 | 06 | Sleep timer | Timer UI with a moon icon overlay | **Sleep timer 🌙** | Soft chime | Bed drops |
| 3:35–3:50 | 06 | File manager | Search → rename → move → storage cleanup showing freed MB | **Storage cleanup** | Counter animation | Bed |
| 3:50–4:00 | 07 | "चार सोप्या पायऱ्या" | Full-screen title card | **४ सोप्या पायऱ्या** | Whoosh | **Re-hook 3**: lighter tutorial bed |
| 4:00–4:40 | 07 | Steps 1–4 | One continuous screen recording; **zoom 150% on every tap**; tap ripple highlight | Corner badge: **पायरी १ / २ / ३ / ४** | Click SFX per tap | Tutorial bed |
| 4:40–4:50 | 08 | "ती feature…" | The blurred padlock from 0:08 **unblurs**, then pushes in | **Secure Vault 🔒** | Bass hit | **Hit**, then soft |
| 4:50–5:20 | 08 | Vault demo | Move a photo into the vault → open the gallery → the photo is gone → vault unlock prompt | **Gallery मध्ये दिसत नाही** | Zoom on lock | Bed |
| 5:20–5:35 | 09 | Verdict | Recap: 4 icons merge into the 8XDL logo again (callback to the hook) | **Fast · Private · All-in-one** | Whoosh | Swell |
| 5:35–5:45 | 09 | CTA | Play Store badge plus a comment prompt; end screen | **तुमची आवडती feature? 👇** | Pop | Outro |

**Pace check:** no shot runs longer than 5 s, except the tutorial (Steps 1–4), where tap-zooms keep the motion going.

## 2. Asset shot-list

**Screen recordings** (the user records these on an Android phone at 1080×2400 or higher, with Do-Not-Disturb on, a clean status bar and Marathi or English UI):

1. 8XDL Play Store listing scroll and Install tap
2. App home screen in its first-open state
3. Download of a large *legal* file (for example a Linux ISO or a public-domain video) showing the speed counter
4. Airplane mode toggled mid-download → resume
5. Download queue with 3+ items; the schedule picker
6. Browser: opening 5+ tabs, voice search, desktop mode, reading mode
7. The same ad-heavy news site with the ad blocker off, then on (before/after)
8. Settings: incognito, Private DNS, data saver, cookie controls
9. Media player: subtitles, 1.5× speed, PiP over the home screen, background play, sleep timer
10. File manager: search, rename, move, storage cleanup
11. The full 4-step tutorial in **one take**
12. Vault: add a photo → gallery no longer shows it → unlock prompt

**Graphics (create in Canva or the editor):**
- 4 generic category icons (download, player, folder, globe) and the 8XDL logo (PNG with transparency)
- Multi-thread animation (one bar splitting into 8)
- Spec card, step badges १–४, legal disclaimer card, end screen

**Audio:**
- Voiceover from ElevenLabs (flow: 8XDL Marathi video)
- 2 royalty-free beds (upbeat tech plus a light tutorial track) from the YouTube Audio Library
- SFX pack: whoosh, pop, tick, click, bass hit, chime

## 3. VideoDB assembly steps (once the assets are uploaded)

1. `upload_media` → voiceover MP3, every screen recording and every graphic, all into one collection.
2. `generate_transcript` on the voiceover → re-time the EDL above against real word timestamps.
3. `render_timeline` → video track per the EDL; audio track 1 is the voiceover normalized to −14 LUFS; audio track 2 is music at −20 dB.
4. `add_subtitles` → burn in Marathi captions (Mukta Bold, white with a black band, bottom).
5. `download_timeline_render` → final 1080p MP4.

## 4. Shorts cutdowns (9:16)

| Short | Source | Hook (first 2 s) | Payoff |
|---|---|---|---|
| **A: "5 apps → 1 app"** | 0:00–0:08 + 0:40–1:00 + 5:20–5:35 | "phone मध्ये ५ apps? एकच पुरे!" | Logo + Play Store badge |
| **B: "Secret Vault"** | 4:40–5:20 | "हे photo gallery मधून गायब झालं…" | Vault unlock; "पूर्ण video channel वर" |

Use `generate_clip` → `reframe_video` (9:16) → recaption at 1.5× size.

## 5. Packaging

**Title options:**
1. एकाच App मध्ये Downloader, Browser आणि Player! 8XDL Review मराठी
2. 8XDL App कसं वापरायचं? पूर्ण माहिती मराठीत
3. ५ Apps Delete करा! हे एकच App पुरेसं आहे | 8XDL

**Thumbnail:** phone held at an angle showing the 8XDL home screen, with 4 app icons crossed out in red behind it. Text: **"५ Apps = १ App!"** in bold yellow Devanagari on a dark background.

**Description:**
```
एकाच app मध्ये fast download manager, privacy browser, media player, file manager आणि secure vault — 8XDL ची पूर्ण माहिती मराठीत!

📲 8XDL डाउनलोड करा: https://play.google.com/store/apps/details?id=com.codex.torrentx

⏱️ Chapters
0:00 एकाच app मध्ये सगळं?
0:25 8XDL म्हणजे काय?
1:00 Download Manager
2:00 Browser आणि Privacy
3:00 Media Player आणि File Manager
3:50 वापरायचं कसं? (४ पायऱ्या)
4:40 Secret Feature: Secure Vault
5:20 माझं मत

⚠️ हे app फक्त legal, public किंवा authorized content साठीच वापरा.

#मराठी #TechMarathi #8XDL #DownloadManager #AndroidApps
```

**Tags:** 8xdl, 8xdl app, 8xdl marathi, download manager marathi, best download manager android, मराठी tech, मोबाईल टिप्स, android app marathi, private vault app, ad blocker browser marathi, फाईल डाउनलोड कसे करावे, tech marathi, all in one app
