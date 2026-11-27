# -*- coding: utf-8 -*-
"""Darsning HAMMA so'zi lug'atda — umumiy yasovchi (22.11.2026; docs/texnik.md 14; namuna — scratchpad/a94/voc94.py).
Har dars fayli (scratchpad/aNN/vocNN.py) V ro'yxatini beradi va run(N, V) ni chaqiradi:
  (yozuv, [matndagi ma'no], o'rinlar [(qator, so'z[, qism])], qo'shimcha)
qo'shimcha: y — boshqa ma'no(lar) («;» bilan), ay / asl — eski yozuv (id yoki «DARS:bosh shakl», masalan «95:عَرَفَ»),
  mz — fe'lning «-ди» ma'nosi, uzm — tarjimada yashil qism ({…} bilan), exw — misol nechanchi o'rindan, ex — tayyor misol.
Ishlatish: python3 src/build/scratchpad/aNN/vocNN.py  → N.html VOC; keyin ajrat.py; keyin vocNN.py --mz; yana ajrat.py."""
import json, re, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


def dars(n):
    s = open(os.path.join(ROOT, '%d.html' % n), encoding='utf-8').read()
    t = re.search(r'var D=(\[.*?\]);\n', s, re.S).group(1)
    rows = re.findall(r'\["(.*?)",`(.*?)`\]', t, re.S)
    D = [[x.split('|')[0] for x in w.split('/')] for sp, w in rows]
    TR = json.loads(re.search(r'var TR=(\[.*?\]);\n', s, re.S).group(1))
    return D, TR


def bolak(D, l, i):
    T = D[l]
    a = i
    while a > 0 and not re.search(r'~[.؟!]', T[a - 1]):
        a -= 1
    b = i
    while b < len(T) - 1 and not re.search(r'~[.؟!]', T[b]):
        b += 1
    return a, b + 1


def misol(D, TR, l, i, qism, uzm):
    T = D[l]
    a, b = bolak(D, l, i)
    ar = []
    for j in range(a, b):
        w, _, p = T[j].partition('~')
        if j == i:
            if qism:
                k = 0 if w.startswith(qism) else len(w) - len(qism) if w.endswith(qism) else w.find(qism)
                assert k >= 0, (l, i, qism, w)
                w = w[:k] + '{' + qism + '}' + w[k + len(qism):]
            else:
                w = '{' + w + '}'
        ar.append(w + (('' if p[:1] in '.،؟!:؛' else ' ') + p if p else ''))
    uz, hit, ich = [], False, False
    for txt, ix in TR[l]:
        if ix:
            ich = a <= min(ix) < b
        if not ich:
            continue
        if not uzm and i in ix:
            m = re.match(r'^(.*?)([.,!?»”:]*)$', txt)
            txt = '{' + m.group(1) + '}' + m.group(2)
            hit = True
        uz.append(txt)
    uz = ' '.join(uz)
    if uzm:
        p = uzm.replace('{^', '').replace('{', '').replace('}', '')
        assert p in uz, (l, i, uzm, uz)
        uz = uz.replace(p, uzm if '{' in uzm else '{' + uzm + '}', 1)
        hit = True
    assert hit, (l, i, uz)
    return [' '.join(ar).replace(' ~', ''), uz]


def egasi(V, D):
    yal = lambda x: re.sub(r'[ً-ْٰـ~.،؟!:()0-9]', '', x)
    E = {}
    for n, (yoz, uz, w, e) in enumerate(V):
        rk = 0 if yoz.startswith('.') else 1
        for x in w:
            k = '%d-%d' % (x[0], x[1])
            u = (len(yal(x[2] if len(x) > 2 else D[x[0]][x[1]].split('~')[0])), rk)
            if k not in E or u > E[k][0]:
                E[k] = (u, n)
    return {k: v[1] for k, v in E.items()}


def idtop(x, L):
    """«95:عَرَفَ» → id (shu darsdagi o'sha bosh shaklli yozuv); son bo'lsa — o'zi"""
    if isinstance(x, int):
        return x
    d, ar = x.split(':', 1)
    t = [r['id'] for r in L if r['d'] == int(d) and r['ar'] == ar and not r.get('ay')]
    assert len(t) == 1, (x, t)
    return t[0]


def voc(n, V):
    D, TR = dars(n)
    L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
    EG = egasi(V, D)
    out = []
    for k, (yoz, uz, w, e) in enumerate(V, 1):
        e = dict(e)
        ex = e.pop('ex', None)
        uzm = e.pop('uzm', None)
        exw = e.pop('exw', 0)
        e.pop('mz', None)
        for f in ('ay', 'asl'):
            if f in e:
                e[f] = idtop(e[f], L)
        for x in w:
            assert x[0] < len(D) and x[1] < len(D[x[0]]), (yoz, x)
            if len(x) > 2:
                assert x[2] in D[x[0]][x[1]], (yoz, x, D[x[0]][x[1]])
        if ex is None:
            x = w[exw]
            ex = [misol(D, TR, x[0], x[1], x[2] if len(x) > 2 else None, uzm)]
        ww = ['%d-%d' % (x[0], x[1]) for x in w if EG['%d-%d' % (x[0], x[1])] == k - 1]
        if ww:
            e['w'] = ww
        out.append([str(k), yoz, uz, ex, e])
    return out


def mz(n, V):
    L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
    p = os.path.join(ROOT, 'src/build/lugat-moziy.json')
    M = json.load(open(p, encoding='utf-8'))
    Y = {v[0]: v[3].get('mz') for v in V}
    c = 0
    for r in L:
        if r['d'] == n and r['tur'] == 'fel':
            m = Y.get(r['yozuv'])
            assert m, r['yozuv']
            M[str(r['id'])] = m
            c += 1
    open(p, 'w', encoding='utf-8').write(json.dumps(M, ensure_ascii=False, indent=0) + '\n')
    print('mz:', c)


def run(n, V):
    if '--mz' in sys.argv:
        mz(n, V)
        return
    out = voc(n, V)
    if '--kor' in sys.argv:
        for v in out:
            print(v[0], v[1], '|', v[2][0], '|', (v[3][0][0] + ' | ' + v[3][0][1]) if v[3] else '-')
        return
    J = json.dumps(out, ensure_ascii=False)
    for p in ('%d.html' % n, 'src/build/outputs/lesson%d/index.html' % n):
        p = os.path.join(ROOT, p)
        if not os.path.exists(p):
            continue
        s = open(p, encoding='utf-8').read()
        s2, c = re.subn(r'var VOC=\[.*?\];\n', lambda m: 'var VOC=' + J + ';\n', s, count=1, flags=re.S)
        assert c == 1, p
        open(p, 'w', encoding='utf-8').write(s2)
        print(p, 'VOC:', len(out))
