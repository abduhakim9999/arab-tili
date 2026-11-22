# -*- coding: utf-8 -*-
"""Yordamchi: lug'atdan qidirish — python3 q.py SO'Z [SO'Z ...] (harakatsiz, qism bo'yicha)"""
import json, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
yal = lambda x: re.sub(r'[ً-ْٰـ]', '', x)
for q in sys.argv[1:]:
    ex = q.startswith('=')
    q = yal(q.lstrip('='))
    for r in L:
        a = yal(r['ar'])
        if (a == q) if ex else (q in a):
            print('%s  %d:%d %s | %s | ay=%s asl=%s tk=%s' % (q, r['id'], r['d'], r['yozuv'], '; '.join(r['uz'])[:60], r.get('ay'), r.get('asl'), r['tk']))
