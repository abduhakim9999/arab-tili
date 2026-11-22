# -*- coding: utf-8 -*-
"""Kitob lug'ati bor darslarda (1–10, 70–74, 91, 93) — darsning HAMMA so'zi lug'atda (22.11.2026, foydalanuvchi:
«qolganlarini ham to'g'rilab chiqish kerak», «qil»; docs/texnik.md 14).
Kitob yozuvlari joyida qoladi (raqami, tartibi, misollari, id — o'zgarmaydi; Eshitish «Луғат» ovozi tartib bo'yicha ulangani uchun ham),
har biriga matndagi o'rinlari (w) qo'shiladi; matnda bor, lug'atda yo'q so'zlar oxiriga qo'shiladi (kn «oxirgi.N»), oldingi darsdagi
so'zga ay/asl bilan bog'lanadi. Fe'l boshqaruvi (SILA) — yozuv va ma'no o'zgaradi, id saqlanadi (idlar.json kaliti ko'chiriladi).
Ruschasi bor darsda (src/ru/dNN.json) yangi yozuvlarning ruscha ma'nosi (ru) va misol tarjimasi (dars ruscha tarjimasidan) qo'shiladi.

Dars fayli: src/build/scratchpad/lq/kNN.py — W {kn: [(qator, so'z[, qism]), ...]}, YANGI [(yozuv, [ma'no], o'rinlar, dict)],
SILA {kn: dict(yoz=..., uz=[...], mz=[...], ru=[...], rumz=[...])}.
YANGI dict: ay / asl, uzm, exw, ex (lugat_hamma.py dagidek), mz (fe'l), y, ru (ruscha ma'no), rum (ruscha misolda yashil qism), rux (tayyor ruscha misol).
Ishlatish (repo ildizidan): python3 src/build/scratchpad/lq/kitob_hamma.py N [--kor]  → ajrat.py → ... N --mz → ajrat.py"""
import json, os, re, sys, importlib.util
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'src/build'))
from lugat_hamma import dars, misol, egasi, idtop
from ajrat import plain


def spec(n):
    p = os.path.join(os.path.dirname(__file__), 'k%02d.py' % n)
    s = importlib.util.spec_from_file_location('k%02d' % n, p)
    m = importlib.util.module_from_spec(s)
    s.loader.exec_module(m)
    return getattr(m, 'W', {}), getattr(m, 'YANGI', []), getattr(m, 'SILA', {})


def html(n):
    return os.path.join(ROOT, '%d.html' % n)


def voc0(n):
    s = open(html(n), encoding='utf-8').read()
    return json.loads(re.search(r'var VOC=(\[.*?\]);\n', s, re.S).group(1))


def ru_misol(RT, D, l, i, rum):
    """Ruscha misol: o'sha gap bo'lagining ruscha tarjimasi; so'zga mos bo'lak (yoki rum) {…} bilan."""
    from lugat_hamma import bolak
    a, b = bolak(D, l, i)
    uz, ich, hit = [], False, False
    for txt, ix in RT[l]:
        if ix:
            ich = a <= min(ix) < b
        if not ich:
            continue
        if rum is None and i in ix and not hit:       # rum=False — belgisiz
            m = re.match(r'^(.*?)([.,!?»”:]*)$', txt)
            txt = '{' + m.group(1) + '}' + m.group(2)
            hit = True
        uz.append(txt)
    uz = ' '.join(uz)
    if rum:
        p = rum.replace('{', '').replace('}', '')  # noqa
        assert p in uz, (l, i, rum, uz)
        uz = uz.replace(p, rum if '{' in rum else '{' + rum + '}', 1)
    return uz


def qur(n):
    W, YANGI, SILA = spec(n)
    D, TR = dars(n)
    V0 = voc0(n)
    L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
    rp = os.path.join(ROOT, 'src/ru/d%02d.json' % n)
    RU = json.load(open(rp, encoding='utf-8')) if os.path.exists(rp) and os.path.exists(os.path.join(ROOT, 'ru%d.html' % n)) else None   # ruscha sahifasi yo'q (70 qoralamasi) — tegilmaydi
    kn0 = [v[0] for v in V0]
    assert set(W) <= set(kn0), set(W) - set(kn0)
    # yangi qatorlar oldin qo'shilgan bo'lsa (qayta ishga tushirish) — kitob qatorlarigacha qaytariladi
    V0 = [v for v in V0 if '.' not in str(v[0])]
    base = V0[-1][0]
    rows = []                                           # (kn, yozuv, uz, ex, e, o'rinlar)
    for v in V0:
        kn, yoz, uz, ex = v[0], v[1], v[2], v[3]
        e = dict(v[4]) if len(v) > 4 and isinstance(v[4], dict) else {}
        e.pop('w', None)
        if kn in SILA:                                  # SILA kaliti — kitob raqami (kn)
            s = SILA[kn]
            yoz = s['yoz']
            if s.get('uz'):
                uz = s['uz']
        rows.append([kn, yoz, uz, ex, e, [tuple(x) for x in W.get(kn, [])]])
    for k, (yoz, uz, w, d) in enumerate(YANGI, 1):
        d = dict(d)
        e = {}
        for f in ('ay', 'asl'):
            if f in d:
                e[f] = idtop(d[f], L)
        if e.get('ay') and (yoz is None or uz is None):   # yozuv / ma'no berilmasa — bog'langan yozuvniki (ma'no raqamisiz)
            t = next(r for r in L if r['id'] == e['ay'])
            yoz = yoz or t['yozuv']
            uz = uz or [re.sub(r'^\s*\d+\.\s*', '', m) for m in t['uz']]
            YANGI[k - 1] = (yoz, uz, w, YANGI[k - 1][3])
        if d.get('y'):
            e['y'] = d['y']
        for x in w:
            assert x[0] < len(D) and x[1] < len(D[x[0]]), (yoz, x)
            if len(x) > 2:
                assert x[2] in D[x[0]][x[1]], (yoz, x, D[x[0]][x[1]])
        ex = d.get('ex')
        if ex is None:
            x = w[d.get('exw', 0)]
            ex = [misol(D, TR, x[0], x[1], x[2] if len(x) > 2 else None, d.get('uzm'))]
            ex[0][0] = re.sub(r'\s{2,}', ' ', re.sub(r' ([?!])', r'\1', ex[0][0]))        # kitob darslarida tinish lotincha «?» — oldida bo'shliq bo'lmasin
        rows.append(['%s.%d' % (base, k), yoz, uz, ex, e, [tuple(x) for x in w]])
    EG = egasi([(r[1], r[2], r[5], r[4]) for r in rows], D)
    tek = {}
    for j, r in enumerate(rows):
        for x in r[5]:
            k = '%d-%d' % (x[0], x[1])
            tek.setdefault(k, []).append(j)
        ww = ['%d-%d' % (x[0], x[1]) for x in r[5] if EG['%d-%d' % (x[0], x[1])] == j]
        if ww:
            r[4]['w'] = ww
    # matndagi har o'rin kamida bitta yozuvda bo'lsin
    yal = lambda x: re.sub(r'[ً-ْٰـ~.،؟!:()«»"0-9\-]', '', x)
    qol = ['%d-%d %s' % (l, i, w.split('~')[0]) for l, T in enumerate(D) for i, w in enumerate(T)
           if yal(w.split('~')[0]) and '%d-%d' % (l, i) not in tek]
    out = [[r[0], r[1], r[2], r[3]] + ([r[4]] if r[4] else []) for r in rows]
    return out, rows, qol, RU, D


def yoz(n):
    global V0_ESKI
    W, YANGI, SILA = spec(n)
    V0_ESKI = [v for v in voc0(n) if '.' not in str(v[0])]
    out, rows, qol, RU, D = qur(n)
    if qol:
        sys.exit('qoplanmagan o\'rinlar: ' + ', '.join(qol))
    J = json.dumps(out, ensure_ascii=False)
    for p in (html(n), os.path.join(ROOT, 'src/build/outputs/lesson%02d/index.html' % n)):
        if not os.path.exists(p):
            continue
        s = open(p, encoding='utf-8').read()
        s2, c = re.subn(r'var VOC=\[.*?\];\n', lambda m: 'var VOC=' + J + ';\n', s, count=1, flags=re.S)
        assert c == 1, p
        open(p, 'w', encoding='utf-8').write(s2)
        print(p, 'VOC:', len(out))
    # idlar.json: SILA bilan o'zgargan yozuv kaliti
    ip = os.path.join(ROOT, 'src/build/idlar.json')
    I = json.load(open(ip, encoding='utf-8'))
    c = 0
    c0, c1 = {}, {}
    for v in V0_ESKI:                                # kitob qatorlari: eski kalit → yangi kalit (tartib o'zgarmaydi)
        kn, a = v[0], v[1]
        b = SILA[kn]['yoz'] if kn in SILA else a
        c0[plain(a)] = c0.get(plain(a), 0) + 1
        c1[plain(b)] = c1.get(plain(b), 0) + 1
        k0, k1 = '%d|%s|%d' % (n, plain(a), c0[plain(a)]), '%d|%s|%d' % (n, plain(b), c1[plain(b)])
        if k0 != k1 and k0 in I['w']:
            assert k1 not in I['w'], k1
            I['w'][k1] = I['w'].pop(k0); c += 1
    open(ip, 'w', encoding='utf-8').write(json.dumps(I, ensure_ascii=False, indent=0, sort_keys=True) + '\n')
    print('kalit:', c)
    # ruscha
    if RU is not None:
        rp = os.path.join(ROOT, 'src/ru/d%02d.json' % n)
        RT = RU['tr']
        voc = RU['voc']
        for k in [k for k in voc if '.' in k]:
            del voc[k]
        base = [r for r in rows if '.' not in str(r[0])][-1][0]
        Y = {'%s.%d' % (base, j): v for j, v in enumerate(YANGI, 1)}
        for r in rows:
            if '.' not in str(r[0]):
                s = SILA.get(r[0])
                if s and s.get('ru'):
                    voc[r[0]]['m'] = s['ru']
                if s and s.get('rumz'):
                    voc[r[0]]['mz'] = s['rumz']
                continue
            yoz_, uz, w, d = Y[r[0]]
            rum_ = d.get('ru') or ru_ay(r[4].get('ay'))
            assert rum_, ('ruscha ma\'no yo\'q', r[0], yoz_)
            if len(rum_) != len(r[2]):
                assert len(r[2]) == 1, (r[0], rum_, r[2])
                rum_ = ['; '.join(rum_)]
            q = {'m': rum_}
            if d.get('rumz'):
                q['mz'] = d['rumz']
            if r[3]:
                if d.get('rux') is not None:
                    q['x'] = d['rux']
                else:
                    x = w[d.get('exw', 0)]
                    q['x'] = [[ru_misol(RT, D, x[0], x[1], d.get('rum'))]]
            if q.get('x'):                                # ruscha misolda {…} belgisi bo'lmaydi: belgi() bo'lagan matnni ru.js
                q['x'] = [[re.sub(r'[{}]', '', t) for t in e] for e in q['x']]   # tarjima qilmoqchi bo'ladi (harvest MISS)
            voc[r[0]] = q
        t = open(rp, encoding='utf-8').read()             # faqat «voc» bo'limi qayta yoziladi (fayl uslubi saqlanadi)
        blk = ' "voc": {\n' + ',\n'.join('  %s: %s' % (json.dumps(k, ensure_ascii=False), json.dumps(v, ensure_ascii=False)) for k, v in voc.items()) + '\n }'
        t2, c = re.subn(r' "voc": \{\n.*?\n \}', lambda m: blk, t, count=1, flags=re.S)
        assert c == 1 and json.loads(t2)['voc'] == voc, rp
        open(rp, 'w', encoding='utf-8').write(t2)
        print(rp, 'voc:', len(voc))


def ru_ay(i):
    """ay bog'langan yozuvning ruscha ma'nosi (o'sha darsning dNN.json idan; ma'no raqami olib tashlanadi)"""
    if not i:
        return None
    L = {r['id']: r for r in json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']}
    r = L[i]
    p = os.path.join(ROOT, 'src/ru/d%02d.json' % r['d'])
    if not os.path.exists(p):
        return None
    v = json.load(open(p, encoding='utf-8'))['voc'].get(str(r['kn']))
    return [re.sub(r'^\s*\d+\.\s*', '', m) for m in v['m']] if v else None


def mz(n):
    W, YANGI, SILA = spec(n)
    L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
    p = os.path.join(ROOT, 'src/build/lugat-moziy.json')
    M = json.load(open(p, encoding='utf-8'))
    B = {r['id']: r for r in L}
    Y = {(v[0] or B[idtop(v[3]['ay'], L)]['yozuv']): v[3].get('mz') or (M.get(str(idtop(v[3]['ay'], L))) if v[3].get('ay') else None) for v in YANGI}
    K = {kn: s.get('mz') for kn, s in SILA.items()}
    c = 0
    for r in L:
        if r['d'] == n and r['tur'] == 'fel':
            m = K.get(r['kn']) if r['kn'] in K else Y.get(r['yozuv'])
            if m:
                M[str(r['id'])] = m; c += 1
            assert str(r['id']) in M, ('mz yo\'q', r['yozuv'])
    open(p, 'w', encoding='utf-8').write(json.dumps(M, ensure_ascii=False, indent=0) + '\n')
    print('mz:', c)


if __name__ == '__main__':
    n = int(sys.argv[1])
    if '--mz' in sys.argv:
        mz(n)
    elif '--kor' in sys.argv:
        out, rows, qol, RU, D = qur(n)
        for r in rows:
            e = {k: v for k, v in r[4].items() if k != 'w'}
            print(r[0], r[1], '|', r[2][0] if r[2] else '', '|', r[4].get('w', ''), e or '', '|', (r[3][0][0] + ' | ' + r[3][0][1]) if r[3] and '.' in str(r[0]) else '')
        print('QOPLANMAGAN:', qol)
    else:
        yoz(n)
