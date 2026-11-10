# -*- coding: utf-8 -*-
# 8/9-dars tinglash: lN.mp3 (Матн) + vN.mp3 (Луғат). python3 mk89.py 8
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
N = int(sys.argv[1]); NN = '%02d' % N
S = os.path.dirname(HERE); O = S + '/out2'
T = HERE + '/tmp' + NN; os.makedirs(T, exist_ok=True)
AUD = [O + '/' + f for f in os.listdir(O) if f.startswith('a%d-' % N) and f.endswith('.mp3')][0]
HDR = S + '/hdr/h%d.mp3' % N; TGT = -18.0
page = open(O + '/%d.html' % N, encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
D = S + '/d' + NN; os.chdir(D)
exec(open('../d71/data71.py', encoding='utf-8').read()); exec(open('../d08/h89.py', encoding='utf-8').read())
exec(open('data%s.py' % NN, encoding='utf-8').read()); exec(open('voc%s.py' % NN, encoding='utf-8').read()); os.chdir(HERE)
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
def uzp(src, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', UZF, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
U = HERE + '/u' + NN
uz = {li: uzp(U + '/u%02d.mp3' % li, T + '/u%02d.wav' % li) for li in lis if os.path.exists(U + '/u%02d.mp3' % li)}
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s1, s2, s3 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0), sil(T + '/s3.wav', 1.4)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL); check_bounds(CUT, [(w[0], w[2], w[4]) for w in TM if w[0]])
# bosh qism uch bo'lak (1-dars usuli): bismillah | bob (arabcha, 0.5 s, o'zbekcha) | dars raqami (arabcha, 0.5 s, o'zbekcha)
VB, VA, VE = json.load(open(S + '/hdr/hcfg.json'))[str(N)]
hb_ = cut(HDR, T + '/hb_.wav', 0, VB, g_h); hv = cut(HDR, T + '/hv.wav', VB, VA, g_h); hd = cut(HDR, T + '/hd.wav', VA, VE + 0.3, g_h)
hbu = uzp(HERE + '/b%d/B2uz.mp3' % N, T + '/hbu.wav')   # «Ikkinchi bob. Oila.» — alohida generatsiya
hru = uzp(HERE + '/b%d/H%duz.mp3' % (N, N), T + '/hr.wav')
s05, s08 = sil(T + '/s05.wav', 0.5), sil(T + '/s08.wav', 0.8)
HT = [('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', ''), ('الْوَحْدَةُ الثَّانِيَةُ: الْأُسْرَةُ', '2-боб: Оила'),
      {8: ('اَلدَّرْسُ الثَّامِنُ', '8-дарс'), 9: ('اَلدَّرْسُ التَّاسِعُ', '9-дарс')}[N]]
HEAD = [(hb_, HT[0]), (s08, None), (hv, HT[1]), (s05, 'x'), (hbu, 'x'), (s08, None), (hd, HT[2]), (s05, 'x'), (hru, 'x')]
def build(items, out):
    parts, M, t = [], [], 0.0
    for f, kind, idx in items:
        d = dur(f); parts.append(f)
        if isinstance(kind, tuple): M.append([0, 'h', round(t, 2), round(t + d, 2), kind[1][0], kind[1][1]])
        elif kind == 'hx': M[-1][3] = round(t + d, 2)
        elif kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
        t += d
    concat(parts, out); return M, t
def head():
    return [(f, ('h', ht) if ht and ht != 'x' else ('hx' if ht == 'x' else None), 0) for f, ht in HEAD] + [(s1, None, 0)]
items = head()
for li in lis:
    a0, b0 = CUT[li]
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li)]
    items += [(s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)] if li in uz else [(s2, None, 0)]
M, t = build(items, HERE + '/l%d.mp3' % N)
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l%d.json' % N, 'w'), ensure_ascii=False)
print('l%d' % N, round(t, 1), len(M), 'uz:', len(uz), 'lines:', len(lis))
# Луғат
ARF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,atempo=0.88')
REUSE = {8: {9: U + '/v/a06.mp3'}, 9: {8: U + '/v/a07.mp3', 19: HERE + '/u08/v/a06.mp3'}}[N]
def pp(src, flt, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', flt, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
items = head()
for i in range(len(VOC)):
    src = REUSE.get(i, U + '/v/a%02d.mp3' % i)
    ar = pp(src, ARF, T + '/va%02d.wav' % i)
    # 10.11.2026: jam / muannas shakli — alohida generatsiya (jNN), birinchi shakldan 0.7 s sukutdan keyin
    js = {9: {8: U + '/v/j07.mp3'}}.get(N, {}).get(i, U + '/v/j%02d.mp3' % i)
    if os.path.exists(js):
        jw = pp(js, ARF, T + '/vj%02d.wav' % i)
        concat([ar, sil(T + '/s07.wav', 0.7), jw], T + '/vaj%02d.mp3' % i); ar = cut(T + '/vaj%02d.mp3' % i, T + '/vaj%02d.wav' % i)
    un = U + '/v/n%02d.mp3' % i   # o'zbekchasi yangilangan (muannasi / jami qo'shilgan)
    u = uzp(un if os.path.exists(un) else U + '/v/m%02d.mp3' % i, T + '/vm%02d.wav' % i)   # Davronbek — EQ yo'q (texnik.md 6)
    items += [(ar, 'ar', i), (s1, None, 0), (u, 'uz', i), (s1, None, 0), (ar, 'ar2', i), (s3, None, 0)]
M, t = build(items, HERE + '/v%d.mp3' % N)
json.dump({'m': M, 'l': {i: [v[1], v[2][0]] for i, v in enumerate(VOC)}}, open(HERE + '/v%d.json' % N, 'w'), ensure_ascii=False)
print('v%d' % N, round(t, 1), len(M), 'voc:', len(VOC))
