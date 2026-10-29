import sys, os, json, subprocess
N = sys.argv[1]; PFX = sys.argv[2] if len(sys.argv) > 2 else 'u'; D = '../d' + N; O = '/home/claude/arab-tili/align/out'
exec(open('../d71/data71.py', encoding='utf-8').read())
exec(open(D + '/h%s.py' % N, encoding='utf-8').read())
exec(open(D + '/data%s.py' % N, encoding='utf-8').read())
WT = json.load(open(O + '/c%s.align.json' % N))
pos = [p for p, _ in align_tokens(L)]
assert len(pos) == len(WT)
seg = {}
for (li, wi), w in zip(pos, WT):
    a = seg.setdefault(li, [w['start'], w['end']]); a[1] = w['end']
lis = sorted(seg)
T = 'tmp'; os.makedirs(T, exist_ok=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
def wav(src, dst, ss=None, to=None):
    cmd = ['ffmpeg', '-v', 'error', '-y'] + (['-ss', '%.3f' % ss, '-to', '%.3f' % to] if ss is not None else []) + ['-i', src, '-ar', '44100', '-ac', '1', dst]
    subprocess.run(cmd, check=True)
def sil(dst, t): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '%.2f' % t, dst], check=True)
parts, MAP, t = [], [], 0.0
def add(f, kind=None, li=None):
    global t
    d = dur(f); parts.append(f)
    if kind: MAP.append([li, kind, round(t, 2), round(t + d, 2)])
    t += d
wav('../hdr/h%s.mp3' % N, T + '/h.wav'); add(T + '/h.wav', 'h', 0)
sil(T + '/s1.wav', 0.6); sil(T + '/s2.wav', 0.9); add(T + '/s1.wav')
for k, li in enumerate(lis):
    a, b = seg[li]
    nxt = seg[lis[k + 1]][0] if k + 1 < len(lis) else b + 0.5
    a0 = max(0, a - 0.12); b0 = min(b + 0.25, nxt - 0.02) if nxt > b else b + 0.15
    wav('../d%s/dlg%s.mp3' % (N, N), T + '/a%02d.wav' % li, a0, b0); add(T + '/a%02d.wav' % li, 'ar', li)
    add(T + '/s1.wav')
    wav(O + '/%s%s-%02d.mp3' % (PFX, N, li), T + '/u%02d.wav' % li); add(T + '/u%02d.wav' % li, 'uz', li)
    add(T + '/s2.wav')
open(T + '/list.txt', 'w').write(''.join("file '%s'\n" % os.path.abspath(p) for p in parts))
out = 'l%s.mp3' % N
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', T + '/list.txt', '-ac', '1', '-b:a', '64k', out], check=True)
import re
LN = {}
for li in lis:
    sp, ws, tr = L[li]
    ar = ' '.join(w['v'] + w['pu'] for w in ws)
    uz = re.sub(r'\s+', ' ', ' '.join(c[0] for c in tr)).strip()
    LN[li] = [ar, uz, sp]
json.dump({'m': MAP, 'l': LN}, open('l%s.json' % N, 'w'), ensure_ascii=False)
print(out, round(t, 1), len(MAP))
