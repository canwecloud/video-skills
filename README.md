# video-skills

Claude skills for producing regional-language Indian tech YouTube content, end to end:
**topic → script → ElevenLabs voiceover → edit → upload kit.**

## Skills

| Skill | Audience | What it does |
|---|---|---|
| [`skills/marathi-tech-content`](skills/marathi-tech-content/SKILL.md) | Marathi (Maharashtra) | Marathi tech scripts (ElevenLabs-ready) + editing workflow tuned for the underserved, tutorial-heavy Marathi market |
| [`skills/hindi-tech-content`](skills/hindi-tech-content/SKILL.md) | Hindi (pan-India) | Hindi/Hinglish tech scripts + the faster, meme-inflected editing grammar of the competitive Hindi market |

Each skill has two phases:

1. **Script** — give Claude a tech topic; it researches current facts/prices and returns a
   segmented, TTS-ready Devanagari script (paste segments into ElevenLabs
   `eleven_multilingual_v2`) plus a production script with per-segment visual notes.
2. **Edit** — give Claude your voiceover; it builds an Edit Decision List from the real audio
   timings, plans b-roll/overlays/subtitles, assembles the video with VideoDB
   (`upload_media` → `generate_transcript` → `render_timeline` → `add_subtitles`), cuts
   Shorts, and delivers titles/thumbnail/description/tags.

## Install

Copy a skill folder into your skills directory:

```bash
# personal
cp -r skills/marathi-tech-content ~/.claude/skills/
cp -r skills/hindi-tech-content ~/.claude/skills/

# or per-project
cp -r skills/* <your-project>/.claude/skills/
```

Then invoke with `/marathi-tech-content` or `/hindi-tech-content`, or just ask
("Marathi script on <topic>") — the skills trigger on topic + language.

## Layout

```
skills/<name>/
├── SKILL.md                      # workflow the skill runs
├── references/script-guide.md    # language register, code-mixing, structure, TTS settings
├── references/editing-guide.md   # EDL method, overlay/subtitle/sound rules, VideoDB steps, QC
└── assets/script-template.md     # exact output format for scripts
```
