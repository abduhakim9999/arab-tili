# -*- coding: utf-8 -*-
# 90-dars tinglash (Матн): l90.mp3 + l90.json; bosh qism Луғат yo'lagi uchun tmp90/hh.wav. (mk10.py qolipi)
# Bob boshi (2-kitob 6-bob «الْمِهَنُ»): bosh qism uch bo'lak (ekranda yozuvi bilan):
#   bismillah | bob (arabcha, 0.5 s, o'zbekcha b90/B6uz) | dars raqami (arabcha, 0.5 s, o'zbekcha b90/H90uz)
# keyin gaplar (1-qator — mavzu, dars audiosida o'qilgan): arabcha (dars audiosi) -> o'zbekcha (Davronbek).
# Gap chegarasi — line_bounds(); Scribe (align/out/c90.scribe.json) bilan check_bounds() (clamp bilan).
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
R = '/home/claude/arab-tili'; S = os.path.dirname(HERE)
N = 90; T = HERE + '/tmp90'; os.makedirs(T, exist_ok=True)
AUD = S + '/d90/dlg90.mp3'
HDR = S + '/hdr/h90.mp3'
TGT = -18.0
page = open('/mnt/user-data/outputs/lesson90/index.html', encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
# 26.11.2026: sahifa audiosi (a90-*.mp3) = bosh qism (h90) + dars audiosi — TM o'sha vaqtda; dars audiosi (dlg90) vaqtiga o'tkaziladi
_A = [f for f in os.listdir(R) if re.match(r'a%d-[0-9a-f]{8}\.mp3$' % N, f)][0]
SH = dur(R + '/' + _A) - dur(AUD)
TM = [[li, wi, a - SH, t3 - SH, b - SH] for li, wi, a, t3, b in TM]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
os.chdir(S + '/d90')
exec(open('../d71/data71.py', encoding='utf-8').read()); exec(open('../d93/h93.py', encoding='utf-8').read())
for _d in ('../d93/data93.py', '../d94/data94.py', '../d95/data95.py', '../d96/data96.py', '../d97/data97.py'):
    exec(open(_d, encoding='utf-8').read().split('# ============================================================')[0])
exec(open('data90.py', encoding='utf-8').read())
os.chdir(HERE)
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
ARF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse')
def pp(src, flt, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', flt, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
uzp = lambda src, dst: pp(src, UZF, dst)
uz = {li: uzp(HERE + '/u90/u%02d.mp3' % li, T + '/u%02d.wav' % li) for li in lis}
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s1, s2 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
SC = [w for w in json.load(open(R + '/align/out/c90.scribe.json'))['words'] if w.get('type', 'word') == 'word']
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
hbu = uzp(HERE + '/b90/B6uz.mp3', T + '/hbu.wav')
hru = uzp(HERE + '/b90/H90uz.mp3', T + '/hr.wav')
s05, s08 = sil(T + '/s05.wav', 0.5), sil(T + '/s08.wav', 0.8)
HT = [('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', ''), ('الْوَحْدَةُ السَّادِسَةُ: الْمِهَنُ', '6-боб: Касблар'), ('اَلدَّرْسُ التِّسْعُونَ', '90-дарс')]
HEAD = [(hb_, HT[0]), (s08, None), (hv, HT[1]), (s05, 'x'), (hbu, 'x'), (s08, None), (hd, HT[2]), (s05, 'x'), (hru, 'x')]
concat([f for f, _ in HEAD], T + '/hh.mp3'); cut(T + '/hh.mp3', T + '/hh.wav')   # Луғат yo'lagi uchun
items = [(f, ('h', ht) if ht and ht != 'x' else ('hx' if ht == 'x' else None), 0) for f, ht in HEAD] + [(s1, None, 0)]
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
concat(parts, HERE + '/l90.mp3')
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l90.json', 'w'), ensure_ascii=False)
print('l90', round(t, 1), len(M), {k: [round(x, 2) for x in v] for k, v in CUT.items()})
