# Regra: Áudio vs Roteiro em Texto

Quando o utilizador pede para gerar um vídeo:

## 🎙️ Se enviou um ficheiro de áudio (MP3, WAV, M4A…)
→ **USA o áudio diretamente.** NÃO gera voz com Kokoro.
1. Converte o áudio para `public/epN/voice.wav` (24kHz mono) com ffmpeg
2. Alinha as palavras com `python scripts/align_audio.py epN <caminho_do_audio>`
   - Isto usa faster-whisper para detetar timestamps palavra-a-palavra
   - Gera `public/epN/voice.wav` + `episodes/epN/timing.json`
3. Continua com som (`node scripts/sound.mjs epN`) e renderização

## 📝 Se enviou apenas roteiro/narração em texto
→ **GERA a voz com Kokoro:**
```
node scripts/voice.mjs epN am_michael 1.15
```
Isso gera `voice.wav` + `timing.json` automaticamente.

## Workflow de alinhamento (align_audio.py)
- Script: `scripts/align_audio.py`
- Usa: `faster_whisper` (já instalado), `ffmpeg`
- Input: `episodes/epN/shots.json` + ficheiro de áudio
- Output: `public/epN/voice.wav` + `episodes/epN/timing.json`
