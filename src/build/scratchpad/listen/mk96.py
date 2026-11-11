# -*- coding: utf-8 -*-
# 96-dars tinglash: l96.mp3 (mk95.py dan) (Матн: арабча гап -> ўзбекча таржима). Ўзбекча — Davronbek (eleven_v4), EQ'siz: jimlik kesish + atempo 0.95.
# Bosh qism: bismillah (h96[0:3.2]) + dars raqami (h96[hcfg[1]:]) -> o'zbekchasi (u96/H96uz.mp3). Bob nomi 96 da sahifada yo'q (SHOWU).
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
R = '/home/user/arab-tili'; S = os.path.dirname(HERE)
T = HERE + '/tmp96'; os.makedirs(T, exist_ok=True)
AUD = S + '/d96/dlg96.mp3'
HDR = S + '/hdr/h96.mp3'
TGT = -18.0
page = open('/mnt/user-data/outputs/lesson96/index.html', encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
# matn (sahifadagi bilan bir xil)
os.chdir(S + '/d96')
exec(open('../d71/data71.py', encoding='utf-8').read()); exec(open('../d93/h93.py', encoding='utf-8').read())
exec(open('../d93/data93.py', encoding='utf-8').read().split('# ============================================================')[0])
exec(open('../d94/data94.py', encoding='utf-8').read().split('# ============================================================')[0])
exec(open('data96.py', encoding='utf-8').read())
os.chdir(HERE)
# o'zbekcha: sekinlatish + jarang
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
def uzp(src, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', UZF, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
uz = {li: uzp(HERE + '/u96/u%02d.mp3' % li, T + '/u%02d.wav' % li) for li in lis}
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s1, s2 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
# mustaqil tekshiruv: ElevenLabs Scribe so'z vaqtlari (align/out/c96.scribe.json, dlgNN timeline) -> sahifa timeline
SC = [w for w in json.load(open(R + '/align/out/c96.scribe.json'))['words'] if w.get('type', 'word') == 'word']
off = 0.0  # dlg96 = sahifa audiosi (kesilmagan)
pos = [(li, wi) for li, wi, *_ in TM if li != 0]
assert len(SC) == len(pos), (len(SC), len(pos))
check_bounds(CUT, [(li, w['start'] + off, w['end'] + off) for (li, wi), w in zip(pos, SC)])
print('bo\'laklar tekshirildi: hammasi to\'g\'ri')
hb = cut(HDR, T + '/hb.wav', 0, 3.2, g_h); CF = json.load(open(S + '/hdr/hcfg.json'))['96']; hn = cut(HDR, T + '/hn.wav', CF[1], dur(HDR), g_h)
hr = uzp(HERE + '/u96/H96uz.mp3', T + '/hr.wav')
concat([hb, sil(T + '/s03.wav', 0.3), hn, sil(T + '/s05.wav', 0.5), hr], T + '/hh.mp3'); h = cut(T + '/hh.mp3', T + '/hh.wav')
items = [(h, 'h', 0), (s1, None, 0)]
for k, li in enumerate(lis):
    a0, b0 = CUT[li]
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li), (s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/l96.mp3')
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l96.json', 'w'), ensure_ascii=False)
print('l96', round(t, 1), len(M))
