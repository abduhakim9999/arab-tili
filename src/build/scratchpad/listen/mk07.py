# -*- coding: utf-8 -*-
# 7-dars tinglash: l7.mp3 (Матн). VAQTINCHA: faqat arabcha gaplar (o'zbekcha tarjima ovozi kredit kelgach qo'shiladi:
# listen/u07/uLL.mp3 bo'lsa, gapdan keyin qo'yiladi). Bosh qism: h7 (bismillah + bob + dars) -> o'zbekchasi (b7/H7uz.mp3, Davronbek).
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
S = os.path.dirname(HERE); O = '/mnt/user-data/outputs/arab-tili'
T = HERE + '/tmp07'; os.makedirs(T, exist_ok=True)
AUD = [O + '/' + f for f in os.listdir(O) if f.startswith('a7-') and f.endswith('.mp3')][0]
HDR = S + '/hdr/h7.mp3'; TGT = -18.0
page = open(O + '/7.html', encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
os.chdir(S + '/d07'); exec(open('../d71/data71.py', encoding='utf-8').read()); exec(open('data07.py', encoding='utf-8').read()); os.chdir(HERE)
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
def uzp(src, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', UZF, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
uz = {li: uzp(HERE + '/u07/u%02d.mp3' % li, T + '/u%02d.wav' % li) for li in lis if os.path.exists(HERE + '/u07/u%02d.mp3' % li)}
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s1, s2 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
h = cut(HDR, T + '/h.wav', gain=g_h)
hr = uzp(HERE + '/b7/H7uz.mp3', T + '/hr.wav')
concat([h, sil(T + '/s05.wav', 0.5), hr], T + '/hh.mp3'); h = cut(T + '/hh.mp3', T + '/hh.wav')
items = [(h, 'h', 0), (s1, None, 0)]
for li in lis:
    a0, b0 = CUT[li]
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li)]
    items += [(s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)] if li in uz else [(s2, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/l7.mp3')
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l7.json', 'w'), ensure_ascii=False)
print('l7', round(t, 1), len(M), 'uz:', len(uz)); print({k: v for k, v in CUT.items()})
