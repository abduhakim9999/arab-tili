#!/usr/bin/env python3
"""ElevenLabs video klipidan fon kadrlari: klip/k1.mp4 -> klip/k1-0001.jpg … (1080x1920, 30 kadr/s) va klip.js (window.KLIP).
Klip S1 uzunligiga cho'ziladi (sekinlashtiriladi; oraliq kadrlar aralashtirib to'ldiriladi — sekin kamera va alanga uchun yetarli).
  python3 klip.py        (prep.py dan keyin: tl.json kerak; kadrlar repoga qo'yilmaydi — klip/k1.mp4 dan qayta yasaladi)
video.html: seek() kadrni almashtiradi; S9 da o'sha kadrlar yarim tezlikda oldinga-orqaga aylanadi (pp).
k1.mp4 — ElevenLabs (Seedance 2.0 Mini, 9:16, 480p, 5 s, ovozsiz; 2133 kredit — docs/texnik.md 21). Prompt:
  Vertical slow push-in shot, the camera glides forward very slowly. In the lower half of the frame: an old carved wooden folding book stand
  on a worn dark-red carpet, holding a thick open antique book with plain cream pages in soft focus; beside it a small brass oil lamp with a
  single steady flame that flickers gently. Night inside an old Central Asian room with clay walls; a small arched window in the back wall
  shows a deep-blue starry sky. The upper half of the frame is a plain dark wall in deep shadow, empty. Warm amber lamplight, soft shadows,
  faint dust motes drifting in the light, shallow depth of field, cinematic, photorealistic, calm and quiet. No people, no hands, no animals,
  no text, no letters, no writing on the pages, no captions, no watermark."""
import json, os, subprocess, glob
D = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(f'{D}/tl.json')); S = {s['id']: s['s'] for s in TL['scenes']}
src = f'{D}/klip/k1.mp4'
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout)
need = S['S2'] + 0.9                                  # S1 + S2 boshidagi so'nish
for f in glob.glob(f'{D}/klip/k1-*.jpg'): os.remove(f)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', f"setpts={need / dur:.4f}*PTS,minterpolate=fps=30:mi_mode=blend,scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.5",
                '-q:v', '3', f'{D}/klip/k1-%04d.jpg'], check=True)
n = len(glob.glob(f'{D}/klip/k1-*.jpg'))
open(f'{D}/klip.js', 'w').write("(function () { var sc = function (id) { return TL.scenes.find(function (s) { return s.id === id; }).s; };\n"
  f"  window.KLIP = [{{ id: 'k1', s: 0, e: sc('S2') + .9, n: {n}, fps: 30 }}, {{ id: 'k1', s: sc('S9') - .7, e: sc('S10') + .8, n: {n}, fps: 30, rate: .5, pp: 1 }}]; }})();\n")
print('klip:', round(dur, 2), 's ->', n, 'kadr')
