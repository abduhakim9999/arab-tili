# -*- coding: utf-8 -*-
# 97-dars tinglash: l97.mp3 (mk96.py dan) (Матн: арабча гап -> ўзбекча таржима). Ўзбекча — Davronbek (eleven_v4), EQ'siz: jimlik kesish + atempo 0.95.
# Bosh qism ikki bo'lak (8–9-dars usuli, ekranda yozuvi bilan): bismillah | dars raqami (arabcha, 0.5 s, o'zbekcha u97/H97uz.mp3). Bob nomi 97 da sahifada yo'q (SHOWU).
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
R = '/home/user/arab-tili'; S = os.path.dirname(HERE)
T = HERE + '/tmp97'; os.makedirs(T, exist_ok=True)
AUD = S + '/d97/dlg97.mp3'
HDR = S + '/hdr/h97.mp3'
TGT = -18.0
page = open('/mnt/user-data/outputs/lesson97/index.html', encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
# matn (sahifadagi bilan bir xil)
os.chdir(S + '/d97')
exec(open('../d71/data71.py', encoding='utf-8').read()); exec(open('../d93/h93.py', encoding='utf-8').read())
exec(open('../d93/data93.py', encoding='utf-8').read().split('# ============================================================')[0])
for _d in ('../d94/data94.py', '../d95/data95.py', '../d96/data96.py'):
    exec(open(_d, encoding='utf-8').read().split('# ============================================================')[0])
exec(open('data97.py', encoding='utf-8').read())
os.chdir(HERE)
# o'zbekcha: sekinlatish + jarang
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
def uzp(src, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', UZF, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
uz = {li: uzp(HERE + '/u97/u%02d.mp3' % li, T + '/u%02d.wav' % li) for li in lis}
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s1, s2 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
# mustaqil tekshiruv: ElevenLabs Scribe so'z vaqtlari (align/out/c97.scribe.json, dlgNN timeline) -> sahifa timeline
SC = [w for w in json.load(open(R + '/align/out/c97.scribe.json'))['words'] if w.get('type', 'word') == 'word']
off = 0.0  # dlg97 = sahifa audiosi (kesilmagan)
pos = [(li, wi) for li, wi, *_ in TM if li != 0]
assert len(SC) == len(pos), (len(SC), len(pos))
def clamp(s, e):
    # Scribe ba'zan so'z oxiriga undan keyingi pauzani ham qo'shadi (97-dars: «الْفَصِيحَةَ» 46.96–48.18, nutq 47.68 da tugagan):
    # so'z ichida boshlanib, so'z oxirigacha davom etgan jimlik so'zga kirmaydi
    for x, y in SIL:
        if s + 0.1 < x < e and y >= e - 0.05: return x
    return e
check_bounds(CUT, [(li, w['start'] + off, clamp(w['start'] + off, w['end'] + off)) for (li, wi), w in zip(pos, SC)])
print('bo\'laklar tekshirildi: hammasi to\'g\'ri')
VB, VA, VE = json.load(open(S + '/hdr/hcfg.json'))['97']
hb = cut(HDR, T + '/hb.wav', 0, VB, g_h); hn = cut(HDR, T + '/hn.wav', VA, dur(HDR), g_h)
hr = uzp(HERE + '/u97/H97uz.mp3', T + '/hr.wav')
s05, s08 = sil(T + '/s05.wav', 0.5), sil(T + '/s08.wav', 0.8)
HT = [('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', ''), ('اَلدَّرْسُ السَّابِعُ وَالتِّسْعُونَ', '97-дарс')]
items = [(hb, ('h', HT[0]), 0), (s08, None, 0), (hn, ('h', HT[1]), 0), (s05, 'hx', 0), (hr, 'hx', 0), (s1, None, 0)]
for k, li in enumerate(lis):
    a0, b0 = CUT[li]
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li), (s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if isinstance(kind, tuple): M.append([0, 'h', round(t, 2), round(t + d, 2), kind[1][0], kind[1][1]])
    elif kind == 'hx': M[-1][3] = round(t + d, 2)
    elif kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/l97.mp3')
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l97.json', 'w'), ensure_ascii=False)
print('l97', round(t, 1), len(M))
