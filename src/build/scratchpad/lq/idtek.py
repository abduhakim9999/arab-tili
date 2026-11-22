# -*- coding: utf-8 -*-
"""Tekshiruv: eski lug'at yozuvlarining id, tk, asl, ay o'zgarmaganmi (python3 idtek.py ESKI.json)"""
import json, sys, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
A = {r['id']: r for r in json.load(open(sys.argv[1], encoding='utf-8'))['s']}
B = {r['id']: r for r in json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']}
x = 0
for i, a in A.items():
    b = B.get(i)
    if not b:
        print('YO\'Q:', i, a['d'], a['yozuv']); x += 1; continue
    for k in ('d', 'kn', 'tk', 'asl', 'ay', 'tur', 'uz', 'au'):
        if a.get(k) != b.get(k):
            print('O\'ZGARDI', i, a['d'], a['yozuv'], k, a.get(k), '→', b.get(k)); x += 1
print('yangi yozuvlar:', len(set(B) - set(A)), '| farq:', x)
