#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""data/ fayllarini tekshiradi (brauzersiz, tez) — deploy.sh har joylashdan oldin chaqiradi.
    python3 src/build/tekshir_data.py
Xato bo'lsa chiqish kodi 1. Batafsil: docs/texnik.md 14."""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ajrat import grab, manba_xesh

X = []
def yuk(n):
    return json.load(open(os.path.join('data', n), encoding='utf-8'))
try:
    L, M, Q, D = yuk('lugat.json')['s'], yuk('mashq.json')['s'], yuk('qoida.json')['s'], yuk('darslar.json')['s']
    K = json.load(open('src/build/idlar.json', encoding='utf-8'))
except Exception as e:
    print("XATO: data/ yoki idlar.json o'qilmadi:", e); sys.exit(1)

for nom, rows, tur in (("lug'at", L, 'w'), ('mashq', M, 'q')):
    ids = [r['id'] for r in rows]
    if len(ids) != len(set(ids)):
        X.append("%s: takror raqam bor" % nom)
    ruxsat = set(K[tur].values())
    if set(ids) - ruxsat:
        X.append("%s: idlar.json da yo'q raqamlar: %s" % (nom, sorted(set(ids) - ruxsat)[:10]))
    if set(ids) & set(K['ochgan'][tur]):
        X.append("%s: o'chirilgan raqam qayta ishlatilgan" % nom)
    if ids and max(ids) >= K[tur + 'n']:
        X.append("%s: raqam hisoblagichdan katta" % nom)
wid = set(r['id'] for r in L)
for r in L:
    if not r.get('ar') or not r.get('uz'):
        X.append("lug'at %s: arabcha yoki ma'no bo'sh" % r['id'])
    if 'asl' in r and r['asl'] not in wid:
        X.append("lug'at %s: asl=%s yo'q" % (r['id'], r['asl']))
    if 'au' in r and not (r['au'][0] < r['au'][1]):
        X.append("lug'at %s: ovoz vaqti noto'g'ri" % r['id'])
qk = set(r['k'] for r in Q)
for r in M:
    if sum(1 for v in r['var'] if v[0] == r['gap'][r['w']][0]) != 1:
        X.append("mashq %s: to'g'ri javob variantlarda bitta emas" % r['id'])
    if set(r.get('q', [])) - qk:
        X.append("mashq %s: noma'lum qoida belgisi %s" % (r['id'], sorted(set(r['q']) - qk)))
# manba sahifalar o'zgarganmi (ajrat.py qayta ishga tushirilmagan)
idx = open('index.html', encoding='utf-8').read()
bor = set(x['n'] for x in grab(idx, 'LESSONS'))
if bor != set(d['n'] for d in D):
    X.append("darslar ro'yxati index.html dan farq qiladi: %s" % sorted(bor ^ set(d['n'] for d in D)))
esk = [d['n'] for d in D if not os.path.exists(d['sahifa']) or manba_xesh(open(d['sahifa'], encoding='utf-8').read()) != d['h']]
if esk:
    X.append("dars ma'lumoti o'zgargan, data/ eskirgan: %s" % esk)
if X:
    print("data/ XATO:"); [print('  -', x) for x in X]
    print("Yechim: python3 src/build/ajrat.py (repo ildizidan), keyin qayta joylash.")
    sys.exit(1)
print("data/ joyida: lug'at %d, mashq %d, qoida %d, dars %d" % (len(L), len(M), len(Q), len(D)))
