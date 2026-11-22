# -*- coding: utf-8 -*-
"""Yordamchi (22.11.2026): taklif.py dan chiqib qo'lda tekshirilgan biriktirish faylidan kNN.py yasaydi.
python3 yig.py N /tmp/aNN.txt   → scratchpad/lq/kNN.py
Fayl qatorlari:
  QATOR-SO'Z so'z [^qism] = kn:RAQAM | id:ID [{json}] | new:NOM      (# dan keyingisi — izoh)
  NEW NOM = {"yoz": ..., "uz": [...], "y": ..., "mz": [...], "asl": ...}
  SILA RAQAM = {"yoz": ..., "uz": [...], "mz": [...]}
json ichida: uz (ma'no o'rniga), yoz (yozuv o'rniga), uzm (misol tarjimasida yashil), exw, ex, mz, y, asl."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def oqi(p):
    W, Y, NEW, SILA, ord_ = {}, {}, {}, {}, []
    for raw in open(p, encoding='utf-8'):
        line = raw.rstrip('\n')
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        m = re.match(r'^NEW (\S+) = (\{.*\})\s*$', line)
        if m:
            NEW[m.group(1)] = json.loads(m.group(2)); continue
        m = re.match(r'^SILA (\S+) = (\{.*\})\s*$', line)
        if m:
            SILA[m.group(1)] = json.loads(m.group(2)); continue
        body = line.split('  #')[0].rstrip()
        m = re.match(r'^(\d+)-(\d+) (\S+)(?: \^(\S+))? = (kn|id|new):(\S+)(?: (\{.*\}))?\s*$', body)
        assert m, 'qator: ' + line
        l, i, w, q, t, v, js = m.groups()
        pos = (int(l), int(i)) + ((q,) if q and q != w else ())
        if t == 'kn':
            W.setdefault(v, []).append(pos); continue
        key = (t, v)
        d = json.loads(js) if js else {}
        if t == 'id':
            ext = d.get('uz')
            key = ('id', v, json.dumps(ext, ensure_ascii=False) if ext else '')
        if key not in Y:
            Y[key] = {'pos': [], 'd': {}}
            ord_.append(key)
        Y[key]['pos'].append(pos)
        for k, x in d.items():
            Y[key]['d'].setdefault(k, x)
    return W, Y, NEW, SILA, ord_


def main(n, p):
    W, Y, NEW, SILA, ord_ = oqi(p)
    out = ['# -*- coding: utf-8 -*-', '# %d-dars (kitob_hamma.py; yig.py bilan %s dan yasalgan)' % (n, os.path.basename(p)), 'W = {']
    for kn, ps in W.items():
        out.append(' %r: %r,' % (kn, ps))
    out.append('}')
    if SILA:
        out.append('SILA = {')
        for kn, d in SILA.items():
            out.append(' %r: dict(%s),' % (kn, ', '.join('%s=%r' % (k, v) for k, v in d.items())))
        out.append('}')
    out.append('YANGI = [')
    for key in ord_:
        e = Y[key]
        d = dict(e['d'])
        if key[0] == 'id':
            yoz = d.pop('yoz', None)
            uz = d.pop('uz', None)
            d = dict(ay=int(key[1]), **d)
        else:
            nw = dict(NEW[key[1]])
            yoz = nw.pop('yoz')
            uz = nw.pop('uz')
            nw.update(d)
            d = nw
        out.append(' (%r, %r, %r, dict(%s)),' % (yoz, uz, e['pos'], ', '.join('%s=%r' % (k, v) for k, v in d.items())))
    out.append(']')
    q = os.path.join(HERE, 'k%02d.py' % n)
    open(q, 'w', encoding='utf-8').write('\n'.join(out) + '\n')
    print(q, 'W', len(W), 'YANGI', len(ord_), 'SILA', len(SILA))


if __name__ == '__main__':
    main(int(sys.argv[1]), sys.argv[2])
