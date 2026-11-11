# -*- coding: utf-8 -*-
# 96-dars «ЎЗ» (UZT; uzt89.py dan, 11.11.2026): 1-qadam — o'zbekcha bo'laklarni align/in ga; 2-qadam (--fin) — UZT ni NN.html ga yozish.
import os, sys, json, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
from lat import lat
N = int(sys.argv[1]); R = '/home/user/arab-tili'; S = os.path.dirname(HERE)
J = json.load(open(HERE + '/l%d.json' % N))
LF = [f for f in os.listdir(R) if re.match(r'l%d-[0-9a-f]{8}\.mp3$' % N, f)][0]
UZ = {m[0]: (m[2], m[3]) for m in J['m'] if m[1] == 'uz'}
SAY = {8: {2: 'Ha, bu shajara. Bu paygʻambarning, sollallohu alayhi va sallam, oilasi.'}, 96: {14: 'Allohga omonatsiz!'}}.get(N, {})
SKIP = {8: {2: [5, 6, 7, 8]}}.get(N, {})   # qavsdagi (с.а.в.) — ovozda o'qiladi, sahifada qavsda: so'z ro'yxatiga kirmaydi
def txt(li):
    if li in SAY: return SAY[li]
    t = re.sub(r'\s*\([^)]*\)', '', J['l'][str(li)][1])
    return lat(t).replace('qaerda', 'qayerda').replace('Qaerda', 'Qayerda')
if '--fin' not in sys.argv:
    off = {}
    for li, (a, b) in UZ.items():
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', R + '/' + LF, '-ss', str(a), '-to', str(b), '-c:a', 'libmp3lame', '-q:a', '3', R + '/align/in/u%d-%d.uz.mp3' % (N, li)], check=True)
        open(R + '/align/in/u%d-%d.uz.txt' % (N, li), 'w').write(txt(li) + '\n'); off[li] = a
    json.dump(off, open(R + '/align/in/u%d.off.json' % N, 'w')); print('in', len(off)); sys.exit()
# --fin
page = open(R + '/%d.html' % N, encoding='utf-8').read()
TM = json.JSONDecoder().raw_decode(page[page.find('TM=[[') + 3:])[0]
seg = {}
for li, wi, a, t3, b in TM:
    if li == 0: continue
    x = seg.setdefault(li, [a, b]); x[0] = min(x[0], a); x[1] = max(x[1], b)
AUD = R + '/' + [f for f in os.listdir(R) if re.match(r'a%d-[0-9a-f]{8}\.mp3$' % N, f)][0]
e = subprocess.run(['ffmpeg', '-hide_banner', '-i', AUD, '-af', 'silencedetect=noise=-36dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
SIL = list(zip([float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', e)], [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]))
CUT = line_bounds(seg, SIL)
AR = {m[0]: m[2] for m in J['m'] if m[1] == 'ar'}
o = {str(li): round(AR[li] - CUT[li][0], 3) for li in AR}
H = [m for m in J['m'] if m[1] == 'h']
CF = json.load(open(S + '/hdr/hcfg.json')).get(str(N)); HN0 = 3.2 + 0.3  # mk96: hb(3.2) + 0.3 s sukut
h = [[H[1][2], H[1][3]], [H[2][2], H[2][3]]] if len(H) >= 3 else [[HN0, H[0][3]]]  # 96: bosh qism bitta bo'lak — dars qatori = raqam (ar) + o'zbekchasi
w = {}
for li, (a, b) in UZ.items():
    ws = json.load(open(R + '/align/out/u%d-%d.uz.align.json' % (N, li)))
    ws = [x for i, x in enumerate(ws) if i not in SKIP.get(li, [])]
    nt = len(re.sub(r'\s*\([^)]*\)', '', J['l'][str(li)][1]).split())
    assert len(ws) == nt, (li, len(ws), nt)
    w[str(li)] = [[round(a + x['start'], 2) for x in ws], round(a + ws[-1]['end'], 2)]
U = {'f': LF, 'o': o, 'h': h, 'w': w}
json.dump(U, open(HERE + '/uzt%d.json' % N, 'w'), ensure_ascii=False)
tag = '<script>var UZT=' + json.dumps(U, ensure_ascii=False) + ';</script>\n'
page = re.sub(r'<script>var UZT=.*?;</script>\n', '', page)
i = page.find('<script src="shell.js"></script>'); page = page[:i] + tag + page[i:]
open(R + '/%d.html' % N, 'w', encoding='utf-8').write(page); print('UZT', N, len(o), len(w))
