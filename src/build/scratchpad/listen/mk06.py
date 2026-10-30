# -*- coding: utf-8 -*-
# 6-dars tinglash: l6.mp3 (Матн: арабча гап -> ўзбекча таржима). Ўзбекча — ElevenLabs SARHAD-SIZ Narrator (eleven_v4),
# сал секинроқ (atempo 0.9) ва жарангдорроқ (паст частота камайтирилиб, 2.5–5 кГц кўтарилган).
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
R = '/home/claude/arab-tili'; S = os.path.dirname(HERE)
T = HERE + '/tmp06'; os.makedirs(T, exist_ok=True)
AUD = [R + '/' + f for f in os.listdir(R) if f.startswith('a6-') and f.endswith('.mp3')][0]
HDR = S + '/hdr/h6.mp3'
TGT = -18.0
page = open(R + '/6.html', encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
lis = sorted(seg)
# matn (sahifadagi bilan bir xil)
os.chdir(S + '/d06')
exec(open('../d71/data71.py', encoding='utf-8').read())
exec(open('data06.py', encoding='utf-8').read())
os.chdir(HERE)
# o'zbekcha: sekinlatish + jarang
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'atempo=0.9,highpass=f=90,equalizer=f=220:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=3,equalizer=f=6000:t=q:w=1:g=1.5,'
       'acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90')
uz = {}
for li in lis:
    src = HERE + '/u06/u%02d.mp3' % li; mid = T + '/p%02d.wav' % li
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af',
         UZF, '-ar', str(SR), '-ac', '1', mid])
    uz[li] = cut(mid, T + '/u%02d.wav' % li, gain=TGT - lufs(mid))
g_ar, g_h = TGT - lufs(AUD), TGT - lufs(HDR)
s1, s2 = sil(T + '/s1.wav', 0.6), sil(T + '/s2.wav', 1.0)
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
# mustaqil tekshiruv: ElevenLabs Scribe so'z vaqtlari (align/out/c06.scribe.json, dlgNN timeline) -> sahifa timeline
SC = [w for w in json.load(open(R + '/align/out/c06.scribe.json'))['words'] if w.get('type', 'word') == 'word']
AL = json.load(open(R + '/align/out/c06.align.json'))
off = TM[[i for i, x in enumerate(TM) if x[0] != 0][0]][2] + 0.04 - AL[0]['start']  # sarlavha siljishi
pos = [(li, wi) for li, wi, *_ in TM if li != 0]
assert len(SC) == len(pos), (len(SC), len(pos))
check_bounds(CUT, [(li, w['start'] + off, w['end'] + off) for (li, wi), w in zip(pos, SC)])
print('bo\'laklar tekshirildi: hammasi to\'g\'ri')
h = cut(HDR, T + '/h.wav', gain=g_h)
# bosh qism: bismillah (faqat arabcha) + dars raqami arabcha -> o'zbekchasi
run(['ffmpeg', '-v', 'error', '-y', '-i', HERE + '/u06/r06.mp3', '-af', UZF, '-ar', str(SR), '-ac', '1', T + '/pr.wav'])
hr = cut(T + '/pr.wav', T + '/hr.wav', gain=TGT - lufs(T + '/pr.wav'))
concat([h, sil(T + '/s05.wav', 0.5), hr], T + '/hh.mp3'); h = cut(T + '/hh.mp3', T + '/hh.wav')
items = [(h, 'h', 0), (s1, None, 0)]
for k, li in enumerate(lis):
    a0, b0 = CUT[li]
    items += [(cut(AUD, T + '/a%02d.wav' % li, a0, b0, g_ar), 'ar', li), (s1, None, 0), (uz[li], 'uz', li), (s2, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/l6.mp3')
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    LN[li] = [' '.join(w['v'] + w['pu'] for w in ws), re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip(), sp]
json.dump({'m': M, 'l': LN}, open(HERE + '/l6.json', 'w'), ensure_ascii=False)
print('l6', round(t, 1), len(M))
