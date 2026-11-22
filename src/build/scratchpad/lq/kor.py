# -*- coding: utf-8 -*-
"""Yordamchi: dars matni (qator-so'z), lug'atda qoplanmagan o'rinlar va eski yozuvlardan nomzodlar.
python3 kor.py N [--hammasi]"""
import json, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'src/build'))
from lugat_hamma import dars
TART = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 70, 71, 72, 73, 74, 91, 92, 93, 94, 95, 96, 97, 98]
n = int(sys.argv[1])
D, TR = dars(n)
L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
yal = lambda x: re.sub(r'[ً-ْٰـ~.،؟!:()«»"0-9\-]', '', x)
mw = {}
for r in L:
    if r['d'] == n:
        for m in r.get('mw', []):
            mw[m] = r['id']
oldin = [r for r in L if TART.index(r['d']) < TART.index(n) and not r.get('ay')]
idx = {}
for r in oldin:
    idx.setdefault(yal(r['ar']).replace(' ', ''), []).append(r)
def nomzod(w):
    w = yal(w)
    c = [w]
    for p in ('وال', 'فال', 'بال', 'كال', 'لل', 'ال', 'و', 'ف', 'ب', 'ل', 'ك', 'س'):
        if w.startswith(p) and len(w) - len(p) >= 2:
            c.append(w[len(p):])
    out = []
    for x in list(c):
        for s in ('هما', 'كما', 'كم', 'هم', 'نا', 'ها', 'ه', 'ك', 'ي', 'ة', 'ات', 'ون', 'ين', 'ان'):
            if x.endswith(s) and len(x) - len(s) >= 2:
                c.append(x[:-len(s)])
    for x in c:
        for r in idx.get(x, []) + idx.get(x + 'ة', []):
            t = '%d:%d %s=%s' % (r['id'], r['d'], r['ar'], r['uz'][0][:28])
            if t not in out:
                out.append(t)
    return out[:4]
VOC = json.loads(re.search(r'var VOC=(\[.*?\]);\n', open(os.path.join(ROOT, '%d.html' % n), encoding='utf-8').read(), re.S).group(1))
print('VOC', len(VOC))
for l, T in enumerate(D):
    tr = ' '.join(t for t, ix in TR[l]) if l < len(TR) else ''
    print('== %d  %s' % (l, tr[:160]))
    for i, w in enumerate(T):
        k = '%d-%d' % (l, i)
        s = w.split('~')[0]
        if not yal(s):
            continue
        if k in mw and '--hammasi' not in sys.argv:
            print('   %s %s  ✓%s' % (k, s, mw[k]))
        else:
            print('   %s %s  ?? %s' % (k, s, ' | '.join(nomzod(s))))
