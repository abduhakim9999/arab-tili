# -*- coding: utf-8 -*-
"""Yordamchi (22.11.2026): taklif.py qoralamasiga tuzatishlar — python3 tuz.py /tmp/aNN.txt /tmp/tNN.txt > /tmp/bNN.txt
Tuzatish qatorlari:
  L-I => nishon            (o'sha o'rindagi bo'linmagan qator; yoki ^q bo'lsa — L-I^q => nishon)
  L-I! ^q1 => n1 || ^q2 => n2   (o'rinni qaytadan bo'lish; qism so'zning o'zi bo'lsa ^ siz: «=> n»)
  NEW ... / SILA ...       (o'zgarishsiz qo'shiladi)
  # izoh"""
import re, sys

dr = [l.rstrip('\n') for l in open(sys.argv[1], encoding='utf-8')]
T = {}
ekstra = []
for l in open(sys.argv[2], encoding='utf-8'):
    l = l.rstrip('\n')
    if not l.strip() or l.startswith('#'):
        continue
    if l.startswith(('NEW ', 'SILA ')):
        ekstra.append(l); continue
    k, v = l.split(' => ', 1) if '!' not in l.split(' ')[0] else (l.split(' ', 1)[0], l.split(' ', 1)[1])
    assert k not in T, k
    T[k] = v
used = set()
out = []
for line in dr:
    m = re.match(r'^(\d+-\d+) (\S+)(?: \^(\S+))? = (.*)$', line)
    if not m:
        out.append(line); continue
    pos, w, q, rhs = m.groups()
    rhs = rhs.split('  #')[0]
    if pos + '!' in T:
        if pos + '!' in used:
            continue
        used.add(pos + '!')
        for part in T[pos + '!'].split(' || '):
            mm = re.match(r'^(?:\^(\S+) )?=> (.*)$', part.strip())
            assert mm, part
            qq, t = mm.groups()
            assert not qq or qq in w, (pos, qq, w)
            out.append('%s %s%s = %s' % (pos, w, (' ^' + qq) if qq and qq != w else '', t))
        continue
    key = pos + ('^' + q if q else '')
    if key in T:
        rhs = T[key]; used.add(key)
    elif pos in T and not q:
        rhs = T[pos]; used.add(pos)
    out.append('%s %s%s = %s' % (pos, w, (' ^' + q) if q else '', rhs))
qol = set(T) - used
assert not qol, ('ishlatilmagan tuzatish', qol)
bad = [l for l in out if not l.startswith('#') and ( re.search(r'= \?|\?\s*$| \?$', l.split('  #')[0]) or re.search(r'= id:\d+ \?', l))]
for l in out + ekstra:
    print(l)
if bad:
    sys.stderr.write('TEKSHIRILMAGAN:\n' + '\n'.join(bad) + '\n')
