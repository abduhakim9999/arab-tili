#!/usr/bin/env python3
"""Qoralama ovoz (bepul, shu kompyuterda): Meta MMS-TTS o'zbekcha (kirill) — ElevenLabs krediti sarflanmaydi.
  python3 qoralama.py [u0 u1 …]  -> qoralama/NAME.wav  (ovoz/NAME.mp3 bo'lmagan bo'laklar uchun prep.py shuni oladi)
Faqat sur'at va tasvirni ko'rib olish uchun: talaffuz haqiqiy ovozniki emas.
Har bo'lak haqiqiy ovozning taxminiy uzunligiga (matn uzunligi / prep.SUR) keltiriladi — qoralamaning sur'ati yakuniy videonikiga yaqin bo'ladi."""
import sys, re, os, wave, subprocess, numpy as np, torch
from transformers import VitsModel, AutoTokenizer
import prep

D = os.path.dirname(os.path.abspath(__file__))
M = 'facebook/mms-tts-uzb-script_cyrillic'
tok = AutoTokenizer.from_pretrained(M); model = VitsModel.from_pretrained(M).eval(); model.speaking_rate = 1.22
MAP = dict(zip("abdfghijklmnopqrstuvxyz", "абдфгҳижклмнопқрстувхйз"))


def kiril(t):
    t = t.lower().replace('ʻ', "'").replace('‘', "'").replace('’', "'").replace('«', '').replace('»', '').replace('—', ',')
    for a, b in (("o'", 'ў'), ("g'", 'ғ'), ('sh', 'ш'), ('ch', 'ч'), ('yo', 'ё'), ('yu', 'ю'), ('ya', 'я'), ('ye', 'е')): t = t.replace(a, b)
    t = re.sub(r"(^|[\s\-,.:;!?аоуиэеўяёю])e", lambda m: m.group(1) + 'э', t).replace('e', 'е').replace("'", 'ъ')
    return ''.join(MAP.get(c, c) for c in t)


os.makedirs(f'{D}/qoralama', exist_ok=True)
for n in (sys.argv[1:] or [k for k in prep.TXT if k[0] == 'k' and not os.path.exists(f'{D}/ovoz/{k}.mp3')]):
    txt = kiril(prep.toza(prep.TXT[n])); torch.manual_seed(3)
    with torch.no_grad(): y = model(**tok(txt, return_tensors='pt')).waveform[0].numpy()
    with wave.open(f'{D}/qoralama/{n}.raw.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(model.config.sampling_rate); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
    d = len(y) / model.config.sampling_rate; tempo = min(1.5, max(0.75, d / (len(prep.toza(prep.TXT[n])) / prep.SUR)))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{D}/qoralama/{n}.raw.wav', '-af', f'atempo={tempo:.3f}', f'{D}/qoralama/{n}.wav'], check=True); os.remove(f'{D}/qoralama/{n}.raw.wav')
    print(n, round(d, 1), 's -> ', round(d / tempo, 1), 's', txt[:60])
