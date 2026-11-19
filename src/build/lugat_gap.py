# -*- coding: utf-8 -*-
"""Lug'at so'zi uchun takror kartasidagi gap (19.11.2026, foydalanuvchi: «qaysi ma'no so'ralayotgani gapdan bilinsin»).

ajrat.py chaqiradi: har lug'at yozuviga `g` maydoni —
    {"k": 0, "i": [[so'z, boshi, oxiri], ...]}                       — kitob misoli (r["x"][k]) ichida
    {"l": qator, "r": [boshi, oxiri], "a": ["so'z", ...], "i": [...], "tr": "tarjima"} — dars matnidagi gap
`i` — ajratiladigan joy: gapdagi so'z raqami (misolda — bo'shliq bilan bo'linganda, darsda — `a` ichida) va shu so'z ichidagi belgi oralig'i
(harakatli yozuvda; oldi qo'shimcha harf bo'lsa — faqat o'sha harf, masalan بِخَيْرٍ dagi بِ).
Tanlash: avval kitob misoli (so'z ichida bo'lsa; 2+ so'zli birinchisi); misol bitta so'zdan iborat yoki yo'q bo'lsa —
o'sha dars matnidagi gap (u ham bitta so'z bo'lsa — kitob misoli).
Topilmasa — `g` yo'q (karta avvalgidek).
"""
import re

HK = re.compile('[ً-ْٰ]')
PUN = '.,،؛;:؟?!«»"()…–—- '
TUR_SOZ = ['жар', 'атф', 'ибтидо', 'истифҳом', 'нидо', 'жазм', 'насб', 'таъкид', 'масдар', 'жавоб', 'ҳол', 'зоида', 'олмош']


def nrm(s):
    s = HK.sub('', s).replace('ـ', '')
    return re.sub('[أإآٱ]', 'ا', s)


def wn(w):
    return nrm(w).strip(PUN)


def bolak(ar):
    """«بِ..» → [('pre','بِ')], «..ِي» → [('suf','ِي')], «خَيْرٌ مِنْ ..» → [('w','خَيْرٌ'), ('w','مِنْ')]."""
    out = []
    if '،' in ar:                                    # «عَصِيرٌ، عَصِيرَةٌ» — muqobil shakllar: bitta so'z (bosh_ozaklar hammasini oladi)
        ar = ar.split('،')[0]
    T = ar.split()
    for j, t in enumerate(T):
        if re.fullmatch(r'[.…؟?]+', t):
            if out and out[-1][0] == 'w' and len(wn(out[-1][1])) == 1:
                out[-1] = ('pre', out[-1][1])          # «وَ ...», «لِ ...» — bo'shliq bilan yozilgan, lekin qo'shilib keladi
            continue
        t = t.replace('؟', '').replace('?', '')
        pre, post = t.startswith('.'), t.endswith('.')
        core = t.strip('.').strip('ـ')
        if not core:
            continue
        typ = 'pre' if post and not pre else 'suf' if pre and not post else 'w'
        if typ == 'w' and len(wn(core)) == 1:           # yolg'iz «وَ» — har doim qo'shilib keladi
            typ = 'pre'
        out.append((typ, core))
    return out


SUF = ['هما', 'كما', 'هم', 'هن', 'كم', 'كن', 'ها', 'نا', 'ني', 'ه', 'ك', 'ي']
FSUF = ['تما', 'تم', 'تن', 'نا', 'وا', 'ون', 'ين', 'ان', 'ت', 'ا', 'ن', 'و', 'ي']


def ozaklar(w, fel=False):
    """Gapdagi so'zdan mumkin bo'lgan o'zaklar (old qo'shimcha, ال, olmosh qo'shimchasi olinib)."""
    s = wn(w)
    a = {s}
    if '\u064B' in w and s.endswith('ا') and len(s) > 2:     # أَهْلاً, خَيْرًا — tanvin alifi
        a.add(s[:-1])
        s = s[:-1]
    for p in ('و', 'ف'):
        if s.startswith(p) and len(s) > 2:
            a.add(s[1:])
    b = set()
    for x in a:
        for p in ('بال', 'كال', 'لل', 'ال', 'ب', 'ل', 'ك', 'س'):
            if x.startswith(p) and len(x) - len(p) >= 2:
                b.add(x[len(p):])
    a |= b
    b = set()
    for x in a:
        for sf in SUF + (FSUF if fel else []):
            if x.endswith(sf) and len(x) - len(sf) >= (2 if sf in SUF else 3):
                y = x[:-len(sf)]
                b.add(y)
                if y.endswith('ت'):
                    b.add(y[:-1] + 'ة')
                if y.endswith('ي'):
                    b.add(y[:-1] + 'ى')
    a |= b
    if fel:                                      # muzore' old harfi
        a |= {x[1:] for x in a if x[:1] in 'يتان' and len(x) > 3}
    return a


def bosh_ozaklar(r):
    f = r['ar'].split('،') + r.get('jam', []) + ([r['mn']] if r.get('mn') else []) + ([r['al']] if r.get('al') else []) + r.get('fel', [])
    o = set()
    for x in f:
        x = wn(x.replace('.', ''))
        if x:
            o.add(x)
            if x.endswith('ة'):
                o.add(x[:-1] + 'ت')
            elif r.get('tur') == 'soz' and not r.get('mn'):   # sifatning muannasi lug'atda yozilmagan: خَطِيرٌ → خَطِيرَةٌ
                o.add(x + 'ة')
    if r.get('fel'):
        m = wn(r['fel'][1]) if len(r['fel']) > 1 else ''
        if len(m) > 3 and m[0] in 'يتان':
            o.add(m[1:])
    return o


def harf_oraliq(word, n):
    """word (harakatli) ichida boshidan n ta harf (harakatlari bilan) qancha belgi."""
    i = c = 0
    while i < len(word) and c < n:
        if not HK.match(word[i]) and word[i] != 'ـ':
            c += 1
        i += 1
        while i < len(word) and (HK.match(word[i]) or word[i] == 'ـ'):
            i += 1
    return i


def dalil(note, core):
    """Таркиб izohida «بِ — жар ҳарфи» kabi harf ko'rsatilganmi."""
    if not note:
        return False
    return re.search(re.escape(wn(core)) + r'\s*[—–-]', nrm(note)) is not None or note.lstrip().startswith('[[Ҳарф')


def tok_mos(typ, core, w, note, r, ishonch):
    """Bitta bo'lak gapdagi bitta so'zga mosmi → (boshi, oxiri) yoki None."""
    s = wn(w)
    c = wn(core)
    if not c or not s:
        return None
    lead = len(w) - len(w.lstrip(PUN))
    if typ == 'pre':
        for p in ('', 'و', 'ف'):
            if s.startswith(p + c) and len(s) > len(p + c):
                if len(c) <= 2 and not dalil(note, core) and not (ishonch and note is None):
                    return None
                a = harf_oraliq(w[lead:], len(p)) + lead
                b = harf_oraliq(w[lead:], len(p) + len(c)) + lead
                hc = HK.findall(core)                    # «لَـ» (таъкид) ≠ «لِـ» (жар); жар لِ олмош билан — لَهُ, لَكَ
                if len(c) == 1 and hc == ['\u064E'] and HK.findall(w[a:b])[:1] == ['\u0650']:
                    return None
                qol = s[len(p + c):]                     # qolgani: kamida 2 harf yoki olmosh («لَا» — لَـ + ا emas)
                if len(c) == 1 and len(qol) < 2 and qol not in SUF:
                    return None
                return (a, b)
        return None
    if typ == 'suf':
        if s.endswith(c) and len(s) > len(c):
            if len(c) <= 2 and not dalil(note, core) and not (ishonch and note is None):
                return None
            b = harf_oraliq(w[lead:], len(s)) + lead
            return (harf_oraliq(w[lead:], len(s) - len(c)) + lead, b)
        return None
    oz = bosh_ozaklar(r) if len(bolak(r['ar'])) == 1 else {c, c[:-1] + 'ي' if c.endswith('ى') else c}
    if ozaklar(w, r.get('tur') in ('fel', 'harf')) & oz:
        if r.get('tur') in ('harf', 'zamir'):          # harf + olmosh (لَكِنَّهُمَا, عِنْدَهُمْ) — faqat harfning o'zi
            for p in ('', 'و', 'ف'):
                for cc in (c, c[:-1] + 'ي' if c.endswith('ى') else ''):
                    if cc and s.startswith(p + cc) and len(s) > len(p + cc):
                        return (harf_oraliq(w[lead:], len(p)) + lead, harf_oraliq(w[lead:], len(p) + len(cc)) + lead)
        return (lead, len(w.rstrip(PUN)))
    return None


def topish(words, notes, r, ishonch):
    """words — gap so'zlari; hamma bo'lak tartib bilan (oralig'i 4 so'zgacha) topilsa → [[so'z, boshi, oxiri], ...].
    notes[i] — Таркиб izohi (None — noma'lum: kitob misolidagi so'z darsda uchramagan). Avval izohi tasdiqlagani."""
    if ishonch:
        return topish1(words, notes, r, False) or topish1(words, notes, r, True)
    return topish1(words, notes, r, False)


def topish1(words, notes, r, ishonch):
    B = bolak(r['ar'])
    if not B:
        return None
    for s0 in range(len(words)):
        m = tok_mos(B[0][0], B[0][1], words[s0], notes[s0], r, ishonch)
        if not m:
            continue
        res = [[s0, m[0], m[1]]]
        j = s0
        for typ, core in B[1:]:
            ok = None
            for k in range(j, min(len(words), j + 5)):
                if k == j and typ != 'suf':
                    continue
                mm = tok_mos(typ, core, words[k], notes[k], r, True)
                if mm:
                    ok = [k, mm[0], mm[1]]
                    break
            if not ok:
                res = None
                break
            res.append(ok)
            j = ok[0]
        if res:
            return res
    return None


def mano_bolak(r):
    """Ma'nodagi tayanch bo'laklar: «...да (жар ҳарфи)» → ['да'], «... билан» → ['билан']."""
    u = re.sub(r'\([^)]*\)', ' ', ' '.join(r.get('uz', [])))
    u = re.sub(r'(^|\s)\d+\.', ' ', u)
    return [x.strip('.,;') for x in re.split(r'[\s,;/]+', u.replace('…', '...')) if len(x.strip('.,;')) >= 2]


def ball(r, note, gloss):
    b = 0
    u = ' '.join(r.get('uz', []))
    n = (note or '').lower()
    for t in TUR_SOZ:
        if t in u and t in n:
            b += 2
    for q in re.findall(r'\(([^)]*)\)', u):
        for t in re.findall(r'[\u0400-\u04FF]{5,}', q.lower()):
            if t in n:
                b += 1
    g = (gloss or '').lower()
    for t in mano_bolak(r):
        t = t.lower()
        if t and re.search(re.escape(t) + r'(\b|$)', g):
            b += 3
    return b


def gap_tanla(r, lines):
    """Topilmasa va yozuvda matndagi o'rinlar (`mw`, «qator-so'z» — Claude qoralamasi, 19.11.2026) bo'lsa — o'sha o'rindagi gap."""
    g = gap_tanla0(r, lines)
    if g or not r.get('mw'):
        return g
    for p in r['mw']:
        li, wi = [int(x) for x in p.split('-')]
        if li >= len(lines) or wi >= len(lines[li]['w']):
            continue
        w = lines[li]['w'][wi][0]
        lead = len(w) - len(w.lstrip(PUN))
        s, e = gap_chegara(lines[li], wi, wi)
        if e > s:
            return gap_yasa(lines[li], li, s, e, [[wi, lead, len(w.rstrip(PUN))]])
    return None


def gap_yasa(ln, li, s, e, m):
    AP = {'?': '؟', ',': '،', ';': '؛'}
    a = [(ln['w'][i][0] + ''.join(AP.get(c, c) for c in ln['w'][i][1])).strip() for i in range(s, e + 1)]
    tr = ' '.join(c[0] for c in (ln.get('trc') or []) if any(s <= x <= e for x in (c[1] if len(c) > 1 else []))).replace(' ,', ',')
    return {'l': li, 'r': [s, e], 'a': a, 'i': [[x[0] - s, x[1], x[2]] for x in m], 'tr': tr or ln.get('tr', '')}


def gap_tanla0(r, lines):
    """r — lug'at yozuvi; lines — shu darsning qatorlari (ajrat.py JS: w, nt, gl, trc)."""
    NT = {}
    for ln in lines:
        for w, t in zip(ln['w'], ln.get('nt') or []):
            NT.setdefault(wn(w[0]), t)
    X = []
    for k, e in enumerate(r.get('x') or []):
        ws = e[0].split()
        m = topish(ws, [NT.get(wn(w)) for w in ws], r, True)
        if m:
            X.append((len(ws) < 2, k, m))
    if X:
        X.sort(key=lambda t: (t[0], t[1]))
        if not X[0][0]:
            return {'k': X[0][1], 'i': X[0][2]}
    best = None
    for li, ln in enumerate(lines):
        ws = [w[0] for w in ln['w']]
        m = topish(ws, ln.get('nt'), r, False)
        if not m:
            continue
        s, e = gap_chegara(ln, m[0][0], m[-1][0])
        sc = ball(r, (ln.get('nt') or [''])[m[0][0]], (ln.get('gl') or [''])[m[0][0]])
        if best is None or sc > best[0]:
            best = (sc, li, s, e, m)
    if not best or (X and best[3] == best[2]):         # darsda ham bitta so'z — kitob misoli qoladi
        return {'k': X[0][1], 'i': X[0][2]} if X else None
    sc, li, s, e, m = best
    return gap_yasa(lines[li], li, s, e, m)


def gap_chegara(ln, a, b):
    """Qatorda a..b so'zlarini o'z ichiga olgan gap (tinish belgisi bo'yicha); uzun bo'lsa — vergulgacha bo'lak,
    u ham uzun bo'lsa — so'z atrofidagi 11 so'z (karta telefonga sig'sin)."""
    W = ln['w']
    def chegara(belgi):
        tug = lambda i: any(c in (W[i][1] or '') for c in belgi)
        s = a
        while s > 0 and not tug(s - 1):
            s -= 1
        e = b
        while e < len(W) - 1 and not tug(e):
            e += 1
        return s, e
    s, e = chegara('.?!؟')
    if e - s + 1 > 10:
        s, e = chegara('.?!؟,،:;؛')
    if e - s + 1 > 14:
        s, e = max(s, a - 5), min(e, max(b, a) + 5)
    return s, e
