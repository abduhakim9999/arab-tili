import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lat import lat
N = sys.argv[1]; D = '../d' + N
exec(open('../d71/data71.py', encoding='utf-8').read())
exec(open(D + '/h%s.py' % N, encoding='utf-8').read())
exec(open(D + '/data%s.py' % N, encoding='utf-8').read())
out = []
for li, (sp, ws, tr) in enumerate(L):
    if li == 0: continue
    t = ' '.join(c[0] for c in tr)
    t = t.replace('(ﷺ)', '(соллаллоҳу алайҳи васаллам)').replace('–', '').replace('“', '').replace('”', '').replace('"', '')
    t = re.sub(r'\s+', ' ', t).strip()
    out.append((li, lat(t)))
SPf = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sp%s.py' % N)
if os.path.exists(SPf):
    G = {}; exec(open(SPf, encoding='utf-8').read(), G)
    out = [(li, G['SP'].get(li, t)) for li, t in out]
PFX = sys.argv[2] if len(sys.argv) > 2 else 'u'
R = '/home/claude/arab-tili/align/tts'
for li, t in out:
    open('%s/%s%s-%02d.txt' % (R, PFX, N, li), 'w', encoding='utf-8').write('uz-UZ-SardorNeural\n' + t + '\n')
    print(li, t)
