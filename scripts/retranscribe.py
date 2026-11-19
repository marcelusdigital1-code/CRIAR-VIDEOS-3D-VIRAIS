"""Re-transcribe the full audio with word timestamps, save words_full.json"""
import json, numpy as np, wave, subprocess, os, sys
from faster_whisper import WhisperModel

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

ep = sys.argv[1] if len(sys.argv) > 1 else "ep2"
voice_wav = os.path.join("public", ep, "voice.wav")
tmp = voice_wav + ".tmp16k.wav"

subprocess.run(["ffmpeg","-y","-i", voice_wav,"-ar","16000","-ac","1", tmp], capture_output=True, check=True)
with wave.open(tmp,"rb") as f:
    frames = f.readframes(f.getnframes())
    audio16 = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
os.remove(tmp)

model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe(audio16, beam_size=5, word_timestamps=True, language="en")

all_words = []
for seg in segments:
    if seg.words:
        for w in seg.words:
            all_words.append({"w": w.word.strip(), "start": round(w.start,3), "end": round(w.end,3)})

print("Total words:", len(all_words))
out_path = os.path.join("episodes", ep, "words_full.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(all_words, f, indent=1)
print("Saved:", out_path)

# Print sentences
text = ""
for w in all_words:
    text += w["w"] + " "
    if w["w"].endswith((".", "!", "?")):
        t = w["end"]
        print(f"  [{t:.1f}s] {text.strip()}")
        text = ""
if text.strip():
    print(f"  [end] {text.strip()}")
