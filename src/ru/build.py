#!/usr/bin/env python3
"""Ruscha dars sahifasini yasash (o'zbekcha sahifaga tegilmaydi).

    python3 src/ru/build.py 1 [--out DIR]     ->  DIR/ru1.html  (repo ildizidan ishga tushiriladi)
    python3 src/ru/build.py --index --out .   ->  ru-index.js, ru.js (bosh sahifaning ruscha rejimi)

Ikki qatlam:
 1) Ma'lumotda almashtiriladi (dNN.json): sarlavha, gap tarjimasi (TR), so'z ma'nosi (D ning 4-maydoni),
    lug'at (VOC), dars boshi yozuvi (HDR). Bu satrlar U+2063 bilan o'raladi — ru.js ularga tegmaydi.
 2) Qolgan hamma o'zbekcha matn (tugmalar, Таркиб, qoida kartalari, mashq izohlari) ekranda ru.js orqali
    lug'at bo'yicha o'giriladi: lugat-umumiy.txt, lugat-qoida.txt (hamma darsga) + dNN.txt (shu darsga).
    Sabab: sahifa kodi va tarkib2.js o'zbekcha matnga qarab ishlaydi (rang, mashq, Таркиб qutisi) —
    ma'lumotning o'zi tarjima qilinsa, ular buziladi.
O'zbekcha ovoz (ЎЗ) va Eshitish havolasi ruscha sahifada yo'q (UZT o'chiriladi).
"""
import re, json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
MARK = '\u2063'
AR = '[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]'
RUN = re.compile(AR + '+(?:[\\s\u060C\u2026]+' + AR + '+)*')
PARTS = re.compile(r'^([^\u0400-\u04FF\u25CC0-9«(]*)(.*?)([\s.,:;!?\u2026]*)$', re.S)


def W(s):
    return MARK + s + MARK


def norm(uz):
    """ru.js dagi find()/look() bilan bir xil kalit. Qaytaradi: (old belgi, kalit, oxirgi tinish)."""
    s = re.sub(r'\s+', ' ', uz.replace('\u200B', '')).strip()
    s = RUN.sub('\u25CC', s)
    pre, body, suf = PARTS.match(s).groups()
    body = re.sub(r'\d+(?:[.,]\d+)?', '#', body)
    up = body[:1].isupper()
    if up:
        body = body[0].lower() + body[1:]
    return pre, body, suf, up


def read_pairs(path):
    """Qator: o'zbekcha;  keyingi qator '= ruscha'.  '#' bilan boshlangan qator — izoh."""
    out, uz = [], None
    if not os.path.exists(path):
        return out
    for n, line in enumerate(open(path, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip() or line.startswith('# '):
            continue
        if line.startswith('= '):
            if uz is None:
                sys.exit('%s:%d: ruscha qator o`zbekchasiz' % (path, n))
            out.append((uz, line[2:], '%s:%d' % (os.path.basename(path), n)))
            uz = None
        else:
            if uz is not None:
                sys.exit('%s:%d: «%s» ning ruschasi yo`q' % (path, n, uz))
            uz = line
    return out


def make_dict(files):
    D, src = {}, {}
    for f in files:
        for uz, ru, where in read_pairs(f):
            pre, key, suf, up = norm(uz)
            r = ru.strip()
            keep = r.startswith('^')            # ^ — bosh harf o'zgarmasin (atoqli ot)
            if keep:
                r = r[1:]
            p, s = pre.strip(), suf.strip()
            if p and r.startswith(p):
                r = r[len(p):].lstrip()
            if s and r.endswith(s):
                r = r[:-len(s)].rstrip()
            if up and not keep and r[:1].isupper():
                r = r[0].lower() + r[1:]
            if '#' in key:   # raqamlar ekrandagi qiymat bilan almashadi (ru.js find)
                r = re.sub(r'\d+(?:[.,]\d+)?', '#', r)
                if r.count('#') != key.count('#'):
                    sys.exit('%s: raqamlar soni mos emas: %s' % (where, uz))
            nk, nr = key.count('\u25CC'), r.count('\u25CC') + len(set(re.findall(r'\{\d+\}', r)))
            if nk != nr or key.count('\u00AB\u00BB') != r.count('\u00AB\u00BB') or r.count('#') > key.count('#'):
                sys.exit('%s: o`rinlar (arabcha / «» / raqam) soni mos emas: %s' % (where, uz))
            if key in D and D[key] != r:
                sys.exit('%s: kalit takror, tarjimasi boshqa (%s): %s' % (where, src[key], uz))
            D[key] = r
            src[key] = where
    return D


def lit_span(s, name):
    m = re.search(r'(?:var |window\.)' + name + r'\s*=\s*', s)
    if not m:
        return None
    i = m.end()
    if s[i] not in '[{':
        return None
    depth, j, q = 0, i, None
    while j < len(s):
        c = s[j]
        if q:
            if c == '\\':
                j += 2
                continue
            if c == q:
                q = None
        else:
            if c in '"\'`':
                q = c
            elif c in '[{':
                depth += 1
            elif c in ']}':
                depth -= 1
                if depth == 0:
                    return (i, j + 1)
        j += 1


def put(s, name, value):
    a, b = lit_span(s, name)
    return s[:a] + value + s[b:]


def J(x):
    return json.dumps(x, ensure_ascii=False)


def build(n, out):
    src = '%d.html' % n
    s = open(src, encoding='utf-8').read()
    L = json.load(open(os.path.join(HERE, 'd%02d.json' % n), encoding='utf-8'))
    warn = []

    # --- sarlavha
    s = s.replace('<html lang="uz">', '<html lang="ru">', 1)
    s, k1 = re.subn(r'<title>.*?</title>', lambda m: '<title>' + L['title'] + '</title>', s, count=1, flags=re.S)
    s, k2 = re.subn(r'<h1>.*?</h1>', lambda m: '<h1>' + W(L['title']) + '</h1>', s, count=1, flags=re.S)
    assert k1 == 1 and k2 == 1, 'title/h1 topilmadi'

    # --- D: so'z ma'nosi (4-maydon). Qolgan maydonlar (izoh — kod shunga qarab ishlaydi) o'zbekcha qoladi.
    a, b = lit_span(s, 'D')
    rows = [0]

    def row(m):
        i = rows[0]
        rows[0] += 1
        ws = m.group(1).split('/')
        for j, w in enumerate(ws):
            f = w.split('|')
            if len(f) < 4:
                sys.exit('D %d-%d: maydon yetmaydi' % (i, j))
            k = '%d-%d' % (i, j)
            if k not in L['mn']:
                sys.exit('d%02d.json mn: %s yo`q (%s)' % (n, k, f[0]))
            ru = L['mn'][k]
            if re.search(r'[/|`]', ru):
                sys.exit('mn %s: / | ` belgilari mumkin emas' % k)
            f[3] = ('!' if f[3].startswith('!') else '') + (W(ru) if ru else '')
            ws[j] = '|'.join(f[:4])
        nw.append(len(ws))
        return '`' + '/'.join(ws) + '`'
    nw = []
    Dn = re.sub(r'`([^`]*)`', row, s[a:b])
    s = s[:a] + Dn + s[b:]

    # --- TR: gap tarjimasi (bo'laklar va arabcha so'z raqamlari)
    old = json.loads(s[slice(*lit_span(s, 'TR'))])
    TR = L['tr']
    if len(TR) != len(old) or len(TR) != len(nw):
        sys.exit('TR: qatorlar soni %d, kerak %d' % (len(TR), len(old)))
    for i, ln in enumerate(TR):
        used = set()
        for ch in ln:
            for w in ch[1]:
                if not 0 <= w < nw[i]:
                    sys.exit('TR %d: so`z raqami %d yo`q' % (i, w))
                used.add(w)
        if len(used) != nw[i]:
            warn.append('TR %d: tarjimada ko`rsatilmagan so`zlar %s' % (i, sorted(set(range(nw[i])) - used)))
    s = put(s, 'TR', J([[[W(ch[0]), ch[1]] for ch in ln] for ln in TR]))

    # --- VOC: lug'at (raqam va arabchasi o'zgarmaydi)
    sp = lit_span(s, 'VOC')
    if sp:
        V = json.loads(s[sp[0]:sp[1]])
        for q in V:
            if q[0] not in L['voc']:
                sys.exit('d%02d.json voc: %s yo`q (%s)' % (n, q[0], q[1]))
            r = L['voc'][q[0]]
            if len(r['m']) != len(q[2]) or len(r.get('x', [])) != len(q[3]):
                sys.exit('voc %s: ma`no/misol soni mos emas' % q[0])
            q[2] = [' '.join(W(p) for p in re.split(r'\s(?=\d\.\s)', t)) for t in r['m']]
            for e, x in zip(q[3], r.get('x', [])):
                if len(x) != len(e) - 1:
                    sys.exit('voc %s: misol tarjimalari soni mos emas' % q[0])
                e[1:] = [W(t) for t in x]
        s = put(s, 'VOC', J(V))

    # --- HDR: dars boshi yozuvi
    sp = lit_span(s, 'HDR')
    if sp:
        H = json.loads(s[sp[0]:sp[1]])
        if len(H['rows']) != len(L['hdr']):
            sys.exit('hdr: qatorlar soni %d, kerak %d' % (len(L['hdr']), len(H['rows'])))
        for r, u in zip(H['rows'], L['hdr']):
            r['u'] = W(u)
        s = put(s, 'HDR', J(H))

    # --- o'zbekcha ovoz (ЎЗ) va Eshitish havolasi yo'q
    sp = lit_span(s, 'UZT')
    if sp:
        s = s[:sp[0]] + 'null' + s[sp[1]:]
    s = re.sub(r'<script>\(function\(\)\{var d=document\.querySelector\("\.dh"\)[^<]*?className="lq"[\s\S]*?</script>', '', s, count=1)

    # --- ruscha qatlam: lug'at + ru.js (sahifa boshida, boshqa skriptlardan oldin)
    D = make_dict([os.path.join(HERE, f) for f in ('lugat-umumiy.txt', 'lugat-qoida.txt', 'd%02d.txt' % n)])
    js = open(os.path.join(HERE, 'ru.js'), encoding='utf-8').read()
    css = open(os.path.join(HERE, 'ru.css'), encoding='utf-8').read() if os.path.exists(os.path.join(HERE, 'ru.css')) else ''
    inj = '<script>window.RU_DICT=' + J(D).replace('</', '<\\/') + '</script>\n<script>' + js + '</script>\n'
    s, k = re.subn(r'(<meta charset="utf-8">\n?)', lambda m: m.group(1) + inj, s, count=1)
    assert k == 1, 'meta charset topilmadi'
    if css:
        s = s.replace('</head>', '<style>' + css + '</style></head>', 1)

    os.makedirs(out, exist_ok=True)
    dst = os.path.join(out, 'ru%d.html' % n)
    open(dst, 'w', encoding='utf-8').write(s)
    print('%s -> %s (%d belgi, lug`at %d ta)' % (src, dst, len(s), len(D)))
    for w in warn:
        print('  ! ' + w)


def build_index(out):
    """Bosh sahifa uchun: ru-index.js (lug'at + ruschasi tayyor darslar) va ru.js nusxasi."""
    import glob
    ready = sorted(int(re.match(r'd(\d+)\.json$', os.path.basename(f)).group(1)) for f in glob.glob(os.path.join(HERE, 'd[0-9]*.json')))
    D = make_dict([os.path.join(HERE, f) for f in ('lugat-umumiy.txt', 'lugat-bosh.txt')])
    js = '/* src/ru/build.py --index yasaydi — qo\'lda o\'zgartirilmaydi */\nwindow.RU_LESSONS=' + J(ready) + ';\nwindow.RU_DICT=' + J(D) + ';\n'
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'ru-index.js'), 'w', encoding='utf-8').write(js)
    open(os.path.join(out, 'ru.js'), 'w', encoding='utf-8').write(open(os.path.join(HERE, 'ru.js'), encoding='utf-8').read())
    print('ru-index.js, ru.js -> %s (darslar %s, lug`at %d ta)' % (out, ready, len(D)))


if __name__ == '__main__':
    a = sys.argv[1:]
    out = '.'
    if '--out' in a:
        i = a.index('--out')
        out = a[i + 1]
        del a[i:i + 2]
    if '--index' in a:
        a.remove('--index')
        build_index(out)
    elif not a:
        sys.exit(__doc__)
    for x in a:
        build(int(x), out)
