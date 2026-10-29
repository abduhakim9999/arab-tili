# -*- coding: utf-8 -*-
# 93-dars tinglash yo'laklari: l93.mp3 (matn+tarjima) va v93.mp3 (lug'at)
import os, sys, json, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
R = '/root/repo'; D93 = R + '/src/build/scratchpad/d93'
T = HERE + '/tmp'; os.makedirs(T, exist_ok=True)
AUD = R + '/a93-97fe1435.mp3'; HDR = R + '/src/build/scratchpad/hdr/h93.mp3'
TGT = -18.0
# --- matn ma'lumoti (sahifadagi bilan bir xil) ---
os.chdir(D93)
exec(open('../d71/data71.py', encoding='utf-8').read())
exec(open('h93.py', encoding='utf-8').read())
exec(open('data93.py', encoding='utf-8').read())
exec(open('voc93.py', encoding='utf-8').read())
os.chdir(HERE)
seg = {int(k): v for k, v in json.load(open('seg.json')).items()}
lis = sorted(seg)
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
g_u = {k: TGT - lufs('u%s.mp3' % k) for k in 'ABC'}
g_v = TGT - lufs('arV.mp3')
print('gain', round(g_ar, 1), round(g_h, 1), {k: round(v, 1) for k, v in g_u.items()}, round(g_v, 1))
# o'zbekcha bo'laklar
uz = {}
pA, mA = speech_parts('uA.mp3', 15); pB, mB = speech_parts('uB.mp3', 14)
for i, (a, b) in enumerate(pA + pB):
    src = 'uA.mp3' if i < 15 else 'uB.mp3'; k = 'A' if i < 15 else 'B'
    uz[i + 1] = cut(src, T + '/u%02d.wav' % (i + 1), max(0, a - 0.05), b + 0.08, g_u[k])
print('uz split', mA, mB)
s1, s2, s3 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0), sil(T + '/s3.wav', 1.4)
def build(items, out):
    parts, M, t = [], [], 0.0
    for f, kind, idx in items:
        d = dur(f); parts.append(f)
        if kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
        t += d
    concat(parts, out); return M, round(t, 1)
# --- matn yo'lagi ---
h = cut(HDR, T + '/h.wav', gain=g_h)
# gaplar orasidagi chegarani dars ovozidagi eng yaqin jimlikka tortish (so'z kesilmasin)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
BND = []
for k in range(len(lis) - 1):
    m = (seg[lis[k]][1] + seg[lis[k + 1]][0]) / 2
    x, y = min(SIL, key=lambda s: 0 if s[0] <= m <= s[1] else min(abs(s[0] - m), abs(s[1] - m)))
    BND.append((x + 0.06, y - 0.06))
items = [(h, 'h', 0), (s1, None, 0)]
for k, li in enumerate(lis):
    a, b = seg[li][:2]
    a0 = BND[k - 1][1] if k else max([y for x, y in SIL if y <= a + 0.05] or [a - 0.1]) - 0.06
    b0 = BND[k][0] if k + 1 < len(lis) else min([x for x, y in SIL if x >= b - 0.05] or [b + 0.3]) + 0.06
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li), (s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)]
ML, tl = build(items, HERE + '/l93.mp3')
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': ML, 'l': LN}, open(HERE + '/l93.json', 'w'), ensure_ascii=False)
print('l93', tl, len(ML))
# --- lug'at yo'lagi ---
exec(open(HERE + '/sp93.py', encoding='utf-8').read())
pC = dp_parts('uC.mp3', [u for a, u in VA]); pV, mV = speech_parts('arV.mp3', len(VOC))
print('voc split', mV)
items = [(h, 'h', 0), (s1, None, 0)]
for i in range(len(VOC)):
    a, b = pV[i]; ar = cut('arV.mp3', T + '/v%02d.wav' % i, max(0, a - 0.05), b + 0.1, g_v)
    a, b = pC[i]; u = cut('uC.mp3', T + '/m%02d.wav' % i, max(0, a - 0.05), b + 0.08, g_u['C'])
    items += [(ar, 'ar', i), (s1, None, 0), (u, 'uz', i), (s1, None, 0), (ar, 'ar2', i), (s3, None, 0)]
MV, tv = build(items, HERE + '/v93.mp3')
VL = {i: [v[1], v[2][0]] for i, v in enumerate(VOC)}
json.dump({'m': MV, 'l': VL}, open(HERE + '/v93.json', 'w'), ensure_ascii=False)
print('v93', tv, len(MV))
