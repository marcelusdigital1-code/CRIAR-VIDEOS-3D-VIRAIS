"""
align_audio.py — Usa um áudio existente (MP3/WAV) + shots.json para gerar timing.json
sem precisar de Kokoro. Usa faster-whisper para alinhar palavras.

Uso:
  python scripts/align_audio.py <ep> <audio_path>
  python scripts/align_audio.py ep2 "C:/path/to/audio.mp3"

Gera:
  public/<ep>/voice.wav      (cópia convertida do áudio, 24000 Hz mono)
  episodes/<ep>/timing.json  (mesmo formato do voice.mjs)
"""

import sys
import os
import json
import wave
import struct
import subprocess
import tempfile
import numpy as np
from faster_whisper import WhisperModel

ep = sys.argv[1] if len(sys.argv) > 1 else "ep2"
audio_src = sys.argv[2] if len(sys.argv) > 2 else None

if not audio_src:
    print("Usage: python scripts/align_audio.py <ep> <audio_path>")
    sys.exit(1)

shots_path = os.path.join("episodes", ep, "shots.json")
out_wav    = os.path.join("public", ep, "voice.wav")
out_timing = os.path.join("episodes", ep, "timing.json")

os.makedirs(os.path.join("public", ep), exist_ok=True)

# ── 1. Convert input audio to 24000 Hz mono WAV ─────────────────────────────
print(f"[1] Converting {audio_src} → {out_wav} (24kHz mono)...")
tmp_wav = out_wav + ".tmp16k.wav"
subprocess.run([
    "ffmpeg", "-y", "-i", audio_src,
    "-ar", "16000", "-ac", "1", tmp_wav
], check=True, capture_output=True)

# Also produce the 24kHz voice.wav for Remotion
subprocess.run([
    "ffmpeg", "-y", "-i", audio_src,
    "-ar", "24000", "-ac", "1", out_wav
], check=True, capture_output=True)
print(f"   ✓ voice.wav written ({os.path.getsize(out_wav)//1024} KB)")

# ── 2. Load 16kHz audio for Whisper ─────────────────────────────────────────
with wave.open(tmp_wav, "rb") as f:
    frames = f.readframes(f.getnframes())
    audio16 = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
os.remove(tmp_wav)

# ── 3. Transcribe with word timestamps ──────────────────────────────────────
print("[2] Transcribing with faster-whisper (word timestamps)...")
model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe(
    audio16, beam_size=5,
    word_timestamps=True,
    language="en",
)
print(f"   Language: {info.language} ({info.language_probability:.2f})")

# Collect all words with timestamps
whisper_words = []  # list of (word_str, start_s, end_s)
for seg in segments:
    if seg.words:
        for w in seg.words:
            clean = w.word.strip().strip(".,!?;:\"'—-")
            if clean:
                whisper_words.append((clean, w.start, w.end))

print(f"   ✓ {len(whisper_words)} words detected")

# ── 4. Load shots.json ───────────────────────────────────────────────────────
with open(shots_path, encoding="utf-8") as f:
    shots = json.load(f)

# Build flat list of script words (in order)
script_words = []  # list of (shot_id, word_str)
for shot in shots:
    text = shot.get("say", shot["text"])
    for w in text.split():
        clean = w.strip(".,!?;:\"'—-–")
        if clean:
            script_words.append((shot["id"], clean))

print(f"   Script words: {len(script_words)}, Whisper words: {len(whisper_words)}")

# ── 5. Align script words to Whisper words (greedy matching) ─────────────────
# Simple sliding window match: for each script word, find the best Whisper word
def normalize(w):
    return w.lower().strip(".,!?;:\"'—-–")

def match_words(script_words, whisper_words):
    """
    Returns list of (shot_id, script_word, start, end) aligned to whisper timestamps.
    Uses a greedy forward scan.
    """
    result = []
    wi = 0  # whisper index
    n_w = len(whisper_words)

    for si, (shot_id, sw) in enumerate(script_words):
        sw_norm = normalize(sw)
        # Look ahead up to 6 whisper words for a match
        matched = False
        for look in range(min(8, n_w - wi)):
            ww, wstart, wend = whisper_words[wi + look]
            if normalize(ww).startswith(sw_norm[:3]) or sw_norm.startswith(normalize(ww)[:3]):
                result.append((shot_id, sw, wstart, wend))
                wi += look + 1
                matched = True
                break
        if not matched:
            # No match found — interpolate from neighbors
            if result:
                prev_end = result[-1][3]
                result.append((shot_id, sw, prev_end, prev_end + 0.15))
            else:
                result.append((shot_id, sw, 0.0, 0.15))
    return result

aligned = match_words(script_words, whisper_words)

# ── 6. Build timing.json (same format as voice.mjs) ─────────────────────────
# Get total audio duration
with wave.open(out_wav, "rb") as f:
    total_s = f.getnframes() / f.getframerate()

shots_timing = []
for shot in shots:
    sid = shot["id"]
    shot_text = shot.get("say", shot["text"])
    shot_words_raw = [w.strip(".,!?;:\"'—-–") for w in shot_text.split() if w.strip(".,!?;:\"'—-–")]

    # Find aligned words for this shot
    shot_aligned = [(sw, st, en) for (shot_id, sw, st, en) in aligned if shot_id == sid]

    if shot_aligned:
        shot_start = shot_aligned[0][1]
        shot_end   = shot_aligned[-1][2]
    else:
        shot_start = shots_timing[-1]["end"] if shots_timing else 0.0
        shot_end   = shot_start + 1.0

    words_out = []
    for i, (sw, st, en) in enumerate(shot_aligned):
        # Use original text word (not say version)
        orig_words = [w.strip(".,!?;:\"'—-–") for w in shot["text"].split() if w.strip(".,!?;:\"'—-–")]
        display_w = orig_words[i] if i < len(orig_words) else sw
        words_out.append({
            "w": display_w,
            "start": round(st, 3),
            "end":   round(en, 3),
        })

    shots_timing.append({
        "id":    sid,
        "start": round(shot_start, 3),
        "end":   round(shot_end, 3),
        "words": words_out,
    })

timing_out = {
    "voice":  "user_audio",
    "speed":  1.0,
    "total":  round(total_s, 3),
    "shots":  shots_timing,
}

with open(out_timing, "w", encoding="utf-8") as f:
    json.dump(timing_out, f, indent=1, ensure_ascii=False)

print(f"\n✅ Done!")
print(f"   voice.wav  → {out_wav}")
print(f"   timing.json → {out_timing}")
print(f"   Total: {total_s:.1f}s | {len(aligned)} words aligned")

# Print shot breakdown
print("\nShot timing:")
for s in shots_timing:
    nw = len(s["words"])
    print(f"  Shot {s['id']:2d}: {s['start']:6.2f}s – {s['end']:6.2f}s  ({nw} words)")
