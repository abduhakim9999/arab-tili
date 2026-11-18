# -*- coding: utf-8 -*-
# 10-dars tinglash (Матн): l10.mp3 + l10.json; bosh qism Луғат yo'lagi uchun tmp10/hh.wav.
# Bob boshi (3-bob «السَّكَنُ»): bosh qism uch bo'lak (1-dars usuli, ekranda yozuvi bilan):
#   bismillah | bob (arabcha, 0.5 s, o'zbekcha b10/B3uz) | dars raqami (arabcha, 0.5 s, o'zbekcha b10/H10uz)
# keyin mavzu «حِوَارٌ» (hdr/topic_hiwar.mp3) + «Suhbat» (u01/g/g0.mp3), keyin gaplar: arabcha (dars audiosi) -> o'zbekcha (Davronbek).
# Gap chegarasi — line_bounds(); Scribe (align/out/c10.scribe.json) bilan check_bounds() (mk97.py usuli, clamp bilan).
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
R = '/home/claude/arab-tili'; S = os.path.dirname(HERE)
N = 10; T = HERE + '/tmp10'; os.makedirs(T, exist_ok=True)
AUD = S + '/d10/dlg10.mp3'
HDR = S + '/hdr/h10.mp3'
TGT = -18.0
page = open('/mnt/user-data/outputs/lesson10/index.html', encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
os.chdir(S + '/d10')
exec(open('../d71/data71.py', encoding='utf-8').read()); exec(open('../d08/h89.py', encoding='utf-8').read())
exec(open('data10.py', encoding='utf-8').read())
os.chdir(HERE)
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
ARF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse')
def pp(src, flt, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', flt, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
uzp = lambda src, dst: pp(src, UZF, dst)
uz = {li: uzp(HERE + '/u10/u%02d.mp3' % li, T + '/u%02d.wav' % li) for li in lis}
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s1, s2 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
SC = [w for w in json.load(open(R + '/align/out/c10.scribe.json'))['words'] if w.get('type', 'word') == 'word']
pos = [(li, wi) for li, wi, *_ in TM if li != 0]
assert len(SC) == len(pos), (len(SC), len(pos))
def clamp(s, e):
    for x, y in SIL:
        if s + 0.1 < x < e and y >= e - 0.05: return x
    return e
check_bounds(CUT, [(li, w['start'], clamp(w['start'], w['end'])) for (li, wi), w in zip(pos, SC)])
print("bo'laklar tekshirildi: hammasi to'g'ri")
VB, VA, VE = json.load(open(S + '/hdr/hcfg.json'))[str(N)]
hb_ = cut(HDR, T + '/hb_.wav', 0, VB, g_h); hv = cut(HDR, T + '/hv.wav', VB, VA, g_h); hd = cut(HDR, T + '/hd.wav', VA, dur(HDR), g_h)
hbu = uzp(HERE + '/b10/B3uz.mp3', T + '/hbu.wav')
hru = uzp(HERE + '/b10/H10uz.mp3', T + '/hr.wav')
s05, s08 = sil(T + '/s05.wav', 0.5), sil(T + '/s08.wav', 0.8)
HT = [('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', ''), ('الْوَحْدَةُ الثَّالِثَةُ: السَّكَنُ', '3-боб: Уй-жой'), ('اَلدَّرْسُ الْعَاشِرُ', '10-дарс')]
HEAD = [(hb_, HT[0]), (s08, None), (hv, HT[1]), (s05, 'x'), (hbu, 'x'), (s08, None), (hd, HT[2]), (s05, 'x'), (hru, 'x')]
concat([f for f, _ in HEAD], T + '/hh.mp3'); cut(T + '/hh.mp3', T + '/hh.wav')   # Луғат yo'lagi uchun
items = [(f, ('h', ht) if ht and ht != 'x' else ('hx' if ht == 'x' else None), 0) for f, ht in HEAD] + [(s1, None, 0)]
# mavzu (0-qator «حِوَارٌ»): arabchasi hdr/topic_hiwar.mp3, o'zbekchasi u01/g/g0.mp3 («Suhbat»)
a0w = pp(S + '/hdr/topic_hiwar.mp3', ARF, T + '/a00.wav')
u0w = uzp(HERE + '/u01/g/g0.mp3', T + '/u00.wav')
items += [(a0w, 'ar', 0), (s1, None, 0), (u0w, 'uz', 0), (s2, None, 0)]
for li in lis:
    a0, b0 = CUT[li]
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li), (s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if isinstance(kind, tuple): M.append([0, 'h', round(t, 2), round(t + d, 2), kind[1][0], kind[1][1]])
    elif kind == 'hx': M[-1][3] = round(t + d, 2)
    elif kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/l10.mp3')
LN = {}
for li in [0] + lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l10.json', 'w'), ensure_ascii=False)
print('l10', round(t, 1), len(M), {k: [round(x, 2) for x in v] for k, v in CUT.items()})
