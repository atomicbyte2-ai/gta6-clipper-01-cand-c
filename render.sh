#!/bin/bash
# gta6-clipper-01-cand-c — candidate C cut.
# Source: Rockstar GTA VI Launch Trailer (GTAVI_Launch_Trailer.mp4, 89.17s, 3840x2160).
# Concept: cinematic Vice City — hook with the most gorgeous shot first
# (beach aerial w/ pink plane), then night skyline, pink-sunset logo,
# convertible + sunset wading, Keys/marina/boat/seaplane, golden-hour
# rooftop + balcony embrace, close on the OUT NOW night skyline.
# Vertical 9:16: center crop 1216x2160 (x=1312) -> scale 1080x1920.
# Source audio kept (Launch Trailer audio; Trailer 2's licensed music NOT used).
set -euo pipefail
SRC="$HOME/workspace/makefun/gta6-clipper-01-footage/GTAVI_Launch_Trailer.mp4"
OUT="$HOME/workspace/makefun/gta6-clipper-01-cand-c/clip.mp4"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

ffmpeg -y -i "$SRC" -filter_complex "\
[0:v]trim=start=55:end=58,setpts=PTS-STARTPTS,crop=1216:2160:1312:0,scale=1080:1920,setsar=1[v0]; \
[0:v]trim=start=17:end=20,setpts=PTS-STARTPTS,crop=1216:2160:1312:0,scale=1080:1920,setsar=1[v1]; \
[0:v]trim=start=24:end=28.5,setpts=PTS-STARTPTS,crop=1216:2160:1312:0,scale=1080:1920,setsar=1[v2]; \
[0:v]trim=start=3:end=13,setpts=PTS-STARTPTS,crop=1216:2160:1312:0,scale=1080:1920,setsar=1[v3]; \
[0:v]trim=start=63:end=65,setpts=PTS-STARTPTS,crop=1216:2160:1312:0,scale=1080:1920,setsar=1[v4]; \
[0:v]trim=start=67:end=69.5,setpts=PTS-STARTPTS,crop=1216:2160:1312:0,scale=1080:1920,setsar=1[v5]; \
[0:v]trim=start=80:end=85.5,setpts=PTS-STARTPTS,crop=1216:2160:1312:0,scale=1080:1920,setsar=1[v6]; \
[v0][v1][v2][v3][v4][v5][v6]concat=n=7:v=1:a=0, \
drawtext=fontfile=$FONT:text='WELCOME BACK TO VICE CITY':fontsize=64:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=(w-text_w)/2:y=140:enable='between(t,0.5,4.0)', \
drawtext=fontfile=$FONT:text='MAKE MONEY MAKING':fontsize=64:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=(w-text_w)/2:y=1400:enable='between(t,20.5,25.0)', \
drawtext=fontfile=$FONT:text='CLIPS WITH AI - make.fun':fontsize=56:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=(w-text_w)/2:y=1500:enable='between(t,20.5,25.0)', \
drawtext=fontfile=$FONT:text='make.fun':fontsize=96:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=20:x=(w-text_w)/2:y=380:enable='between(t,25.5,30.5)', \
drawtext=fontfile=$FONT:text='PLAY CODE':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=16:x=(w-text_w)/2:y=540:enable='between(t,25.5,30.5)', \
drawtext=fontfile=$FONT:text='makefun-crystal-cotton-tarragon':fontsize=44:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=16:x=(w-text_w)/2:y=620:enable='between(t,25.5,30.5)'[vout]; \
[0:a]atrim=start=55:end=58,asetpts=PTS-STARTPTS[a0]; \
[0:a]atrim=start=17:end=20,asetpts=PTS-STARTPTS[a1]; \
[0:a]atrim=start=24:end=28.5,asetpts=PTS-STARTPTS[a2]; \
[0:a]atrim=start=3:end=13,asetpts=PTS-STARTPTS[a3]; \
[0:a]atrim=start=63:end=65,asetpts=PTS-STARTPTS[a4]; \
[0:a]atrim=start=67:end=69.5,asetpts=PTS-STARTPTS[a5]; \
[0:a]atrim=start=80:end=85.5,asetpts=PTS-STARTPTS[a6]; \
[a0][a1][a2][a3][a4][a5][a6]concat=n=7:v=0:a=1[aout]" \
-map "[vout]" -map "[aout]" \
-c:v libx264 -crf 20 -preset fast -pix_fmt yuv420p \
-c:a aac -b:a 128k -movflags +faststart "$OUT"
echo "DONE: $OUT"
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_type,width,height -of default=noprint_wrappers=1 "$OUT"
