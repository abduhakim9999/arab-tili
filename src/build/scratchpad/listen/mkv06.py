# -*- coding: utf-8 -*-
# 6-dars Луғат yo'lagi: v6.mp3 — arabcha Abdullah (eleven_v4, har so'z alohida, tanvin nun bilan yozilgan -> vaqfsiz, sekinlatilgan),
# o'zbekcha Bekzod (eleven_v4, ko'plik «jami» bilan). Tartib: arabcha -> o'zbekcha -> arabcha.
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
S = os.path.dirname(HERE); T = HERE + '/tmp06'; U = HERE + '/u06/ab'
exec(open(S + '/d06/voc06.py', encoding='utf-8').read())
TGT = -18.0
TRIM = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
        'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse')
ARF = TRIM + ',atempo=0.88'
UZF = ('atempo=0.92,highpass=f=90,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90')
UT = ['Olti; oltita.', 'Oltinchi.', 'Bu, muannas uchun.', 'U, muannas uchun.', 'Opa, singil; jami: opalar, singillar.',
      'Vrach, shifokor; jami: vrachlar.', 'Vrach ayol; jami: vrach ayollar.', 'Talaba; jami: talabalar.',
      'Talaba qiz; jami: talaba qizlar.', 'Nada, ayol ismi.', 'Huda, ayol ismi.']
assert len(UT) == len(VOC) == 11
UP = dp_parts(U + '/uB.mp3', UT)
s1, s3 = sil(T + '/s1.wav', 0.6), sil(T + '/s3.wav', 1.4)
items = [(T + '/hh.wav', 'h', 0), (s1, None, 0)]
for i in range(len(VOC)):
    p = T + '/ap%02d.wav' % i
    run(['ffmpeg', '-v', 'error', '-y', '-i', U + '/a%02d.mp3' % i, '-af', ARF, '-ar', str(SR), '-ac', '1', p])
    ar = cut(p, T + '/v%02d.wav' % i, gain=TGT - lufs(p))
    a, b = UP[i]; raw = cut(U + '/uB.mp3', T + '/mr%02d.wav' % i, max(0, a - 0.05), b + 0.08)
    run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', UZF, '-ar', str(SR), '-ac', '1', T + '/mp%02d.wav' % i])
    u = cut(T + '/mp%02d.wav' % i, T + '/m%02d.wav' % i, gain=TGT - lufs(T + '/mp%02d.wav' % i))
    items += [(ar, 'ar', i), (s1, None, 0), (u, 'uz', i), (s1, None, 0), (ar, 'ar2', i), (s3, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/v6.mp3')
json.dump({'m': M, 'l': {i: [v[1], v[2][0]] for i, v in enumerate(VOC)}}, open(HERE + '/v6.json', 'w'), ensure_ascii=False)
print('v6', round(t, 1), len(M))
