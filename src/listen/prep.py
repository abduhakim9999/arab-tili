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
R = '/home/claude/arab-tili/align/tts'
for li, t in out:
    open('%s/u%s-%02d.txt' % (R, N, li), 'w', encoding='utf-8').write('uz-UZ-SardorNeural\n' + t + '\n')
    print(li, t)
