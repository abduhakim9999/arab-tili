#!/usr/bin/env python3
"""Ovoz bo'laklarini bepul tekshirish (wav2vec2 fonema modeli): har bo'lak uchun vaqtli fonema qatori
(vaqt — prep.py kesgandan keyingi bo'lak boshidan) va «k…n» oralig'i (cho'ziq «kaːna» >= 0.20 s bo'lishi kerak).
  python3 tekshir.py u0 u2 …      (nomsiz — hamma o'zbekcha bo'laklar)
Kerak: pip install torch transformers librosa (CPU yetadi)."""
import sys, json, numpy as np, torch
from transformers import Wav2Vec2FeatureExtractor, AutoModelForCTC
from huggingface_hub import hf_hub_download
import prep

M = 'facebook/wav2vec2-lv-60-espeak-cv-ft'
fe = Wav2Vec2FeatureExtractor.from_pretrained(M); model = AutoModelForCTC.from_pretrained(M).eval()
voc = {v: k for k, v in json.load(open(hf_hub_download(M, 'vocab.json'))).items()}
blank = model.config.pad_token_id
VOW = set('aeiouɑɔəɛɪʊæøœyɯ')


def phones(n):
    x = prep.load(n); db = prep.rms_db(x); act = np.where(db > db.max() - 38)[0]
    off = max(0, act[0] * prep.HOP - int(0.03 * prep.SR)) / prep.SR          # prep.py shu yerdan boshlab oladi
    import librosa
    y = librosa.resample(x.astype(np.float32), orig_sr=prep.SR, target_sr=16000)
    with torch.no_grad(): ids = model(fe(y, sampling_rate=16000, return_tensors='pt').input_values).logits.argmax(-1)[0].tolist()
    out = []; p = None
    for i, a in enumerate(ids):
        if a != p and a != blank and not voc[a].startswith('<'): out.append((round(i * 0.02 - off, 2), voc[a]))
        p = a
    return out


for n in (sys.argv[1:] or sorted(k for k in prep.TXT if k[0] == 'u')):
    ph = phones(n)
    line = ''; last = -9
    for t, p in ph:
        if t - last >= 0.45: line += f' [{t:.2f}] '
        line += p; last = t
    kn = []
    for i, (t, p) in enumerate(ph):                                         # k + unli + n + a
        if p == 'k' and i + 3 < len(ph) and ph[i + 1][1][0] in VOW and ph[i + 2][1] == 'n' and ph[i + 3][1][0] in 'aɑæ':
            d = ph[i + 2][0] - t; kn.append(f"{t:.2f}:{d:.2f}{'' if d >= 0.195 else ' QISQA'}")
    print(f'{n}: {line.strip()}\n    k–n: {", ".join(kn) or "—"}')
