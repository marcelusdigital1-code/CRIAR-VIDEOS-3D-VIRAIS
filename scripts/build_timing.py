"""
build_timing.py — Constrói timing.json a partir de words_full.json (Whisper) + shots.json.
Faz matching sequencial palavra-a-palavra, tolerante a erros de transcrição.

Usage: python scripts/build_timing.py <ep>
"""
import sys, json, os, re

ep = sys.argv[1] if len(sys.argv) > 1 else "ep2"
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

with open(f"episodes/{ep}/words_full.json", encoding="utf-8") as f:
    wfull = json.load(f)   # [{w, start, end}, ...]

with open(f"episodes/{ep}/shots.json", encoding="utf-8") as f:
    shots = json.load(f)   # [{id, text, say?}, ...]

def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())

def tok(text):
    return [w for w in re.split(r"\s+", text.strip()) if w]

# Build flat script word list: (shot_id, display_word, norm_word)
script_flat = []
for shot in shots:
    display_text = shot["text"]
    for w in tok(display_text):
        script_flat.append((shot["id"], w, norm(w)))

# Whisper word list
whisper_flat = [(i, w["w"], norm(w["w"]), w["start"], w["end"]) for i, w in enumerate(wfull)]

# ── Align: greedy forward scan with look-ahead ───────────────────────────────
aligned = []   # (shot_id, display_w, start, end)
wi = 0         # whisper index
n_w = len(whisper_flat)

for si, (shot_id, dw, nw) in enumerate(script_flat):
    best = None
    # Look up to 10 whisper words ahead
    for look in range(min(12, n_w - wi)):
        idx, ww, nww, wstart, wend = whisper_flat[wi + look]
        # Match if 3+ chars prefix match in either direction
        if len(nw) >= 2 and len(nww) >= 2:
            if nw[:3] == nww[:3] or nww[:3] == nw[:3] or nw == nww:
                best = (look, wstart, wend)
                break
    if best is not None:
        look, wstart, wend = best
        wi += look + 1
        aligned.append((shot_id, dw, wstart, wend))
    else:
        # Interpolate from previous
        prev_end = aligned[-1][3] if aligned else 0.0
        aligned.append((shot_id, dw, prev_end, prev_end + 0.18))

# ── Build shots timing ────────────────────────────────────────────────────────
total_s = wfull[-1]["end"] if wfull else 0.0

shots_timing = []
for shot in shots:
    sid = shot["id"]
    shot_aligned = [(dw, st, en) for (shot_id, dw, st, en) in aligned if shot_id == sid]

    if shot_aligned:
        shot_start = shot_aligned[0][1]
        shot_end   = shot_aligned[-1][2]
    else:
        shot_start = shots_timing[-1]["end"] if shots_timing else 0.0
        shot_end   = shot_start + 1.5

    words_out = [{"w": dw, "start": round(st, 3), "end": round(en, 3)}
                 for dw, st, en in shot_aligned]

    shots_timing.append({
        "id":    sid,
        "start": round(shot_start, 3),
        "end":   round(shot_end,   3),
        "words": words_out,
    })

timing_out = {
    "voice":  "user_audio",
    "speed":  1.0,
    "total":  round(total_s, 3),
    "shots":  shots_timing,
}

out_path = f"episodes/{ep}/timing.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(timing_out, f, indent=1, ensure_ascii=False)

print(f"timing.json written — {len(shots_timing)} shots, {total_s:.1f}s total")
for s in shots_timing:
    nw = len(s["words"])
    print(f"  Shot {s['id']:2d}: {s['start']:7.2f}s – {s['end']:7.2f}s  ({nw}w)  {s['words'][0]['w'] if nw else '?'}…")
