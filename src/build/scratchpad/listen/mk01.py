# -*- coding: utf-8 -*-
# 1-dars tinglash: l1.mp3 (Матн). 06.11.2026. Arabcha — dars ovozidan; o'zbekcha — Davronbek (b1/M1uz.mp3, bitta generatsiya,
# b1/split.json bo'yicha bo'linadi: 0 — bob nomi, 1 — dars raqami, 2.. — gaplar 1..7).
# Bosh qism: h1[0:9.75] (bismillah + bob, arabcha) + bob uz + h1[9.75:11.55] (dars raqami) + raqam uz.
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
S = os.path.dirname(HERE); O = '/mnt/user-data/outputs/arab-tili'; R = '/home/claude/arab-tili'
T = HERE + '/tmp01'; os.makedirs(T, exist_ok=True)
AUD = [O + '/' + f for f in os.listdir(O) if f.startswith('a1-') and f.endswith('.mp3')][0]
HDR = S + '/hdr/h1.mp3'; TGT = -18.0
VA, VE = json.load(open(S + '/hdr/hcfg.json'))['1'][1:3]
page = open(O + '/1.html', encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for w in TM:
    li, a, b = w[0], w[2], w[4] if len(w) > 4 and w[4] is not None else w[3]
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
os.chdir(S + '/d01'); exec(open('../d71/data71.py', encoding='utf-8').read()); exec(open('data01.py', encoding='utf-8').read()); os.chdir(HERE)
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
# 06.11.2026: har bo'lak ALOHIDA generatsiya (u01/g/m0 — bob, m1 — dars raqami, gN — N-gap); hech narsa qirqilmaydi, faqat chetdagi jimlik
GF = {0: HERE + '/u01/g/m0.mp3', 1: HERE + '/u01/g/m1.mp3'}
GF.update({li + 1: HERE + '/u01/g/g%d.mp3' % li for li in lis})
def uzp(i, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', GF[i], '-af', UZF, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
uz = {li: uzp(li + 1, T + '/u%02d.wav' % li) for li in lis}
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s05, s1, s2 = sil(T + '/s05.wav', 0.5), sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
# mustaqil tekshiruv: c01.align.json (dlg01 ga nisbatan) -> dars audiosi vaqtiga siljitiladi
AL = json.load(open(R + '/align/out/c01.align.json'))
off = seg[1][0] - AL[0]['start']; k = 0; words = []
for li in lis:
    n = len([w for w in TM if w[0] == li])
    for w in AL[k:k + n]: words.append((li, w['start'] + off, w['end'] + off))
    k += n
check_bounds(CUT, words)
VB = json.load(open(S + '/hdr/hcfg.json'))['1'][0]
hb_ = cut(HDR, T + '/hb_.wav', 0, VB, g_h); hv = cut(HDR, T + '/hv.wav', VB, VA, g_h); hd = cut(HDR, T + '/hd.wav', VA, VE, g_h)
hbu, hru = uzp(0, T + '/hb.wav'), uzp(1, T + '/hr.wav')
s08 = sil(T + '/s08.wav', 0.8)
# bosh qism uch bo'lak: bismillah | bob (arabcha, 0.5 s, o'zbekcha) | dars raqami (arabcha, 0.5 s, o'zbekcha); ekranda har biri o'z yozuvi bilan
HT = [('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', ''), ('الْوَحْدَةُ الْأُولَى: التَّحِيَّةُ وَالتَّعَارُفُ', '1-боб: Саломлашиш ва танишиш'), ('اَلدَّرْسُ الْأَوَّلُ', '1-дарс')]
concat([hb_, s08, hv, s05, hbu, s08, hd, s05, hru], T + '/hh.mp3'); h = cut(T + '/hh.mp3', T + '/hh.wav')
HP = [(hb_, HT[0]), (None, None), (hv, HT[1]), (s05, None), (hbu, None), (None, None), (hd, HT[2]), (s05, None), (hru, None)]
items = []
for f, ht in [(hb_, HT[0]), (s08, None), (hv, HT[1]), (s05, 'x'), (hbu, 'x'), (s08, None), (hd, HT[2]), (s05, 'x'), (hru, 'x')]:
    items.append((f, ('h', ht) if ht and ht != 'x' else ('hx' if ht == 'x' else None), 0))
items.append((s1, None, 0))
# 06.11.2026: mavzu (0-qator, «حِوَارٌ») — dars audiosidan 11.75–13.15 (ikki tomoni jimlik) + o'zbekchasi g0 («Suhbat»)
CUT[0] = [11.75, 13.15]
uz[0] = (lambda d: (run(['ffmpeg', '-v', 'error', '-y', '-i', HERE + '/u01/g/g0.mp3', '-af', UZF, '-ar', str(SR), '-ac', '1', d + '.p.wav']), cut(d + '.p.wav', d, gain=TGT - lufs(d + '.p.wav')))[1])(T + '/u00m.wav')
for li in [0] + lis:
    a0, b0 = CUT[li]
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li), (s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if isinstance(kind, tuple): M.append([0, 'h', round(t, 2), round(t + d, 2), kind[1][0], kind[1][1]])
    elif kind == 'hx': M[-1][3] = round(t + d, 2)   # o'zbekchasi — shu bosh bo'lakka qo'shiladi
    elif kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/l1.mp3')
LN = {}
for li in [0] + lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l1.json', 'w'), ensure_ascii=False)
print('l1', round(t, 1), len(M)); print({k: [round(x, 2) for x in v] for k, v in CUT.items()})
