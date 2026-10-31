# -*- coding: utf-8 -*-
"""Луғат yo'lagi — YAGONA qolip (31.10.2026), har darsda bir xil:
   python3 src/build/lugat_yolak.py NN
Kirish: $S/listen/uNN/v/aXX.mp3 (arabcha, har so'z alohida, ovoz.py matn -> lugat[i].ar)
        $S/listen/uNN/v/uXX.mp3 (o'zbekcha, har so'z alohida, lugat[i].uz)
        $S/listen/tmpNN/hh.wav  (bosh qism, Matn yo'lagi skriptidan)
Chiqish: $S/listen/vNN.mp3 + vNN.json  (build.py o'zi tinglash.html ga qo'shadi)
Tartib: arabcha -> 0.6 s -> o'zbekcha -> 0.6 s -> arabcha -> 1.4 s. Arabcha sal sekinlatiladi."""
import os, sys, json
S = '/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad'
sys.path.insert(0, S + '/listen')
from build_t import *
NN = int(sys.argv[1]); N2 = '%02d' % NN
V = S + '/listen/u%s/v' % N2; T = S + '/listen/tmp%s' % N2
M0 = json.load(open(S + '/listen/u%s/matn.json' % N2, encoding='utf-8'))
TGT = -18.0
TRIM = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
        'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse')
ARF = TRIM + ',atempo=0.88'
UZF = TRIM + ',atempo=0.92,highpass=f=90,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90'
def prep(src, flt, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', flt, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
s1, s3 = sil(T + '/s1.wav', 0.6), sil(T + '/s3.wav', 1.4)
items = [(T + '/hh.wav', 'h', 0), (s1, None, 0)]
for e in M0['lugat']:
    i = e['i']
    ar = prep(V + '/a%02d.mp3' % i, ARF, T + '/va%02d.wav' % i)
    uz = prep(V + '/u%02d.mp3' % i, UZF, T + '/vu%02d.wav' % i)
    items += [(ar, 'ar', i), (s1, None, 0), (uz, 'uz', i), (s1, None, 0), (ar, 'ar2', i), (s3, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, S + '/listen/v%d.mp3' % NN)
g = {}; exec(open(S + '/d%s/voc%s.py' % (N2, N2), encoding='utf-8').read(), g)
json.dump({'m': M, 'l': {i: [v[1], v[2][0]] for i, v in enumerate(g['VOC'])}}, open(S + '/listen/v%d.json' % NN, 'w'), ensure_ascii=False)
# tekshiruv uchun ro'yxat (ovoz.py tekshir NN)
json.dump([[V + '/u%02d.mp3' % e['i'], e['uz']] for e in M0['lugat']], open(S + '/listen/u%s/tekshir_kirish.json' % N2, 'w'), ensure_ascii=False)
print('v%d' % NN, round(t, 1), len(M))
