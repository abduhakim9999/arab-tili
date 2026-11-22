# -*- coding: utf-8 -*-
# c90.txt (align uchun so'zlar ro'yxati) va tekshiruv
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, '..', 'd71', 'data71.py'), encoding='utf-8').read())
exec(open(os.path.join(HERE, '..', 'd93', 'h93.py'), encoding='utf-8').read())
SEP = '# ============================================================'
for _d in ('d93/data93.py', 'd94/data94.py', 'd95/data95.py', 'd96/data96.py', 'd97/data97.py'):
    exec(open(os.path.join(HERE, '..', _d), encoding='utf-8').read().split(SEP)[0])
exec(open(os.path.join(HERE, 'data90.py'), encoding='utf-8').read())
SILENT = {0}
for li, (sp, ws, tr) in enumerate(L):
    cov = sorted(x for t in tr for x in t[1])
    assert cov == list(range(len(ws))), (li, cov, len(ws))
toks = [w['v'] for li, (sp, ws, tr) in enumerate(L) if li not in SILENT for w in ws]
print('qator', len(L), 'so\'z', sum(len(ws) for _, ws, _ in L), 'audio so\'z', len(toks))
if len(sys.argv) > 1:
    open(sys.argv[1], 'w', encoding='utf-8').write(' '.join(toks) + '\n')
for li, (sp, ws, tr) in enumerate(L):
    print(li, len(ws), ' '.join(w['v'] + w['pu'] for w in ws)[:110])
