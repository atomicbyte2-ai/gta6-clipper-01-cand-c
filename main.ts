// gta6-clipper-01-cand-c — entry program (Node 22, stdlib only, no network).
// Reads cutlist.json + VIDEO.json from this script's own directory,
// validates them, parses clip.mp4 duration from the mvhd box, and writes
// /output/clip-manifest.json + a copy of clip.mp4 to the output dir.
// Default output dir is /output; override with MAKEFUN_OUTPUT_DIR.
// Paths are always resolved from the script's own dir (import.meta.url),
// never from the working directory.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readJson(name) {
  const p = join(SCRIPT_DIR, name);
  if (!existsSync(p)) fail(`missing ${name} next to main.ts (${p})`);
  let data;
  try {
    data = JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    fail(`${name} is not valid JSON: ${e.message}`);
  }
  return data;
}

// Parse an MP4 duration (seconds) from the mvhd box. No ffmpeg dependency.
// mvhd lives INSIDE the moov box (never at top level), so search the file
// header for the "mvhd" signature instead of scanning top-level boxes only.
function parseMp4DurationSeconds(buf) {
  const head = buf.subarray(0, Math.min(buf.length, 1024 * 1024));
  const idx = head.indexOf(Buffer.from("mvhd", "ascii"));
  if (idx === -1) fail("clip.mp4: no mvhd box found");
  const content = idx + 4; // mvhd box content starts after the 4-byte type
  const version = buf[content];
  let timescale;
  let duration;
  if (version === 1) {
    timescale = buf.readUInt32BE(content + 20);
    duration = Number(buf.readBigUInt64BE(content + 24));
  } else if (version === 0) {
    timescale = buf.readUInt32BE(content + 12);
    duration = buf.readUInt32BE(content + 16);
  } else {
    fail(`clip.mp4: unsupported mvhd version ${version}`);
  }
  if (!timescale || timescale <= 0) fail("clip.mp4: mvhd timescale is zero");
  return duration / timescale;
}

function main() {
  const cutlist = readJson("cutlist.json");
  const video = readJson("VIDEO.json");

  // --- validate cutlist.json ---
  const required = ["source", "source_url", "in_seconds", "out_seconds", "duration_seconds", "pitch_text", "play_code", "ffmpeg_command"];
  for (const key of required) {
    if (cutlist[key] === undefined || cutlist[key] === null || cutlist[key] === "") {
      fail(`cutlist.json: missing or empty required field "${key}"`);
    }
  }
  if (typeof cutlist.in_seconds !== "number" || typeof cutlist.out_seconds !== "number") {
    fail("cutlist.json: in_seconds / out_seconds must be numbers (seconds)");
  }
  if (!(cutlist.out_seconds > cutlist.in_seconds)) {
    fail("cutlist.json: out_seconds must be greater than in_seconds");
  }
  const cutDuration = cutlist.out_seconds - cutlist.in_seconds;
  if (Math.abs(cutDuration - cutlist.duration_seconds) > 0.01) {
    fail(`cutlist.json: duration_seconds (${cutlist.duration_seconds}) does not match out-in (${cutDuration.toFixed(3)})`);
  }
  if (cutlist.duration_seconds > 60) {
    fail(`cutlist.json: clip is ${cutlist.duration_seconds}s, over the 60s Short limit`);
  }
  if (typeof cutlist.pitch_text !== "string" || !cutlist.pitch_text.includes("make.fun")) {
    fail('cutlist.json: pitch_text must mention "make.fun"');
  }

  // --- validate VIDEO.json ---
  if (typeof video.video_url !== "string" || !video.video_url.startsWith("https://www.youtube.com/watch?v=")) {
    fail('VIDEO.json: video_url must be a https://www.youtube.com/watch?v=... URL');
  }
  if (video.video_url.includes("PENDING_UPLOAD_BY_COY")) {
    console.warn("WARNING: VIDEO.json still holds the PENDING_UPLOAD_BY_COY placeholder — replace with the real URL after coy posts the clip.");
  }

  // --- clip.mp4 ---
  const clipPath = join(SCRIPT_DIR, "clip.mp4");
  if (!existsSync(clipPath)) {
    fail(`clip.mp4 not found next to main.ts (${clipPath}) — cut the clip first`);
  }
  const clipBuf = readFileSync(clipPath);
  const duration = parseMp4DurationSeconds(clipBuf);
  if (Math.abs(duration - cutlist.duration_seconds) > 0.5) {
    fail(`clip.mp4 duration ${duration.toFixed(3)}s does not match cutlist duration_seconds ${cutlist.duration_seconds}`);
  }

  // --- write output ---
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const manifest = {
    competition: "gta6-clipper-01",
    candidate: "C",
    concept: cutlist.concept || "funniest moment from the DEANKT GTA VI livestream VOD",
    source: cutlist.source,
    source_url: cutlist.source_url,
    in_seconds: cutlist.in_seconds,
    out_seconds: cutlist.out_seconds,
    duration_seconds: Number(duration.toFixed(3)),
    video_url: video.video_url,
    pitch_text: cutlist.pitch_text,
    play_code: cutlist.play_code,
    clip_bytes: clipBuf.length,
  };
  const outDir = resolve(OUTPUT_DIR);
  writeFileSync(join(outDir, "clip-manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  copyFileSync(clipPath, join(outDir, "clip.mp4"));
  console.log(`OK: clip.mp4 ${duration.toFixed(3)}s, ${clipBuf.length} bytes`);
  console.log(`OK: wrote ${join(outDir, "clip-manifest.json")} and ${join(outDir, "clip.mp4")}`);
}

main();
