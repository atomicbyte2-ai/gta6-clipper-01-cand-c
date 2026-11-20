# gta6-clipper-01-cand-c

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/atomicbyte2-ai/gta6-clipper-01-cand-c/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/atomicbyte2-ai/gta6-clipper-01-cand-c/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

Candidate C for "Clip GTA 6 for the most YouTube views" — one vertical 9:16 Short (30.5s) cut from the Rockstar GTA VI Launch Trailer: a cinematic "welcome back to Vice City" montage. It hooks with the most gorgeous shot first (beach aerial, pink-smoke biplane over turquoise water), then night skyline, pink-sunset logo, convertible + sunset wading, Keys/marina/boat/seaplane, golden-hour rooftop + balcony embrace, and closes on the OUT NOW night skyline — with the make.fun pitch on screen and the play code on the end card.

Source: [Rockstar Games — GTA VI Launch Trailer](https://www.rockstargames.com/VI/media/videos) (15 Oct 2026, 89.17s, 4K). No Trailer 2 footage (licensed music / Content ID risk) and no DEANKT VOD (its fetch is blocked — YouTube throttles DASH and `--download-sections` fails on that live VOD).

## The clip

- `clip.mp4` — vertical 1080x1920 Short, 30.5s, Launch Trailer source audio kept.
- On-screen pitch: "WELCOME BACK TO VICE CITY" (0.5–4s), "MAKE MONEY MAKING / CLIPS WITH AI - make.fun" (20.5–25s), end card "make.fun / PLAY CODE / makefun-crystal-cotton-tarragon" (25.5–30.5s).
- Exact moment, timestamps and ffmpeg command: see `cutlist.json` (7 segments, all from the Launch Trailer).
- YouTube URL: see `VIDEO.json` — currently a `PENDING_UPLOAD_BY_COY` placeholder. **The real URL goes in only after coy posts the clip to his channel @hendryzu himself; do not submit with the placeholder.**

## Suggested YouTube title + description

Title (50 chars):

> Welcome Back to Vice City — GTA 6 Is Finally Here

Description:

> Vice City never looked this good.
>
> Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01
>
> Play code: makefun-crystal-cotton-tarragon
>
> #GTA6 #ViceCity #GTA

## Run it

```
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only, no network) reads `cutlist.json` + `VIDEO.json` from its own directory, validates them, parses `clip.mp4` duration from the mvhd box, and writes `clip-manifest.json` + a copy of `clip.mp4` to the output dir (default `/output`).

Reproduce the cut with `render.sh` (ffmpeg 8, DejaVuSans-Bold for the on-screen text).

Made with [make.fun](https://make.fun/bounty/gta6-clipper-01?ref=pnttjnyx).
