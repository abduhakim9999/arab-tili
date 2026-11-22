# -*- coding: utf-8 -*-
"""Yordamchi (22.11.2026): kitob lug'ati darsi uchun QORALAMA biriktirish fayli — matndagi har so'z (va qo'shilgan
harf / olmosh) qaysi yozuvga tegishli ekanini taxmin qiladi. Natija qo'lda tekshiriladi, keyin yig.py → kNN.py.
python3 taklif.py N > /tmp/aNN.txt
Qator: «qator-so'z so'z ^qism = nishon  # izoh»; nishon: kn:KITOB_RAQAMI | id:ID [{json}] | new:NOM | ?"""
import json, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'src/build'))
from lugat_hamma import dars

TART = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 70, 71, 72, 73, 74, 91, 92, 93, 94, 95, 96, 97, 98]
HR = re.compile('[ً-ْٰـ]')


def nz(s):
    s = HR.sub('', s)
    for a in 'أإآٱ':
        s = s.replace(a, 'ا')
    return s.replace('ى', 'ي').replace('ؤ', 'ء').replace('ئ', 'ء')


def formlar(r):
    f = set()
    t = re.sub(r'\((عَلَى|إِلَى|فِي|مِنْ|عَنْ|بِـ?|لِـ?|مَعَ|هُ)[^)]*\)', ' ', r.get('yozuv') or r['ar'])
    for x in re.split(r'[\s–،,؛()]+', t + ' ' + r['ar'] + ' ' + ' '.join(r.get('fel') or []) + ' ' + ' '.join(r.get('jam') or []) + ' ' + (r.get('mn') or '')):
        x = nz(x).strip('.؟?!ـ:')
        if not x or x in ('ج', 'مء', 'مؤ'):
            continue
        f.add(x)
        if x.startswith('ال') and len(x) > 3:
            f.add(x[2:])
    return f


def main(n):
    D, TR = dars(n)
    L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
    s = open(os.path.join(ROOT, '%d.html' % n), encoding='utf-8').read()
    V = json.loads(re.search(r'var VOC=(\[.*?\]);\n', s, re.S).group(1))
    V = [v for v in V if '.' not in str(v[0])]
    idx = {}
    def qo(f, key, pr, izoh, fel):
        idx.setdefault(f, [])
        if key not in [k for k, *_ in idx[f]]:
            idx[f].append((key, pr, izoh, fel))
    for v in V:
        r = next((x for x in L if x['d'] == n and str(x['kn']) == str(v[0])), None)
        r = r or {'ar': v[1], 'yozuv': v[1]}
        for f in formlar(r):
            qo(f, 'kn:%s' % v[0], -1, v[1] + ' | ' + (v[2][0] if v[2] else ''), r.get('tur') == 'fel')
    for r in L:
        if r['d'] == n or r.get('ay') or r['d'] not in TART:
            continue
        for f in formlar(r):
            qo(f, 'id:%d' % r['id'], TART.index(r['d']) + (0 if not r.get('asl') else 0.5),
               '%d-dars %s | %s' % (r['d'], r['yozuv'], '; '.join(r['uz'])[:40]), r.get('tur') == 'fel')
    for f in idx:
        idx[f].sort(key=lambda x: x[1])

    def topish(m, verb_ok=True):
        """m — harakatsiz asosiy qism (ال bilan bo'lishi mumkin) → nomzodlar"""
        c = [m]
        if m.startswith('ال') and len(m) > 3:
            c.append(m[2:])
        out = list(idx.get(m, []))
        if not out and len(c) > 1:
            out = list(idx.get(c[1], []))
        if not out:
            for x in list(c):
                if len(x) < 4:
                    continue
                for y in (x[:-1] + 'ة' if x.endswith('ت') else None, x[:-1] if x.endswith('ا') else None,
                          x[:-2] if x[-2:] in ('ات', 'ون', 'ين', 'ان') else None, x[:-2] + 'ة' if x.endswith('ات') else None,
                          x[:-1] + 'ي' if x.endswith('ا') else None):
                    if y:
                        out += idx.get(y, [])
        if not out and verb_ok:
            vs = set()
            for x in c:
                for suf in ('', 'تما', 'تم', 'تن', 'نا', 'وا', 'ت', 'ا', 'ن', 'ون', 'ين', 'ان', 'ي'):
                    if suf and not x.endswith(suf):
                        continue
                    b = x[:len(x) - len(suf)] if suf else x
                    if len(b) < 2:
                        continue
                    vs.add(('m', b))
                    if b[0] in 'انتي':
                        vs.add(('u', b[1:]))
            for k, f in vs:
                for f2 in idx:
                    pass
            for f, lst in idx.items():
                for key, pr, iz, fel in lst:
                    if not fel:
                        continue
                    for k, b in vs:
                        if (k == 'm' and (f == b or f == b + 'ي' or f[:-1] == b)) or (k == 'u' and len(f) > 2 and f[0] in 'ايتن' and (f[1:] == b or f[1:-1] == b or f[1:] == b + 'ي')):
                            out.append((key, pr, iz, fel))
        seen, res = set(), []
        for o in sorted(out, key=lambda x: x[1]):
            if o[0] not in seen:
                seen.add(o[0]); res.append(o)
        return res

    PRE = ['وَ', 'فَ', 'بِ', 'لِ', 'كَ', 'سَ', 'لَ']
    SUF = ['هُمَا', 'هِمَا', 'كُمَا', 'هُمْ', 'هِمْ', 'كُمْ', 'هُنَّ', 'هَا', 'هُ', 'هِ', 'كَ', 'كِ', 'نِي', 'نَا', 'ي', 'يَ']

    def bolish(w):
        """eng yaxshi bo'linish: [(qism, rol)], asosiy nomzodlar"""
        best = None
        pres = [('', [])]
        for p1 in PRE:
            if w.startswith(p1):
                pres.append((p1, [p1]))
                for p2 in PRE:
                    if w[len(p1):].startswith(p2) and p1 in ('وَ', 'فَ') and p2 not in ('وَ', 'فَ'):
                        pres.append((p1 + p2, [p1, p2]))
        for pp, pl in pres:
            rest = w[len(pp):]
            sufs = [('', None)] + [(x, x) for x in SUF if rest.endswith(x) and len(nz(rest[:-len(x)])) >= 2]
            for sx, sv in sufs:
                m = rest[:len(rest) - len(sx)] if sx else rest
                mz = nz(m)
                if len(mz) < 1:
                    continue
                if pp.endswith('لِ') and mz.startswith('ل') and not mz.startswith('لل') and len(mz) > 2:
                    alt = 'ال' + mz[1:]
                else:
                    alt = None
                c = topish(mz, verb_ok=True) or (topish(alt) if alt else [])
                if mz.startswith('لل') and pp == '':
                    pass
                score = (bool(c), -len(pl) - (1 if sv else 0))
                if best is None or score > best[0]:
                    pieces = [(x, 'pre') for x in pl] + [(m, 'main')] + ([(sv, 'suf')] if sv else [])
                    best = (score, pieces, c)
        return best[1], best[2]

    def kl(q):          # qo'shilgan bo'lak uchun nomzod
        t = {'وَ': 'وَ..', 'فَ': 'فَـ...', 'بِ': 'بِ..', 'لِ': 'لِ..', 'كَ': 'كَ..', 'سَ': 'سَ..', 'لَ': 'لَـ...',
             'هُ': '...هُ', 'هِ': '...هُ', 'هَا': '...هَا', 'هُمْ': '...هُمْ', 'هِمْ': '...هُمْ', 'كَ': '..كَ', 'كِ': '...كِ',
             'كُمْ': '..كُمْ', 'كُمَا': '..كُمَا', 'نِي': '..نِي', 'نَا': '...نَا', 'ي': '..ِي', 'يَ': '..ِي', 'هُمَا': '..هُمَا', 'هِمَا': '..هُمَا'}
        return t.get(q, q)

    KL = {'وَ': 'id:107', 'فَ': 'id:261 ?', 'بِ': 'id:196 ?', 'لِ': 'id:777 ?', 'كَ': 'id:578', 'سَ': 'id:670', 'لَ': 'id:215',
          'هُ': 'id:144 {"uz": ["у(ни), унинг, унга (мз)"]}', 'هِ': 'id:144 {"uz": ["у(ни), унинг, унга (мз)"]}',
          'هَا': 'id:618 {"uz": ["у(ни), унинг, унга (мн)"]}', 'هُمْ': 'id:879', 'هِمْ': 'id:879', 'كُمْ': 'id:6 {"uz": ["сиз(лар)"]}',
          'كُمَا': 'id:1010', 'نِي': 'id:986', 'نَا': 'id:197 {"uz": ["биз(нинг), бизни"]}', 'ي': 'id:9 {"uz": ["менинг (мз)"]}',
          'يَ': 'id:9 {"uz": ["менинг (мз)"]}', 'كِ': 'id:37'}
    for l, T in enumerate(D):
        tr = ' '.join(t for t, ix in TR[l]) if l < len(TR) else ''
        print('# %d  %s' % (l, tr))
        for i, w0 in enumerate(T):
            w = w0.split('~')[0]
            if not nz(re.sub(r'[.،؟!:()«»"0-9\-]', '', w)):
                continue
            pieces, c = bolish(w)
            for q, rol in pieces:
                qs = '' if q == w else ' ^' + q
                if rol == 'main':
                    tg = c[0][0] if c else '?'
                    iz = (c[0][2] if c else '') + ('   || ' + ' / '.join('%s %s' % (k, z[:45]) for k, _, z, _ in c[1:4]) if len(c) > 1 else '')
                else:
                    tg = 'id:11 {"uz": ["сен(инг), сенга, сени (мз)"]}' if (q == 'كَ' and rol == 'suf') else KL.get(q, '?k')
                    iz = 'qo\'shimcha ' + kl(q)
                print('%d-%d %s%s = %s  # %s' % (l, i, w, qs, tg, iz))


if __name__ == '__main__':
    main(int(sys.argv[1]))
